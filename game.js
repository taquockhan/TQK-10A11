// SỬA: Import 'db' từ tệp firebase.js, không gọi getFirestore()
import { db } from "./firebase.js"; 
import { collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Lưu điểm cao nhất
let highScore = 0;

// Khởi tạo game
export function renderGame() {
  // SỬA 1: Nâng cấp lên 16 cặp (32 thẻ)
  const emojis = [
    "🍎","🍎","🐱","🐱","🌸","🌸","⚽","⚽",
    "⭐","⭐","💖","💖","🔥","🔥","🎈","🎈",
    "🚀","🚀","🤖","🤖","🎉","🎉","💡","💡",
    "📚","📚","☀️","☀️","🌙","🌙","🍀","🍀"
  ];

  const shuffled = emojis.sort(() => 0.5 - Math.random());
  let html = `<div class='card'>
    <h2>🎮 Lật Thẻ Đoán Đôi</h2>
    <p id="score">Điểm: 0 | Cao nhất: ${highScore}</p>
    
    <div id='game' style='display:grid;grid-template-columns:repeat(8,60px);gap:10px;'>`;

  shuffled.forEach(e => html += `<button class='tile' data-emoji='${e}'>?</button>`);
  html += `</div></div>`;
  setTimeout(() => initGame(shuffled.length/2), 50); // Tự động nhận 16 cặp
  return html;
}

function updateScoreDisplay(score) {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = `Điểm: ${score} | Cao nhất: ${highScore}`;
}

export async function initGame(totalPairs) {
  const tiles = document.querySelectorAll(".tile");
  let first = null;
  let matched = 0;
  let score = 0;

  tiles.forEach(tile => {
    tile.textContent = "?";
    // Đảm bảo không gắn listener 2 lần nếu hàm bị gọi lại
    tile.replaceWith(tile.cloneNode(true)); 
  });
  
  // Phải query lại tiles sau khi clone
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", async () => {
      if (tile.textContent !== "?") return;
      tile.textContent = tile.dataset.emoji;

      if (!first) first = tile;
      else {
        if (first.dataset.emoji === tile.dataset.emoji) {
          first = null;
          matched++;
          score++;
          if (score > highScore) {
            highScore = score;
            saveHighScore(highScore); 
          }
          updateScoreDisplay(score);
          if (matched === totalPairs) {
            alert(`🎉 Hoàn thành! Điểm của bạn: ${score}`);
          }
        } else {
          const tempFirst = first;
          first = null;
          setTimeout(() => {
            tempFirst.textContent = "?";
            tile.textContent = "?";
          }, 800);
        }
      }
    });
  });

  // Load điểm cao từ Firebase
  const hs = await getHighScore();
  if (hs !== null) {
    highScore = hs;
    updateScoreDisplay(score);
  }
}

// ... (Các hàm saveHighScore và getHighScore giữ nguyên) ...
export async function saveHighScore(score) {
  try {
    await addDoc(collection(db, "highscores"), { score, date: new Date().toISOString() });
  } catch (e) {
    console.error("Lỗi lưu điểm cao:", e.message);
    if (e.message.includes("PERMISSION_DENIED")) {
      alert("Lỗi: Bạn không có quyền lưu điểm. Hãy kiểm tra Security Rules trên Firebase!");
    }
  }
}

export async function getHighScore() {
  const q = query(collection(db, "highscores"), orderBy("score", "desc"), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data().score;
  return 0;
}