// استدعاء Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFM3ByYmRcwWJG93gYGZij04Ec-U9pHU4",
  authDomain: "el-samurai-courses.firebaseapp.com",
  databaseURL: "https://el-samurai-courses-default-rtdb.firebaseio.com",
  projectId: "el-samurai-courses",
  storageBucket: "el-samurai-courses.firebasestorage.app",
  messagingSenderId: "104544904748",
  appId: "1:104544904748:web:e2cb1e0fd6af7d029f9389",
  measurementId: "G-4QQX61PR9K"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// طلب يوزرنيم
let username = prompt("📝 أدخل اسمك المستعار:");
if (!username) username = "مستخدم مجهول";

// عناصر الصفحة
const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const chatRef = ref(db, "chat");

// إرسال رسالة
sendBtn.addEventListener("click", () => {
  const text = msgInput.value.trim();
  if (text !== "") {
    push(chatRef, {
      user: username,
      message: text,
      time: new Date().toLocaleTimeString()
    });
    msgInput.value = "";
  }
});

// استقبال الرسائل من قاعدة البيانات
onChildAdded(chatRef, (data) => {
  const msgData = data.val();
  const msg = document.createElement("div");
  msg.className = "msg";
  msg.innerText = `${msgData.user}: ${msgData.message}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});