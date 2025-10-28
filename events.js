import { db } from "./firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export let events = [];

export async function loadEvents() {
  const evSnap = await getDocs(collection(db, "events"));
  events = evSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  return events;
}

export function renderEvents() {
  let html = "";
  events.forEach(ev => {
    html += `<div class='card'>
      <h2>📅 ${ev.date} - ${ev.title}</h2>
      <p>${ev.desc}</p>
      <button class='add-btn' style='background:red;' onclick='deleteEvent("${ev.id}")'>❌</button>
    </div>`;
  });
  html += `<button class='add-btn' onclick='addEvent()'>➕ Thêm sự kiện</button>`;
  return html;
}

export async function addEvent() {
  const title = prompt("Nhập tên sự kiện:");
  const desc = prompt("Nhập mô tả sự kiện:");
  if (title && desc) {
    const date = new Date().toLocaleDateString();
    const docRef = await addDoc(collection(db, "events"), { title, desc, date });
    events.push({ id: docRef.id, title, desc, date });

    // SỬA: Tự động cập nhật lại giao diện
    document.getElementById("content").innerHTML = renderEvents();
  }
}

export async function deleteEvent(id) {
  if (!confirm("Xóa sự kiện này?")) return;
  await deleteDoc(doc(db, "events", id));
  events = events.filter(ev => ev.id !== id);

  // SỬA: Tự động cập nhật lại giao diện
  document.getElementById("content").innerHTML = renderEvents();
}