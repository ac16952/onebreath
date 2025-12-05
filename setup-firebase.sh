#!/bin/bash

# Firebase Configuration Setup Script
# 使用此腳本協助設定 Firebase 環境變數

echo "=========================================="
echo "  一息休息站 - Firebase 快速設定"
echo "=========================================="
echo ""
echo "請按照以下步驟進行："
echo ""
echo "【步驟 1】前往 Firebase Console"
echo "  👉 https://console.firebase.google.com/"
echo ""
echo "【步驟 2】建立新專案"
echo "  - 點擊「新增專案」"
echo "  - 輸入專案名稱（例如：OneBreathRestStop）"
echo "  - 完成專案建立"
echo ""
echo "【步驟 3】複製配置"
echo "  - 點擊齒輪圖示 ⚙️ → 「專案設定」"
echo "  - 在「您的應用程式」下新增 Web 應用"
echo "  - 複製下面的 6 個值："
echo ""
read -p "🔑 輸入 apiKey: " API_KEY
read -p "🔑 輸入 authDomain: " AUTH_DOMAIN
read -p "🔑 輸入 projectId: " PROJECT_ID
read -p "🔑 輸入 storageBucket: " STORAGE_BUCKET
read -p "🔑 輸入 messagingSenderId: " MESSAGING_SENDER_ID
read -p "🔑 輸入 appId: " APP_ID

echo ""
echo "【正在更新 .env 檔案...】"

# Update .env file
cat >> .env << EOF

# Firebase Configuration
VITE_FIREBASE_API_KEY=$API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=$APP_ID
EOF

echo "✅ .env 已更新！"
echo ""
echo "【步驟 4】建立 Firestore 資料庫"
echo "  - 回到 Firebase Console"
echo "  - 左側找到「Build」→「Firestore Database」"
echo "  - 點擊「建立資料庫」"
echo "  - 選擇「以測試模式啟動」"
echo "  - 選擇最近的區域"
echo "  - 點擊「建立」"
echo ""
echo "【步驟 5】完成！】"
echo "  現在可以執行："
echo ""
echo "  npm run build && npm run preview"
echo ""
echo "=========================================="
