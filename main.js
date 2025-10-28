// main.js
// SỬA: Import thêm 'images' và 'events' để dùng cho backup
import { loadImages, addImage, deleteImage, renderImages, images } from "./images.js";
import { loadEvents, addEvent, deleteEvent, renderEvents, events } from "./events.js";
import { birthdays, renderBirthdays, checkBirthday } from "./birthday.js";
import { renderGame } from "./game.js"; // SỬA: Bỏ import initGame
import { initMusic } from "./music.js";

const content = document.getElementById("content");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");
const navLinks = document.querySelectorAll("nav a");

const pages = {
  home: {
    title: "🌟 10A11 - Phép Màu Của Chúng Tôi 🌟",
    subtitle: "Chào mừng bạn đến với trang web của lớp 10A11 💫",
    html: `<div class='card'><h2>🎓 Giới Thiệu</h2>
           <p>Chúng tôi là lớp 10A11, nơi tình bạn và sự nỗ lực cùng tạo nên những phép màu ✨</p>
           <button class='add-btn' onclick='backupData()'>☁️ Sao lưu dữ liệu</button></div>`
  },
  images: { title: "📸 Hình Ảnh", subtitle: "Khoảnh khắc đáng nhớ 💫" },
  events: { title: "🎉 Sự Kiện", subtitle: "Kỷ niệm tuyệt vời ❤️" },
  birthdays: { title: "🎂 Sinh Nhật", subtitle: "Chúc mừng tuổi mới 💝" },
  game: { title: "🎮 Trò Chơi", subtitle: "Giải trí nhẹ 🎈" }
};

// Backup dữ liệu
export function backupData() {
  const data = {
    // SỬA: Dùng 'images' và 'events' đã import, thay vì window.
    images: images || [],
    events: events || [],
    birthdays,
    date: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-10A11.json";
  a.click();
  URL.revokeObjectURL(url);
  alert("✅ Dữ liệu đã sao lưu!");
}

// --- SỬA LỖI SỐ 1: Gắn các hàm vào window để HTML gọi được ---
window.backupData = backupData;
window.addEvent = addEvent;
window.deleteEvent = deleteEvent;
window.addImage = addImage;
window.deleteImage = deleteImage;
// --------------------------------------------------------

// Load page SPA
export async function loadPage(page) {
  pageTitle.textContent = pages[page].title;
  pageSubtitle.textContent = pages[page].subtitle;

  switch(page) {
    case "images":
      await loadImages();
      content.innerHTML = renderImages();
      break;
    case "events":
      await loadEvents();
      content.innerHTML = renderEvents();
      break;
    case "birthday":
      content.innerHTML = renderBirthdays();
      break;
    case "game":
      content.innerHTML = renderGame();
      // SỬA LỖI SỐ 2: Xóa 'initGame()' ở đây vì 'renderGame' đã tự gọi
      break;
    default:
      content.innerHTML = pages.home.html;
  }

  navLinks.forEach(l => l.classList.toggle("active", l.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Navigation
navLinks.forEach(link => link.addEventListener("click", e => {
  e.preventDefault();
  loadPage(link.dataset.page);
}));

// Init
(async function init() {
  initMusic();      // Nút nhạc
  checkBirthday();  // Kiểm tra sinh nhật hôm nay

  // --- SỬA LỖI SỐ 3: Thêm code cho nút Lên Đầu Trang ---
  const topBtn = document.getElementById("top-btn");
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 200);
  });
  // --------------------------------------------------

  await loadPage("home");
})();