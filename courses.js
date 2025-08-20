import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

const coursesList = document.getElementById("coursesList");
const searchBox = document.getElementById("searchBox");

let allCourses = [];

// تحويل لينك يوتيوب إلى embed نظيف
function getEmbedUrl(url) {
  try {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`;
  } catch {
    return url;
  }
}

// عرض الكورسات
function displayCourses(courses) {
  coursesList.innerHTML = "";
  courses.forEach(data => {
    const div = document.createElement("div");
    div.className = "course";
    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc || ""}</p>
      <iframe src="${getEmbedUrl(data.video)}" allowfullscreen></iframe>
    `;
    coursesList.appendChild(div);
  });
}

// جلب الكورسات من قاعدة البيانات
onChildAdded(ref(db, "courses"), (snapshot) => {
  const data = snapshot.val();
  allCourses.push(data);
  displayCourses(allCourses);
});

// البحث
searchBox.addEventListener("input", () => {
  const term = searchBox.value.toLowerCase();
  const filtered = allCourses.filter(c =>
    c.title.toLowerCase().includes(term) ||
    (c.desc && c.desc.toLowerCase().includes(term))
  );
  displayCourses(filtered);
});

// الفلترة
window.filterCategory = function(cat, event) {
  if (cat === "all") {
    displayCourses(allCourses);
  } else {
    const filtered = allCourses.filter(c => c.category === cat);
    displayCourses(filtered);
  }

  // زر نشط
  document.querySelectorAll(".controls button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
};