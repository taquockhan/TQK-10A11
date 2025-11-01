import { db, storage } from "./firebase.js"; 
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
// THÊM: Import ServerTimestamp để lấy thời gian chính xác từ Firebase
import { 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"; 

import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

export let images = [];

// =================================================================
// TẢI DỮ LIỆU TỪ FIRESTORE (Không thay đổi)
// =================================================================

export async function loadImages() {
  const imgSnap = await getDocs(collection(db, "images"));
  images = imgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  return images;
}

// =================================================================
// HIỂN THỊ GIAO DIỆN (Sửa để hiển thị ngày tải lên)
// =================================================================

export function renderImages() {
  let html = `<div class='card'><h2>🖼 Hình ảnh/Video lớp</h2><div class='gallery'>`;
  
  images.forEach((img, i) => {
    const isVideo = img.type && img.type.startsWith('video/');
    const mediaElement = isVideo
      ? `<video controls src='${img.url}' alt='Media ${i+1}'></video>`
      : `<img src='${img.url}' alt='Ảnh ${i+1}'>`;

    // CHUYỂN ĐỔI TIMESTAMP THÀNH NGÀY/GIỜ
    let dateString = 'Chưa rõ';
    if (img.uploadedAt && img.uploadedAt.toDate) {
        // Chuyển đổi Firestore Timestamp thành đối tượng Date của JS
        const date = img.uploadedAt.toDate();
        // Định dạng ngày tháng
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
// THAY THẾ: uploadFile() (Thêm serverTimestamp)
// =================================================================

export async function uploadFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  alert(`Bắt đầu tải lên tệp: ${file.name}... Vui lòng đợi.`); 

  const timeStamp = new Date().getTime();
  const storageRef = ref(storage, `uploads/${timeStamp}_${file.name}`);
  
  try {
    const uploadTask = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(uploadTask.ref);

    // 🌟 THAY ĐỔI QUAN TRỌNG: Thêm trường uploadedAt với serverTimestamp
    const docRef = await addDoc(collection(db, "images"), { 
      url: url,
      name: file.name,
      type: file.type,
      uploadedAt: serverTimestamp() // <== Tự động lấy thời gian của máy chủ Firebase
    });

    // Sau khi thêm thành công, chúng ta tải lại dữ liệu từ Firestore 
    // hoặc cập nhật mảng images với Timestamp tạm thời để hiển thị.
    // Cách an toàn nhất là load lại dữ liệu để có Timestamp chính xác:
    await loadImages(); 
    document.getElementById("content").innerHTML = renderImages();
    alert(`Tệp "${file.name}" đã tải lên thành công!`);

  } catch (error) {
    console.error("Lỗi khi tải lên tệp:", error);
    alert("Có lỗi xảy ra khi tải tệp lên. Vui lòng kiểm tra console và quy tắc bảo mật Storage.");
  }
}

// =================================================================
// XỬ LÝ XÓA (Giữ nguyên)
// =================================================================

export async function deleteImage(id) {
  if (!confirm("Bạn chắc muốn xóa ảnh này?")) return;

  await deleteDoc(doc(db, "images", id));
  images = images.filter(img => img.id !== id);

  document.getElementById("content").innerHTML = renderImages();
}
