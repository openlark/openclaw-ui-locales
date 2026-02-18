# 飛書機器人

**狀態**：生產就緒，支援機器人私聊和群組。使用 WebSocket 長連接模式接收訊息。

---

## 需要插件

安裝 Feishu 插件：

```bash
openclaw plugins install @openclaw/feishu
```

本地 checkout（在 git 倉庫內執行）：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

openclaw plugins install ./extensions/feishu
```

本地手動安裝

1. 在 git 倉庫內將 `./extensions/feishu` 目錄複製到 `~/.openclaw/extensions/feishu`。
2. 確保包含 `index.ts`、`openclaw.plugin.json` 和 `package.json`。
3. 如果有依賴套件，在 `~/.openclaw/extensions/feishu` 目錄下執行 `npm install`。
4. 執行 `openclaw plugins list` 確認 `feishu` 已顯示在列表中。

---

## 快速開始

添加飛書頻道有兩種方式：

### 方式一：通過安裝嚮導添加（推薦）

如果您剛安裝完 OpenClaw，可以直接執行嚮導，根據提示添加飛書：

```bash
openclaw onboard
```

嚮導會引導您完成：

1. 建立飛書應用並取得憑證
2. 配置應用憑證
3. 啟動閘道

✅ **完成配置後**，您可以使用以下命令檢查閘道狀態：

- `openclaw gateway status` - 查看閘道運行狀態
- `openclaw logs --follow`  - 查看即時日誌

### 方式二：通過命令列添加

如果您已經完成了初始安裝，可以用以下命令添加飛書頻道：

```bash
openclaw channels add
```

然後根據互動式提示選擇 Feishu，輸入 App ID 和 App Secret 即可。

✅ **完成配置後**，您可以使用以下命令管理閘道：

- `openclaw gateway status` - 查看閘道運行狀態
- `openclaw gateway restart` - 重啟閘道以應用新配置
- `openclaw logs --follow` - 查看即時日誌

---

## 第一步：建立飛書應用

### 1. 開啟飛書開放平台

訪問 [飛書開放平台](https://open.feishu.cn/app)，使用飛書帳號登入。

Lark（國際版）請使用 https://open.larksuite.com/app，並在配置中設定 `domain: "lark"`。

### 2. 建立應用

1. 點擊 **建立企業自建應用**
2. 填寫應用名稱和描述
3. 選擇應用圖示

![建立企業自建應用](/assets/feishu-step2-create-app.png)

### 3. 取得應用憑證

在應用的 **憑證與基礎資訊** 頁面，複製：

- **App ID**（格式如 `cli_xxx`）
- **App Secret**

❗ **重要**：請妥善保管 App Secret，不要分享給他人。

![取得應用憑證](/assets/feishu-step3-credentials.png)

### 4. 配置應用權限

在 **權限管理** 頁面，點擊 **批次匯入** 按鈕，貼上以下 JSON 配置一鍵匯入所需權限：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "docs:document.content:read",
      "event:ip_list",
      "im:chat",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.group_msg",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource",
      "sheets:spreadsheet",
      "wiki:wiki:readonly"
    ],
    "user": ["aily:file:read", "aily:file:write", "im:chat.access_event.bot_p2p_chat:read"]
  }
}
```

![配置應用權限](/assets/feishu-step4-permissions.png)
![批次匯入](/assets/feishu-step4-permissions-batchimport.png)

### 5. 啟用機器人能力

在 **應用能力** > **機器人** 頁面：

1. 開啟機器人能力
2. 配置機器人名稱

![啟用機器人能力](/assets/feishu-step5-bot-capability.png)

### 6. 配置事件訂閱

⚠️ **重要提醒**：在配置事件訂閱前，請務必確保已完成以下步驟：

1. 執行 `openclaw channels add` 添加了 Feishu 頻道
2. 閘道處於啟動狀態（可透過 `openclaw gateway status` 檢查狀態）

在 **事件訂閱** 頁面：
![配置事件訂閱](/assets/feishu-step6-event-subscription.png)

1. 選擇 **使用長連接收取事件**（WebSocket 模式）
2. 儲存之後，再添加事件：`im.message.receive_v1`（接收訊息）

⚠️ **注意**：如果閘道未啟動或頻道未添加，長連接設定將儲存失敗。

![配置事件訂閱添加](/assets/feishu-step6-event-subscription-add.png)

### 7. 發布應用

1. 在 **版本管理與發布** 頁面建立版本
2. 提交審核並發布
3. 等待管理員審批（企業自建應用通常自動通過）

---

## 第二步：配置 OpenClaw

### 透過嚮導配置（推薦）

執行以下命令，選中飛書通道，根據提示貼上 App ID 和 App Secret：

```bash
openclaw channels add
```

或者直接執行以下命令添加飛書 App ID 和 App Secret：

```bash
openclaw channels add channels.feishu.appId cli_xxx
openclaw channels add channels.feishu.appSecret xxx
```

選擇 **Feishu**，然後輸入您在第一步取得的憑證即可。

### 透過設定檔配置

編輯 `~/.openclaw/openclaw.json`：

```json5
{
  channels: {
    feishu: {
      enabled: true,
      dmPolicy: "pairing",
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "我的AI助手",
        },
      },
    },
  },
}
```

### 透過環境變數配置

```bash
export FEISHU_APP_ID="cli_xxx"
export FEISHU_APP_SECRET="xxx"
```

### Lark（國際版）域名

如果您的租戶在 Lark（國際版），請設定域名為 `lark`（或完整域名），可配置 `channels.feishu.domain` 或 `channels.feishu.accounts.<id>.domain`：

```json5
{
  channels: {
    feishu: {
      domain: "lark",
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
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

### 2. 發送測試訊息

在飛書中找到您建立的機器人，發送一條訊息。

### 3. 配對授權

預設情況下，機器人會回覆一個 **配對碼**。您需要批准此代碼：

```bash
openclaw pairing approve feishu <配對碼>
```

批准後即可正常對話。

---

## 介紹

- **飛書機器人頻道**：由閘道管理的飛書機器人
- **確定性路由**：回覆始終返回飛書，模型不會選擇頻道
- **會話隔離**：私聊共享主會話；群組獨立隔離
- **WebSocket 連接**：使用飛書 SDK 的長連接模式，無需公網 URL

---

## 存取控制

### 私聊存取

- **預設**：`dmPolicy: "pairing"`，陌生用戶會收到配對碼
- **批准配對**：
  ```bash
  openclaw pairing list feishu      # 查看待審批列表
  openclaw pairing approve feishu <CODE>  # 批准
  ```
- **白名單模式**：透過 `channels.feishu.allowFrom` 配置允許的用戶 Open ID

### 群組存取

**1. 群組策略**（`channels.feishu.groupPolicy`）：

- `"open"` = 允許群組中所有人（預設）
- `"allowlist"` = 僅允許 `groupAllowFrom` 中的用戶
- `"disabled"` = 停用群組訊息

**2. @提及要求**（`channels.feishu.groups.<chat_id>.requireMention`）：

- `true` = 需要 @機器人才回應（預設）
- `false` = 無需 @也回應

---

## 群組配置範例

### 允許所有群組，需要 @提及（預設行為）

```json5
{
  channels: {
    feishu: {
      groupPolicy: "open",
      // 預設 requireMention: true
    },
  },
}
```

### 允許所有群組，無需 @提及

需要為特定群組配置：

```json5
{
  channels: {
    feishu: {
      groups: {
        oc_xxx: { requireMention: false },
      },
    },
  },
}
```

### 僅允許特定用戶在群組中使用

```json5
{
  channels: {
    feishu: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["ou_xxx", "ou_yyy"],
    },
  },
}
```

---

## 取得群組/用戶 ID

### 取得群組 ID（chat_id）

群組 ID 格式為 `oc_xxx`，可以透過以下方式取得：

**方法一**（推薦）：

1. 啟動閘道並在群組中 @機器人發訊息
2. 執行 `openclaw logs --follow` 查看日誌中的 `chat_id`

**方法二**：
使用飛書 API 調試工具取得機器人所屬群組列表。

### 取得用戶 ID（open_id）

用戶 ID 格式為 `ou_xxx`，可以透過以下方式取得：

**方法一**（推薦）：

1. 啟動閘道並給機器人發訊息
2. 執行 `openclaw logs --follow` 查看日誌中的 `open_id`

**方法二**：
查看配對請求列表，其中包含用戶的 Open ID：

```bash
openclaw pairing list feishu
```

---

## 常用命令

| 命令      | 說明           |
| --------- | -------------- |
| `/status` | 查看機器人狀態 |
| `/reset`  | 重置對話會話   |
| `/model`  | 查看/切換模型  |

> 注意：飛書目前不支援原生指令選單，命令需要以文字形式發送。

## 閘道管理命令

在配置和使用飛書頻道時，您可能需要使用以下閘道管理命令：

| 命令                       | 說明              |
| -------------------------- | ----------------- |
| `openclaw gateway status`  | 查看閘道運行狀態  |
| `openclaw gateway install` | 安裝/啟動閘道服務 |
| `openclaw gateway stop`    | 停止閘道服務      |
| `openclaw gateway restart` | 重啟閘道服務      |
| `openclaw logs --follow`   | 即時查看日誌輸出  |

---

## 故障排除

### 機器人在群組中不回應

1. 檢查機器人是否已添加到群組
2. 檢查是否 @了機器人（預設需要 @提及）
3. 檢查 `groupPolicy` 是否為 `"disabled"`
4. 查看日誌：`openclaw logs --follow`

### 機器人收不到訊息

1. 檢查應用是否已發布並審批通過
2. 檢查事件訂閱是否配置正確（`im.message.receive_v1`）
3. 檢查是否選擇了 **長連接** 模式
4. 檢查應用權限是否完整
5. 檢查閘道是否正在運行：`openclaw gateway status`
6. 查看即時日誌：`openclaw logs --follow`

### App Secret 洩露怎麼辦

1. 在飛書開放平台重設 App Secret
2. 更新設定檔中的 App Secret
3. 重啟閘道

### 發送訊息失敗

1. 檢查應用是否有 `im:message:send_as_bot` 權限
2. 檢查應用是否已發布
3. 查看日誌取得詳細錯誤資訊

---

## 進階配置

### 多帳號配置

如果需要管理多個飛書機器人：

```json5
{
  channels: {
    feishu: {
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "主機器人",
        },
        backup: {
          appId: "cli_yyy",
          appSecret: "yyy",
          botName: "備用機器人",
          enabled: false, // 暫時停用
        },
      },
    },
  },
}
```

### 訊息限制

- `textChunkLimit`：出站文本分塊大小（預設 2000 字元）
- `mediaMaxMb`：媒體上傳/下載限制（預設 30MB）

### 串流輸出

飛書支援透過互動式卡片實現串流輸出，機器人會即時更新卡片內容顯示生成進度。預設配置：

```json5
{
  channels: {
    feishu: {
      streaming: true, // 啟用串流卡片輸出（預設 true）
      blockStreaming: true, // 啟用塊級串流（預設 true）
    },
  },
}
```

如需停用串流輸出（等待完整回覆後一次性發送），可設定 `streaming: false`。

### 訊息引用

在群聊中，機器人的回覆可以引用用戶發送的原始訊息，讓對話上下文更加清晰。

配置選項：

```json5
{
  channels: {
    feishu: {
      // 帳戶級別配置（預設 "all"）
      replyToMode: "all",
      groups: {
        oc_xxx: {
          // 特定群組可以覆蓋
          replyToMode: "first",
        },
      },
    },
  },
}
```

`replyToMode` 值說明：

| 值        | 行為                               |
| --------- | ---------------------------------- |
| `"off"`   | 不引用原訊息（私聊預設值）         |
| `"first"` | 僅在第一條回覆時引用原訊息         |
| `"all"`   | 所有回覆都引用原訊息（群聊預設值） |

> 注意：訊息引用功能與串流卡片輸出（`streaming: true`）不能同時使用。當啟用串流輸出時，回覆會以卡片形式呈現，不會顯示引用。

### 多 Agent 路由

透過 `bindings` 配置，您可以用一個飛書機器人對接多個不同功能或性格的 Agent。系統會根據用戶 ID 或群組 ID 自動將對話分發到對應的 Agent。

配置範例：

```json5
{
  agents: {
    list: [
      { id: "main" },
      {
        id: "clawd-fan",
        workspace: "/home/user/clawd-fan",
        agentDir: "/home/user/.openclaw/agents/clawd-fan/agent",
      },
      {
        id: "clawd-xi",
        workspace: "/home/user/clawd-xi",
        agentDir: "/home/user/.openclaw/agents/clawd-xi/agent",
      },
    ],
  },
  bindings: [
    {
      // 用戶 A 的私聊 → main agent
      agentId: "main",
      match: {
        channel: "feishu",
        peer: { kind: "dm", id: "ou_28b31a88..." },
      },
    },
    {
      // 用戶 B 的私聊 → clawd-fan agent
      agentId: "clawd-fan",
      match: {
        channel: "feishu",
        peer: { kind: "dm", id: "ou_0fe6b1c9..." },
      },
    },
    {
      // 某個群組 → clawd-xi agent
      agentId: "clawd-xi",
      match: {
        channel: "feishu",
        peer: { kind: "group", id: "oc_xxx..." },
      },
    },
  ],
}
```

匹配規則說明：

| 字段              | 說明                                          |
| ----------------- | --------------------------------------------- |
| `agentId`         | 目標 Agent 的 ID，需要在 `agents.list` 中定義 |
| `match.channel`   | 頻道類型，這裡固定為 `"feishu"`                |
| `match.peer.kind` | 對話類型：`"dm"`（私聊）或 `"group"`（群組）  |
| `match.peer.id`   | 用戶 Open ID（`ou_xxx`）或群組 ID（`oc_xxx`） |

> 取得 ID 的方法：參見上文 [取得群組/用戶 ID](#取得群組用戶-id) 章節。

---

## 配置參考

完整配置請參考：[閘道配置](https://docs.openclaw.ai/zh-TW/gateway/configuration)

主要選項：

| 配置項                                            | 說明                           | 預設值    |
| ------------------------------------------------- | ------------------------------ | --------- |
| `channels.feishu.enabled`                         | 啟用/停用頻道                  | `true`    |
| `channels.feishu.domain`                          | API 域名（`feishu` 或 `lark`） | `feishu`  |
| `channels.feishu.accounts.<id>.appId`             | 應用 App ID                    | -         |
| `channels.feishu.accounts.<id>.appSecret`         | 應用 App Secret                | -         |
| `channels.feishu.accounts.<id>.domain`            | 單帳號 API 域名覆蓋            | `feishu`  |
| `channels.feishu.dmPolicy`                        | 私聊策略                       | `pairing` |
| `channels.feishu.allowFrom`                       | 私聊白名單（open_id 列表）     | -         |
| `channels.feishu.groupPolicy`                     | 群組策略                       | `open`    |
| `channels.feishu.groupAllowFrom`                  | 群組白名單                     | -         |
| `channels.feishu.groups.<chat_id>.requireMention` | 是否需要 @提及                 | `true`    |
| `channels.feishu.groups.<chat_id>.enabled`        | 是否啟用該群組                 | `true`    |
| `channels.feishu.textChunkLimit`                  | 訊息分塊大小                   | `2000`    |
| `channels.feishu.mediaMaxMb`                      | 媒體大小限制                   | `30`      |
| `channels.feishu.streaming`                       | 啟用串流卡片輸出               | `true`    |
| `channels.feishu.blockStreaming`                  | 啟用塊級串流                   | `true`    |

---

## dmPolicy 策略說明

| 值            | 行為                                               |
| ------------- | -------------------------------------------------- |
| `"pairing"`   | **預設**。未知用戶收到配對碼，管理員批准後才能對話 |
| `"allowlist"` | 僅 `allowFrom` 列表中的用戶可對話，其他靜默忽略    |
| `"open"`      | 允許所有人對話（需在 allowFrom 中加 `"*"`）        |
| `"disabled"`  | 完全禁止私聊                                       |

---

## 支援的訊息類型

### 接收

- ✅ 文字訊息
- ✅ 圖片
- ✅ 檔案
- ✅ 音訊
- ✅ 影片
- ✅ 表情包

### 發送

- ✅ 文字訊息
- ✅ 圖片
- ✅ 檔案
- ✅ 音訊
- ⚠️ 富文本（部分支援）