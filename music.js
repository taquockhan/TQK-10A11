// Tệp music.js
// Danh sách nhạc khớp với các tệp .mp3 của bạn
const musicPlaylist = [
  "phep-mau.mp3",
  "thang-nam-khong-tro-lai.mp3",
  "thoi-hoc-sinh.mp3"
];

let currentTrack = 0;
let isPlaying = false;
const audio = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

function playMusic() {
  audio.src = musicPlaylist[currentTrack];
  audio.play().catch(e => console.warn("Cần tương tác của người dùng để phát nhạc"));
  isPlaying = true;
  musicBtn.textContent = "🎵 Tạm dừng";
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  musicBtn.textContent = "🎵 Phát nhạc";
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % musicPlaylist.length; // Quay vòng
  playMusic();
}

export function initMusic() {
  // Sự kiện khi nhấn nút
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Sự kiện khi nhạc kết thúc -> tự động chuyển bài
  audio.addEventListener("ended", () => {
    nextTrack();
  });
}