import { db } from "./firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export let images = [];

export async function loadImages() {
  const imgSnap = await getDocs(collection(db, "images"));
  images = imgSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  return images;
}

export function renderImages() {
  let html = `<div class='card'><h2>🖼 Hình ảnh lớp</h2><div class='gallery'>`;
  images.forEach((img, i) => {
    html += `<div style='position:relative;'>
      <img src='${img.url}' alt='Ảnh ${i+1}'>
      <button class='add-btn' style='position:absolute;top:5px;right:5px;background:red;' onclick='deleteImage("${img.id}")'>❌</button>
    </div>`;
  });
  html += `</div><button class='add-btn' onclick='addImage()'>➕ Thêm ảnh</button></div>`;
  return html;
}

export async function addImage() {
  const url = prompt("Nhập URL ảnh mới:");
  if (url) {
    const docRef = await addDoc(collection(db, "images"), { url });
    images.push({ id: docRef.id, url });
    
    // SỬA: Tự động cập nhật lại giao diện
    document.getElementById("content").innerHTML = renderImages();
  }
}

export async function deleteImage(id) {
  if (!confirm("Bạn chắc muốn xóa ảnh này?")) return;
  await deleteDoc(doc(db, "images", id));
  images = images.filter(img => img.id !== id);

  // SỬA: Tự động cập nhật lại giao diện
  document.getElementById("content").innerHTML = renderImages();
}