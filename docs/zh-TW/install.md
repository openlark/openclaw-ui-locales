# OpenClaw 安裝

## 系統要求

- **[Node 22+](https://nodejs.org/zh-tw/download)**（若缺少，安裝腳本會自動安裝）
- macOS、Linux 或 Windows
- 若要從原始碼建置，僅支援 pnpm

## 安裝方式

### 安裝腳本

下載命令列工具，透過 npm 全域安裝，並啟動入門引導。

**macOS / Linux / WSL2**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows（PowerShell）**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### npm / pnpm

若已安裝 [Node 22+](https://nodejs.org/zh-tw/download) 且希望自行管理安裝：

**npm**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**pnpm**

```bash
pnpm add -g openclaw@latest
# 審核 openclaw、node-llama-cpp、sharp 等相依套件
pnpm approve-builds -g
openclaw onboard --install-daemon
```

### 從原始碼安裝

適用於貢獻者或希望從本地程式碼庫執行的使用者。

1. **複製並建置**

複製 OpenClaw 倉庫並建置：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

2. **全域連結命令列工具**

讓 openclaw 命令在全域可用：

```bash
pnpm link --global
```

或跳過連結步驟，在倉庫目錄內透過 `pnpm openclaw ...` 執行命令。

3. **執行初始化程式**

```bash
openclaw onboard --install-daemon
```

## 安裝後

驗證系統執行狀態：

```bash
# 檢查設定問題
openclaw doctor
# 閘道器狀態
openclaw status
# 開啟瀏覽器介面
openclaw dashboard
# 閘道器重新啟動
openclaw gateway restart
```

若需自訂執行時期路徑，請使用：
- **OPENCLAW_HOME** 用於基於使用者目錄的內部路徑
- **OPENCLAW_STATE_DIR** 用於可變狀態儲存位置
- **OPENCLAW_CONFIG_PATH** 用於設定檔儲存位置