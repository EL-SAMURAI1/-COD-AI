import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import { 
  getDatabase, ref, push, onChildAdded, remove, update 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// 🟢 عناصر الكورسات
const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const videoInput = document.getElementById("videoUrl");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addCourse");
const coursesList = document.getElementById("coursesList");

// 🟡 عناصر الإشعارات
const notifTitle = document.getElementById("notifTitle");
const notifMsg = document.getElementById("notifMsg");
const addNotifBtn = document.getElementById("addNotif");
const notifsList = document.getElementById("notifsList");

let courses = [];
let notifs = [];

// 🔑 تحويل لينك يوتيوب لـ embed
function getEmbedUrl(url) {
  try {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`;
  } catch {
    return url;
  }
}

//////////////////////////////////////
// 🟢 إضافة كورس جديد
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const video = videoInput.value.trim();
  const category = categoryInput.value;

  if (!title || !video) {
    alert("❌ لازم تكتب عنوان الكورس ورابط الفيديو!");
    return;
  }

  // الكورس الجديد يضاف بالأحدث (id جديد يروح في الأول)
  push(ref(db, "courses"), {
    title,
    desc,
    video,
    category,
    createdAt: Date.now()
  });

  // تفريغ الفورم
  titleInput.value = "";
  descInput.value = "";
  videoInput.value = "";
  categoryInput.value = "برمجة";
});

// 🟡 عرض الكورسات
onChildAdded(ref(db, "courses"), (snapshot) => {
  const course = snapshot.val();
  course.id = snapshot.key;
  courses.unshift(course); // 👉 نخلي الجديد فوق
  renderCourses();
});

// 🟣 تحديث واجهة عرض الكورسات
function renderCourses() {
  coursesList.innerHTML = "";

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course";
    div.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.desc || ""}</p>
      <iframe src="${getEmbedUrl(course.video)}" allowfullscreen></iframe>
      <div class="course-actions">
        <button class="btn-edit">✏️ تعديل</button>
        <button class="btn-delete">🗑️ حذف</button>
      </div>
    `;

    // زر التعديل
    div.querySelector(".btn-edit").addEventListener("click", () => {
      const newTitle = prompt("✏️ اكتب العنوان الجديد:", course.title);
      const newDesc = prompt("📝 اكتب الوصف الجديد:", course.desc);
      const newVideo = prompt("📹 ضع رابط الفيديو الجديد:", course.video);

      if (newTitle && newVideo) {
        update(ref(db, "courses/" + course.id), {
          title: newTitle,
          desc: newDesc,
          video: newVideo,
          category: course.category,
          createdAt: course.createdAt
        });
        course.title = newTitle;
        course.desc = newDesc;
        course.video = newVideo;
        renderCourses();
      }
    });

    // زر الحذف
    div.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("⚠️ هل متأكد أنك تريد حذف هذا الكورس؟")) {
        remove(ref(db, "courses/" + course.id));
        courses = courses.filter(c => c.id !== course.id);
        renderCourses();
      }
    });

    coursesList.appendChild(div);
  });
}

//////////////////////////////////////
// 🟢 إضافة إشعار جديد
addNotifBtn.addEventListener("click", () => {
  const title = notifTitle.value.trim();
  const msg = notifMsg.value.trim();

  if (!title || !msg) {
    alert("❌ لازم تكتب عنوان الإشعار ومحتواه!");
    return;
  }

  push(ref(db, "notifications"), {
    title,
    msg,
    createdAt: Date.now()
  });

  notifTitle.value = "";
  notifMsg.value = "";
});

// 🟡 عرض الإشعارات
onChildAdded(ref(db, "notifications"), (snapshot) => {
  const notif = snapshot.val();
  notif.id = snapshot.key;
  notifs.unshift(notif); // 👉 الجديد يظهر فوق
  renderNotifs();
});

// 🟣 تحديث واجهة عرض الإشعارات
function renderNotifs() {
  notifsList.innerHTML = "";

  notifs.forEach(notif => {
    const div = document.createElement("div");
    div.className = "notification";
    div.innerHTML = `
      <h4>${notif.title}</h4>
      <p>${notif.msg}</p>
      <div class="notif-actions">
        <button class="btn-delete">🗑️ حذف</button>
      </div>
    `;

    // زر الحذف
    div.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("⚠️ هل متأكد أنك تريد حذف هذا الإشعار؟")) {
        remove(ref(db, "notifications/" + notif.id));
        notifs = notifs.filter(n => n.id !== notif.id);
        renderNotifs();
      }
    });

    notifsList.appendChild(div);
  });
}