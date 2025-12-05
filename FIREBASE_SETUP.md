# Firebase Firestore 設定指南

本專案已整合 Firebase Firestore 用於文章雲端存儲。按照以下步驟完成設定：

## 第 1 步：建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」(Create project)
3. 輸入專案名稱（例如：OneBreathRestStop）
4. 按照指示完成建立

## 第 2 步：建立 Firestore 資料庫

1. 在 Firebase Console 中選擇你的專案
2. 左側選單找到「Build」→ 「Firestore Database」
3. 點擊「建立資料庫」(Create database)
4. 選擇「以測試模式啟動」(Start in test mode)
   - **注意**：測試模式允許任何人讀寫（僅限開發）
   - 生產環境應設定安全規則
5. 選擇最近的區域
6. 點擊「建立」

## 第 3 步：取得 Firebase 配置

1. 在 Firebase Console 中，點擊齒輪圖示 ⚙️ → **專案設定** (Project Settings)
2. 找到「你的應用程式」區域
3. 如果還未建立 Web 應用，點擊「</> Web」建立
4. 複製下面的配置物件中的值：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxx",           // 複製這個
  authDomain: "your-project.firebaseapp.com",   // 複製這個
  projectId: "your-project",                    // 複製這個
  storageBucket: "your-project.appspot.com",    // 複製這個
  messagingSenderId: "123456789",               // 複製這個
  appId: "1:123456789:web:xxxxxxxxxxxxx"        // 複製這個
};
```

## 第 4 步：設定環境變數

編輯專案根目錄的 `.env` 檔案，新增以下內容：

```dotenv
# 現有設定保留
GEMINI_API_KEY=...
VITE_API_KEY=...

# Firebase 設定（從 Firebase Console 複製）
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

## 第 5 步：測試設定

1. 重新啟動開發伺服器（若已執行）
   ```bash
   npm run build
   npm run preview
   ```

2. 在應用程式中進入「療癒文章」頁面

3. 嘗試新增一篇文章

4. 如果成功，文章應該會出現在列表中

5. 檢查 Firestore Console 是否有新建立的 `articles` 集合

## 第 6 步：生產環境安全規則（重要！）

測試模式的規則不安全。部署前，請在 Firestore 中設定安全規則：

進入 Firestore → **Rules** 標籤，設定為：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允許所有人讀取文章，但只有經過身份驗證的用戶可寫
    match /articles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

或者，如果暫時只需測試，可保留測試規則但記得上線前修改。

## 常見問題排查

### 錯誤：「No Firebase App」
- 檢查 `.env` 檔案中的所有 Firebase 環境變數是否已正確設定
- 確保環境變數名稱與 `services/firebaseConfig.ts` 中的變數名稱一致

### 錯誤：「Missing or insufficient permissions」
- 確認 Firestore 規則允許寫入操作（測試模式應允許）
- 檢查 Firestore Console 中是否有權限錯誤

### 文章無法顯示
- 檢查瀏覽器開發者工具的 Console 中是否有錯誤
- 確認 Firestore 中的 `articles` 集合是否存在
- 檢查網路連線是否正常

## 額外資源

- [Firebase 文件](https://firebase.google.com/docs)
- [Firestore 文件](https://firebase.google.com/docs/firestore)
- [Firebase 安全規則](https://firebase.google.com/docs/rules)

---

設定完成後，文章會自動保存到 Firestore 雲端，支援跨裝置同步！
