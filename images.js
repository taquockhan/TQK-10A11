import { db, storage } from "./firebase.js"; 
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  serverTimestamp // Import serverTimestamp cho việc ghi nhận ngày giờ
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { 
  ref, 
  uploadBytesResumable, // 🌟 QUAN TRỌNG: Dùng API này để theo dõi tiến trình
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

export let images = [];

// =================================================================
// TẢI DỮ LIỆU TỪ FIRESTORE
// =================================================================

export async function loadImages() {
  const imgSnap = await getDocs(collection(db, "images"));
  images = imgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  return images;
}

// =================================================================
// HIỂN THỊ GIAO DIỆN
// =================================================================

export function renderImages() {
  let html = `<div class='card'><h2>🖼 Hình ảnh/Video lớp</h2><div id='uploadStatus'></div><div class='gallery'>`; // Thêm div uploadStatus
  
  images.forEach((img, i) => {
    const isVideo = img.type && img.type.startsWith('video/');
    const mediaElement = isVideo
      ? `<video controls src='${img.url}' alt='Media ${i+1}'></video>`
      : `<img src='${img.url}' alt='Ảnh ${i+1}'>`;

    // Chuyển đổi Firestore Timestamp sang chuỗi ngày giờ
    let dateString = 'Chưa rõ';
    if (img.uploadedAt && img.uploadedAt.toDate) {
        const date = img.uploadedAt.toDate();
        dateString = date.toLocaleDateString("vi-VN") + ' ' + date.toLocaleTimeString("vi-VN");
    }

    html += `<div style='position:relative;'>
      ${mediaElement}
      <div class="metadata">
          <small>Up: ${dateString}</small>
      </div>
      <button class='add-btn' style='position:absolute;top:5px;right:5px;background:red;' onclick='deleteImage("${img.id}")'>❌</button>
    </div>`;
  });
  
  html += `</div>
    
    <input type='file' id='fileInput' style='display:none' accept='image/*,video/*' onchange='uploadFile(event)'>
    <button class='add-btn' onclick='document.getElementById("fileInput").click()'>➕ Tải lên Tệp (Ảnh/Video)</button>

    </div>`;
  return html;
}

// =================================================================
// XỬ LÝ TẢI LÊN TỆP (CÓ TIẾN TRÌNH)
// =================================================================

export async function uploadFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  // 1. Hiển thị khu vực tiến trình tải lên
  const statusDiv = document.getElementById("uploadStatus");
  statusDiv.innerHTML = `<p>Đang tải lên: ${file.name} - <span id="uploadProgress">0</span>%</p>`;
  
  const timeStamp = new Date().getTime();
  const storageRef = ref(storage, `uploads/${timeStamp}_${file.name}`);

  // 2. Bắt đầu tải lên và theo dõi tiến trình
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
        // Cập nhật giá trị tiến trình
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("uploadProgress").textContent = Math.round(progress);
    }, 
    (error) => {
        // Xử lý lỗi
        console.error("Lỗi khi tải lên tệp:", error);
        statusDiv.innerHTML = `<p style='color:red;'>Lỗi tải lên: ${error.code}</p>`;
        alert("Có lỗi xảy ra khi tải tệp lên.");
    }, 
    // 3. Xử lý hoàn tất
    async () => {
        try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            // Lưu thông tin tệp vào Firestore
            const docRef = await addDoc(collection(db, "images"), { 
                url: url,
                name: file.name,
                type: file.type,
                uploadedAt: serverTimestamp() // Ghi nhận thời gian
            });

            // Tải lại dữ liệu và cập nhật giao diện
            await loadImages();
            document.getElementById("content").innerHTML = renderImages();
            
            // Xóa thông báo tiến trình
            statusDiv.innerHTML = ''; 
            alert(`Tệp "${file.name}" đã tải lên thành công!`);

        } catch (error) {
            console.error("Lỗi khi lưu vào Firestore:", error);
            statusDiv.innerHTML = `<p style='color:red;'>Lỗi lưu trữ dữ liệu!</p>`;
        }
    }
  );
}

// =================================================================
// XỬ LÝ XÓA
// =================================================================

export async function deleteImage(id) {
  if (!confirm("Bạn chắc muốn xóa ảnh này?")) return;

  // Lưu ý: Cần thêm logic xóa tệp khỏi Firebase Storage nếu muốn xóa hoàn toàn.
  
  await deleteDoc(doc(db, "images", id));
  images = images.filter(img => img.id !== id);

  document.getElementById("content").innerHTML = renderImages();
}
