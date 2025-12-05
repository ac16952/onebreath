# Firebase 快速設定指南 (CLI 輔助)

## 3 個簡單步驟

### 步驟 1️⃣：建立 Firebase 專案

```bash
# 前往此網址（複製貼上到瀏覽器）
https://console.firebase.google.com/

# 點擊「新增專案」
# 輸入名稱：OneBreathRestStop（或任何名稱）
# 完成建立
```

---

### 步驟 2️⃣：複製配置資訊

在 Firebase Console 中：

1. 點擊 **齒輪圖示 ⚙️** → **專案設定 (Project Settings)**
2. 找到「您的應用程式」區域
3. 如果沒有 Web 應用，點擊 **</> (Web)** 建立一個
4. 複製下面這個物件中的 **6 個值**：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxx...",           // 複製這個 → VITE_FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com",  // 複製這個 → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "your-project",               // 複製這個 → VITE_FIREBASE_PROJECT_ID
  storageBucket: "your-project.appspot.com",   // 複製這個 → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012",       // 複製這個 → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:xxxxx..."     // 複製這個 → VITE_FIREBASE_APP_ID
};
```

---

### 步驟 3️⃣：更新 .env 檔案

將下面的內容複製並貼到專案根目錄的 `.env` 檔案中：

```dotenv
GEMINI_API_KEY=AIzaSyB1i9oz7mraPeFICcpj9cDw76lW65ptxBE
VITE_API_KEY=AIzaSyB1i9oz7mraPeFICcpj9cDw76lW65ptxBE

# Firebase Configuration (請替換成你複製的值)
VITE_FIREBASE_API_KEY=你的_apiKey_值
VITE_FIREBASE_AUTH_DOMAIN=你的_authDomain_值
VITE_FIREBASE_PROJECT_ID=你的_projectId_值
VITE_FIREBASE_STORAGE_BUCKET=你的_storageBucket_值
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_messagingSenderId_值
VITE_FIREBASE_APP_ID=你的_appId_值
```

---

### 額外：建立 Firestore 資料庫

1. 在 Firebase Console 中，左側找到 **Build** → **Firestore Database**
2. 點擊 **Create database**
3. 選擇 **Start in test mode**（測試模式）
4. 選擇最近的區域
5. 點擊 **Create**

---

### 完成後測試

```bash
npm run build
npm run preview
```

前往「療癒文章」頁面，嘗試新增文章。如果成功顯示，Firestore 已連線！

---

**有問題？** 回報錯誤訊息，我會協助排查。
