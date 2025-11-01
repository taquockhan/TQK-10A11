import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
// THÊM: Import getStorage
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfSdE414STdSaJSVYp0Ej-jFBelLYWFQ4",
  authDomain: "a11-web.firebaseapp.com",
  projectId: "a11-web",
  storageBucket: "a11-web.firebasestorage.app",
  messagingSenderId: "261352376499",
  appId: "1:261352376499:web:0984cf98a1ad477c6948c6",
  measurementId: "G-40LK8ZB0C6"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và xuất Firestore
const db = getFirestore(app);

// THÊM: Khởi tạo và xuất Storage
const storage = getStorage(app);

// Xuất các module cần thiết
export { db, storage };
