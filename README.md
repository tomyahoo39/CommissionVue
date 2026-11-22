# 🎨 繪圖委託管理系統 - 前端 (Vue 3)

本專案為「繪圖委託管理系統」的前端 Single Page Application (SPA)，提供訪客瀏覽作品集、線上填寫委託單、查看進度看板，以及創作者（管理者）進行後台訂單抽籤、排程與全站設定。專案已正式部署至 Vercel CDN，並實作嚴格的路由權限與資安防護機制。

🔗 **後端 API 儲存庫**：[CommissionWebAPI (ASP.NET Core API)](https://github.com/tomyahoo39/CommissionManagement)  
🌐 **線上展示網址**：`https://commission-vue.vercel.app`

---

## 🛠 技術棧 (Tech Stack)

- **Framework**: Vue 3 (Script Setup 語法)
- **Build Tool**: Vite
- **Routing**: Vue Router 4 (路由守衛 `beforeEach` 雙重權限控管)
- **HTTP Client**: Axios (整合 Request / Response 攔截器)
- **State & Token Parsing**: `jwt-decode` (動態解析 ASP.NET Core Claims)
- **UI Framework**: Bootstrap 5 (RWD 響應式介面設計)
- **Deployment**: Vercel CDN (靜態託管與環境變數注入)

---

## 🌟 核心功能 (Features)

- [x] **響應式導覽與選單**：支援手機版漢堡選單與桌面版 Dropdown 選單
- [x] **自動化 JWT 身份驗證**：
  - **Request 攔截器**：發送請求前驗證 Token 效期，自動附加 `Bearer <Token>` 通行證
  - **Response 攔截器**：全域監聽 `401 Unauthorized` 錯誤，自動清除本地 Token 並導回 `/login`
- [x] **雙重權限路由保護**：透過路由守衛檢查登入狀態與 Token 內解碼之 Admin 角色權限，阻擋未授權存取
- [x] **訪客功能**：作品集展示、目前排單進度看板、線上委託填單表、Q&A 諮詢表單
- [x] **管理者後台 (Admin)**：
  - 委託期開放設定與隨機抽籤/補抽機制
  - 排程看板編輯與狀態追蹤
  - 委託項目價目設定、首頁與社群連結維護
  - 訪客提問資訊審閱

---

## 🛡️ 安全性與網域防禦 (Security & Domain Isolation)

為確保前端運作安全與資料正確性，實作了以下防禦機制：

* **雙重權限驗證 (Dual Auth Guard)**：
  - 除了前端路由檢測 Token 是否存在，更於 API 請求層主動解碼 Token 驗證 `exp` 到期時間與 `Admin` 權限等級，避免非法偽造進入管理頁面。
* **動態網域解析與 Fallback 機制**：
  - 獨立抽出 `utils` 封裝 API 網址解析邏輯，優先使用伺服器動態環境變數（`VITE_API_URL`），若未設定或解析失敗則自動切換至預設路徑，確保開發與生產環境無縫切換。
* **圖片網域白名單與 XSS 防禦**：
  - 限縮圖片來源 Protocol 必須為 `https:` 或 `http:`（防範 `javascript:` 腳本注入），並校驗圖片來源是否屬於 Cloudinary 或白名單 CDN 網域，阻擋外部惡意圖片載入。

---

## 🔐 權限驗證架構 (Authentication & Routing)

前端採用 **JWT Token 儲存於 LocalStorage** 進行認證：

1. **角色解析 (Role Parsing)**：
   - 由於後端（ASP.NET Core）簽發之 JWT 採用標準 Claim URI Schema，前端藉由 `jwt-decode` 讀取 `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` 屬性判斷是否具備 `Admin` 權限。

2. **雙向 Axios 攔截器**：
   - **出關 (Request)**：自動夾帶 Authorization Header 並事前校驗 Token 有效性。
   - **入關 (Response)**：檢測到 Token 過期（401）時無縫重導向至登入頁。

---

## 🚀 本地開發與啟動 (Getting Started)

### 前置需求
- Node.js (v18.0.0 以上版本)
- npm

### 安裝與執行步驟

1. **複製專案 (Clone Repository)**
   ```bash
   git clone [https://github.com/tomyahoo39/CommissionVue.git](https://github.com/tomyahoo39/CommissionVue.git)
   cd CommissionVue

```

2. **安裝依賴套件 (Install Dependencies)**

```bash
npm install

```

3. **設定環境變數 (Environment Variables)**
本專案已於 `.env.development` 預設配置 Vite 代理路徑：
```env
VITE_API_URL=/api

```



4. **啟動開發伺服器 (Run Development Server)**

```bash
npm run dev

```

啟動成功後，開啟瀏覽器造訪 `http://localhost:5173` 即可開始使用。

---

## 📁 專案架構概覽 (Directory Structure)

```text
src/
├── components/                # 通用元件 (例如 Navbar 導覽列)
├── router/                    # Vue Router 路由設定與 beforeEach 導引守衛
├── services/                  # Axios 實例配置與請求/回應攔截器 (api.js)，業務邏輯與 JWT 解碼工具 (loginService.js)
├── utils/                     # 動態圖片網域解析函式
├── views/                     # 頁面組件 (分為訪客頁面與 Admin 後台管理頁面)
│   ├── CommissionOrder/       # 訂單頁面 
│   └── CommissionPeriod/      # 委託期頁面
│   └── Image/                 # 作品集頁面
│   └── Index/                 # 首頁頁面
│   └── Login/                 # 登入頁面
│   └── QaSetting/             # Q&A頁面
├── App.vue
└── main.js

```
---
## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權。
