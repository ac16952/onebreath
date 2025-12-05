# ✅ Firebase 環境變數已設定

你的 `.env` 檔案已配置以下 Firebase 設定：

```
VITE_FIREBASE_API_KEY=AIzaSyD8SlazSQVj3S4SUW25HfsFHz0uhtpbNzY
VITE_FIREBASE_AUTH_DOMAIN=onebreath-55c35.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=onebreath-55c35
VITE_FIREBASE_STORAGE_BUCKET=onebreath-55c35.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=759371354598
VITE_FIREBASE_APP_ID=1:759371354598:web:808c31e39d09bb16560627
```

---

## 最後一步：建立 Firestore 資料庫

### 1️⃣ 前往 Firebase Console
https://console.firebase.google.com/

### 2️⃣ 選擇你的專案
點擊 **onebreath-55c35** 專案

### 3️⃣ 建立 Firestore 資料庫
1. 左側選單找到 **Build** → **Firestore Database**
2. 點擊 **Create database**
3. 選擇 **Start in test mode**（測試模式）
4. 選擇最近的區域（例如：us-central1）
5. 點擊 **Create**

### 4️⃣ 驗證連線
資料庫建立後（約 1-2 分鐘），執行：

```bash
npm run preview
```

前往 http://localhost:4173/ → 選擇「療癒文章」→ 點擊「+ 新增文章」→ 填寫表單並點擊「發佈」

如果文章成功顯示，Firestore 已連線！ 🎉

---

## 🔒 重要：安全規則設定

目前是測試模式（允許任何人讀寫）。**上線前需要設定安全規則！**

### 在 Firestore 中設定規則：
1. 前往 **Firestore Database** → **Rules** 標籤
2. 替換為以下規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許所有人讀取，只有授權用戶可寫
    match /articles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. 點擊 **Publish**

---

## ✨ 完成！

現在你的應用已完全整合 Firebase Firestore：
- ✅ 文章存儲在雲端
- ✅ 跨裝置同步
- ✅ 無容量限制
- ✅ 免費額度足夠測試

需要幫助？檢查瀏覽器 DevTools 的 Console 標籤查看錯誤訊息。
