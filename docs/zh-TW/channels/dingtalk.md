# 釘釘機器人

**狀態**：生產就緒，支援機器人私聊和群組。使用 Stream 模式，無需註冊公網回調位址。

---

## 需要插件

安裝 Dingtalk 插件：

```bash
openclaw plugins install @soimy/dingtalk
```

通過本地源碼安裝：

```bash
# 1. 克隆倉庫
git clone https://github.com/soimy/openclaw-channel-dingtalk.git
cd openclaw-channel-dingtalk

# 2. 安裝依賴 (必需)
npm install

# 3. 以連結模式安裝 (方便修改代碼後即時生效)
openclaw plugins install -l .
```

本地手動安裝

1. 將本目錄下載或複製到 `~/.openclaw/extensions/dingtalk`。
2. 確保包含 `index.ts`、`openclaw.plugin.json` 和 `package.json`。
3. 如果有依賴套件，在 `~/.openclaw/extensions/dingtalk` 目錄下執行 `npm install`。
4. 執行 `openclaw plugins list` 確認 `dingtalk` 已顯示在列表中。

---

## 快速開始

添加釘釘頻道有兩種方式：

### 方式一：通過安裝嚮導添加（推薦）

如果您剛安裝完 OpenClaw，可以直接執行嚮導，根據提示添加釘釘：

```bash
openclaw onboard
```

嚮導會引導您完成：

1.  創建釘釘應用並獲取憑證
2.  配置應用憑證
3.  啟動閘道

✅ **完成配置後**，您可以使用以下命令檢查閘道狀態：

-   `openclaw gateway status` - 查看閘道運行狀態
-   `openclaw logs --follow`  - 查看即時日誌

### 方式二：通過命令列添加

如果您已經完成了初始安裝，可以用以下命令添加釘釘頻道：

```bash
openclaw channels add
```

互動式配置流程：

1.  **選擇插件** — 在插件列表中選擇 `dingtalk` 或 `DingTalk (釘釘)`
2.  **Client ID** — 輸入釘釘應用的 AppKey
3.  **Client Secret** — 輸入釘釘應用的 AppSecret
4.  **完整配置** — 可選配置 Robot Code、Corp ID、Agent ID（推薦）
5.  **卡片模式** — 可選啟用 AI 互動卡片模式
    - 如啟用，需輸入 Card Template ID 和 Card Template Key
6.  **私聊策略** — 選擇 `open`（開放）或 `allowlist`（白名單）
7.  **群聊策略** — 選擇 `open`（開放）或 `allowlist`（白名單）

✅ **完成配置後**，您可以使用以下命令管理閘道：

-   `openclaw gateway status`  - 查看閘道運行狀態
-   `openclaw gateway restart` - 重啟閘道以應用新配置
-   `openclaw logs --follow`   - 查看即時日誌

---

## 第一步：創建釘釘應用

### 1. 打開釘釘開放平台

訪問 [釘釘開發者後台](https://open-dev.dingtalk.com/fe/app)，使用釘釘帳號登錄。

### 2. 創建應用

1.  點擊 **創建應用**
2.  填寫應用名稱和描述
3.  選擇應用圖標

![創建應用](/assets/dingtalk-step2-create-app.png)

### 3. 獲取應用憑證

在應用的 **憑證與基礎信息** 頁面，複製：

-   **Client ID**（格式如 `dingxxx`）
-   **Client Secret**
-   **Agent ID**

❗ **重要**：請妥善保管 Client Secret，不要分享給他人。

![獲取應用憑證](/assets/dingtalk-step3-credentials.png)

### 4. 配置應用權限

在 **權限管理** 頁面，需要開啟以下權限：

-   ✅ **Card.Instance.Write** — 創建和投放卡片實例
-   ✅ **Card.Streaming.Write** — 對卡片進行流式更新

![配置應用權限](/assets/dingtalk-step4-permissions.png)

### 5. 啟用機器人能力

在 **應用能力** > **機器人** 頁面：

1.  開啟機器人能力
2.  配置機器人名稱

![啟用機器人能力](/assets/dingtalk-step5-bot-capability.png)

### 6. 配置事件訂閱

⚠️ **重要提醒**：在配置事件訂閱前，請務必確保已完成以下步驟：

1.  執行 `openclaw channels add` 添加了 DingTalk 頻道
2.  閘道處於啟動狀態（可通過 `openclaw gateway status` 檢查狀態）

在 **事件訂閱** 頁面：
![配置事件訂閱](/assets/dingtalk-step6-event-subscription.png)

1.  選擇 **使用 Stream 模式**（WebSocket 模式）

⚠️ **注意**：如果閘道未啟動或頻道未添加，長連接設置將保存失敗。

### 7. 發布應用

1.  在 **版本管理與發布** 頁面創建新版本
2.  提交審核並發布
3.  等待管理員審批

![版本管理與發布](/assets/dingtalk-step7-version-release.png)

---

## 第二步：配置 OpenClaw

### 通過嚮導配置（推薦）

執行以下命令，選中釘釘通道，根據提示粘貼 Client ID、Client Secret、Agent ID 和 Corp ID：

```bash
openclaw channels add
```

或者直接執行以下命令添加釘釘 Client ID、Client Secret、Agent ID 和 Corp ID：

```bash
openclaw channels add channels.dingtalk.clientId dingxxx
openclaw channels add channels.dingtalk.clientSecret xxx
openclaw channels add channels.dingtalk.agentId xxx
openclaw channels add channels.dingtalk.corpId xxx
```

選擇 **DingTalk**，然後輸入您在第一步獲取的憑證即可。

### 通過配置文件配置

編輯 `~/.openclaw/openclaw.json`：

```json5
{
  channels: {
    dingtalk: {
      enabled: true,
      dmPolicy: "pairing",
      accounts: {
        main: {
          clientId: "dingxxx",
          clientSecret: "xxx",
          agentId: "xxx",
          corpId: "xxx",
          name: "我的AI助手",
        },
      },
    },
  },
}
```

---

## 第三步：啟動並測試

### 1. 啟動閘道

```bash
openclaw gateway
```

### 2. 發送測試消息

在釘釘中找到您創建的機器人，發送一條消息。

---

## 介紹

-   ✅ **Stream 模式** — WebSocket 長連接，無需公網 IP 或 Webhook
-   ✅ **私聊支援** — 直接與機器人對話
-   ✅ **群聊支援** — 在群裡 @機器人
-   ✅ **多種消息類型** — 文本、圖片、語音（自帶識別）、影片、檔案
-   ✅ **Markdown 回覆** — 支援富文本格式回覆
-   ✅ **互動卡片** — 支援流式更新，適用於 AI 即時輸出
-   ✅ **完整 AI 對話** — 接入 OpenClaw 消息處理管線

---

## 配置選項

| 選項                     | 類型     | 預設值        | 說明                                          |
| ------------------------ | -------- | ------------- | --------------------------------------------- |
| `enabled`                | boolean  | `true`        | 是否啟用                                      |
| `clientId`               | string   | 必填          | 應用的 AppKey                                 |
| `clientSecret`           | string   | 必填          | 應用的 AppSecret                              |
| `robotCode`              | string   | -             | 機器人代碼（用於下載媒體和發送卡片）          |
| `corpId`                 | string   | -             | 企業 ID                                       |
| `agentId`                | string   | -             | 應用 ID                                       |
| `dmPolicy`               | string   | `"open"`      | 私聊策略：open/pairing/allowlist              |
| `groupPolicy`            | string   | `"open"`      | 群聊策略：open/allowlist                      |
| `allowFrom`              | string[] | `[]`          | 允許的發送者 ID 列表                          |
| `messageType`            | string   | `"markdown"`  | 消息類型：markdown/card                       |
| `cardTemplateId`         | string   |               | AI 互動卡片模板 ID（僅當 messageType=card）   |
| `cardTemplateKey`        | string   | `"content"`   | 卡片模板內容字段鍵（僅當 messageType=card）   |
| `debug`                  | boolean  | `false`       | 是否開啟調試日誌                              |
| `maxConnectionAttempts`  | number   | `10`          | 最大連接嘗試次數                              |
| `initialReconnectDelay`  | number   | `1000`        | 初始重連延遲（毫秒）                          |
| `maxReconnectDelay`      | number   | `60000`       | 最大重連延遲（毫秒）                          |
| `reconnectJitter`        | number   | `0.3`         | 重連延遲抖動因子（0-1）                       |

### 連接魯棒性配置

為提高連接穩定性，插件支援以下進階配置：

-   **maxConnectionAttempts**: 連接失敗後的最大重試次數，超過後將停止嘗試並報警。
-   **initialReconnectDelay**: 第一次重連的初始延遲（毫秒），後續重連會按指數增長。
-   **maxReconnectDelay**: 重連延遲的上限（毫秒），防止等待時間過長。
-   **reconnectJitter**: 延遲抖動因子，在延遲基礎上增加隨機變化（±30%），避免多個客戶端同時重連。

重連延遲計算公式：`delay = min(initialDelay × 2^attempt, maxDelay) × (1 ± jitter)`

示例延遲序列（默認配置）：~1s, ~2s, ~4s, ~8s, ~16s, ~32s, ~60s（達到上限）

## 安全策略

### 私聊策略 (dmPolicy)

-   `open` — 任何人都可以私聊機器人
-   `pairing` — 新用戶需要通過配對碼驗證
-   `allowlist` — 只有 allowFrom 列表中的用戶可以使用

### 群聊策略 (groupPolicy)

-   `open` — 任何群都可以 @機器人
-   `allowlist` — 只有配置的群可以使用

## 消息類型支援

### 接收

| 類型   | 支援 | 說明                    |
| ------ | ---- | ----------------------- |
| 文本   | ✅   | 完整支援                |
| 富文本 | ✅   | 提取文本內容            |
| 圖片   | ✅   | 下載並傳遞給 AI         |
| 語音   | ✅   | 使用釘釘語音識別結果    |
| 影片   | ✅   | 下載並傳遞給 AI         |
| 檔案   | ✅   | 下載並傳遞給 AI         |

### 發送

| 類型      | 支援 | 說明                              |
| --------- | ---- | --------------------------------- |
| 文本      | ✅   | 完整支援                          |
| Markdown  | ✅   | 自動檢測或手動指定                |
| 互動卡片  | ✅   | 支援流式更新，適用於 AI 即時輸出  |
| 圖片      | ⏳   | 需要通過媒體上傳 API              |

## API 消耗說明

### Text/Markdown 模式

| 操作        | API 調用次數 | 說明                                                                          |
| ----------- | ------------ | ----------------------------------------------------------------------------- |
| 獲取 Token  | 1            | 共用/緩存（60 秒檢查過期一次）                                                |
| 發送消息    | 1            | 使用 `/v1.0/robot/oToMessages/batchSend` 或 `/v1.0/robot/groupMessages/send` |
| **總計**    | **2**        | 每條回覆 1 次                                                                 |

### Card（AI 互動卡片）模式

| 階段         | API 調用                | 說明                                                 |
| ------------ | ----------------------- | ---------------------------------------------------- |
| **創建卡片** | 1                       | `POST /v1.0/card/instances/createAndDeliver`         |
| **流式更新** | M                       | M = 回覆塊數量，每塊一次 `PUT /v1.0/card/streaming` |
| **完成卡片** | 包含在最後一次流更新中  | 使用 `isFinalize=true` 標記                          |
| **總計**     | **1 + M**               | M = Agent 產生的回覆塊數                             |

### 典型場景成本對比

| 場景             | Text/Markdown | Card | 節省   |
| ---------------- | ------------- | ---- | ------ |
| 簡短回覆（1 塊） | 2             | 2    | ✓ 相同 |
| 中等回覆（5 塊） | 6             | 6    | ✓ 相同 |
| 長回覆（10 塊）  | 12            | 11   | ✓ 1 次 |

### 優化策略

**降低 API 調用的方法：**

1.  **合併回覆塊** — 通過調整 Agent 輸出配置，減少塊數量
2.  **使用緩存** — Token 自動緩存（60 秒），無需每次都獲取
3.  **Buffer 模式** — 使用 `dispatchReplyWithBufferedBlockDispatcher` 合併多個小塊

**成本建議：**

-   ✅ **推薦** — Card 模式：流式體驗更好，成本與 Text/Markdown 相當或更低
-   ⚠️ **謹慎** — 頻繁調用需要監測配額，建議使用釘釘開發者後台查看 API 調用量

## 消息類型選擇

插件支援兩種消息回覆類型，可通過 `messageType` 配置：

### 1. markdown（Markdown 格式）**【默認】**

-   支援富文本格式（標題、粗體、列表等）
-   自動檢測消息是否包含 Markdown 語法
-   適用於大多數場景

### 2. card（AI 互動卡片）

-   支援流式更新（即時顯示 AI 生成內容）
-   更好的視覺呈現和互動體驗
-   支援 Markdown 格式渲染
-   通過 `cardTemplateId` 指定模板
-   通過 `cardTemplateKey` 指定內容字段
-   **適用於 AI 對話場景**

**AI Card API 特性：**
當配置 `messageType: 'card'` 時：

1.  使用 `/v1.0/card/instances/createAndDeliver` 創建並投放卡片
2.  使用 `/v1.0/card/streaming` 實現真正的流式更新
3.  自動狀態管理（PROCESSING → INPUTING → FINISHED）
4.  更穩定的流式體驗，無需手動節流

**配置示例：**

```json5
{
  messageType: 'card', // 啟用 AI 互動卡片模式
  cardTemplateId: '382e4302-551d-4880-bf29-a30acfab2e71.schema', // AI 卡片模板 ID（默認值）
  cardTemplateKey: 'msgContent', // 卡片內容字段鍵（默認值：msgContent）
}
```

> **注意**：`cardTemplateKey` 應與您的卡片模板中定義的字段名稱一致。默認值為 `'msgContent'`，適用於 DingTalk 官方 AI 卡片模板。如果您使用自定義模板，請根據模板定義的字段名稱進行配置。

## 使用示例

配置完成後，直接在釘釘中：

1.  **私聊機器人** — 找到機器人，發送消息
2.  **群聊 @機器人** — 在群裡 @機器人名稱 + 消息

## 故障排除

### 收不到消息

1.  確認應用已發布
2.  確認消息接收模式是 Stream
3.  檢查 Gateway 日誌：`openclaw logs | grep dingtalk`

### 群消息無響應

1.  確認機器人已添加到群
2.  確認正確 @機器人（使用機器人名稱）
3.  確認群是企業內部群

### 連接失敗

1.  檢查 clientId 和 clientSecret 是否正確
2.  確認網絡可以訪問釘釘 API