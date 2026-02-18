# 钉钉机器人

状态：生产就绪，支持机器人私聊和群组。使用 Stream 模式，无需注册公网回调地址。

---


## 需要插件

安装 Dingtalk 插件：

```bash
openclaw plugins install @soimy/dingtalk
```

通过本地源码安装：

```bash
# 1. 克隆仓库
git clone https://github.com/soimy/openclaw-channel-dingtalk.git
cd openclaw-channel-dingtalk

# 2. 安装依赖 (必需)
npm install

# 3. 以链接模式安装 (方便修改代码后实时生效)
openclaw plugins install -l .
```

本地手动安装

1. 将本目录下载或复制到 `~/.openclaw/extensions/dingtalk`。
2. 确保包含 `index.ts`, `openclaw.plugin.json` 和 `package.json`。
3. 如果有依赖包,在`~/.openclaw/extensions/dingtalk`目录下运行 `npm install`。
4. 运行 `openclaw plugins list` 确认 `dingtalk` 已显示在列表中。

---

## 快速开始

添加钉钉渠道有两种方式：

### 方式一：通过安装向导添加（推荐）

如果您刚安装完 OpenClaw，可以直接运行向导，根据提示添加钉钉：

```bash
openclaw onboard
```

向导会引导您完成：

1. 创建钉钉应用并获取凭证
2. 配置应用凭证
3. 启动网关

✅ **完成配置后**，您可以使用以下命令检查网关状态：

- `openclaw gateway status` - 查看网关运行状态
- `openclaw logs --follow`  - 查看实时日志

### 方式二：通过命令行添加

如果您已经完成了初始安装，可以用以下命令添加钉钉渠道：

```bash
openclaw channels add
```

交互式配置流程：

1. **选择插件** — 在插件列表中选择 `dingtalk` 或 `DingTalk (钉钉)`
2. **Client ID** — 输入钉钉应用的 AppKey
3. **Client Secret** — 输入钉钉应用的 AppSecret
4. **完整配置** — 可选配置 Robot Code、Corp ID、Agent ID（推荐）
5. **卡片模式** — 可选启用 AI 互动卡片模式
   - 如启用，需输入 Card Template ID 和 Card Template Key
6. **私聊策略** — 选择 `open`（开放）或 `allowlist`（白名单）
7. **群聊策略** — 选择 `open`（开放）或 `allowlist`（白名单）


✅ **完成配置后**，您可以使用以下命令管理网关：

- `openclaw gateway status`  - 查看网关运行状态
- `openclaw gateway restart` - 重启网关以应用新配置
- `openclaw logs --follow`   - 查看实时日志

---

## 第一步：创建钉钉应用

### 1. 打开钉钉开放平台

访问 [钉钉开发者后台](https://open-dev.dingtalk.com/fe/app)，使用钉钉账号登录。

### 2. 创建应用

1. 点击 **创建应用**
2. 填写应用名称和描述
3. 选择应用图标

![创建应用](/assets/dingtalk-step2-create-app.png)

### 3. 获取应用凭证

在应用的 **凭证与基础信息** 页面，复制：

- **Client ID**（格式如 `dingxxx`）
- **Client Secret**
- **Agent ID**

❗ **重要**：请妥善保管 Client Secret，不要分享给他人。

![获取应用凭证](/assets/dingtalk-step3-credentials.png)

### 4. 配置应用权限

在 **权限管理** 页面，需要开启以下权限：

- ✅ **Card.Instance.Write** — 创建和投放卡片实例
- ✅ **Card.Streaming.Write** — 对卡片进行流式更新

![配置应用权限](/assets/dingtalk-step4-permissions.png)

### 5. 启用机器人能力

在 **应用能力** > **机器人** 页面：

1. 开启机器人能力
2. 配置机器人名称

![启用机器人能力](/assets/dingtalk-step5-bot-capability.png)

### 6. 配置事件订阅

⚠️ **重要提醒**：在配置事件订阅前，请务必确保已完成以下步骤：

1. 运行 `openclaw channels add` 添加了 DingTalk 渠道
2. 网关处于启动状态（可通过 `openclaw gateway status` 检查状态）

在 **事件订阅** 页面：
![配置事件订阅](/assets/dingtalk-step6-event-subscription.png)

1. 选择 **使用Stream模式**（WebSocket 模式）

⚠️ **注意**：如果网关未启动或渠道未添加，长连接设置将保存失败。

### 7. 发布应用

1. 在 **版本管理与发布** 页面创建新版本
2. 提交审核并发布
3. 等待管理员审批


![版本管理与发布](/assets/dingtalk-step7-version-release.png)
---

## 第二步：配置 OpenClaw

### 通过向导配置（推荐）

运行以下命令，选中钉钉通道，根据提示粘贴 Client ID、Client Secret、Agent ID和 Corp ID：

```bash
openclaw channels add
```

或者直接运行以下命令添加钉钉 Client ID、Client Secret、Agent ID和 Corp ID：

```bash
openclaw channels add channels.dingtalk.clientId dingxxx
openclaw channels add channels.dingtalk.clientSecret xxx
openclaw channels add channels.dingtalk.agentId xxx
openclaw channels add channels.dingtalk.corpId xxx
```

选择 **DingTalk**，然后输入您在第一步获取的凭证即可。

### 通过配置文件配置

编辑 `~/.openclaw/openclaw.json`：

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

## 第三步：启动并测试

### 1. 启动网关

```bash
openclaw gateway
```

### 2. 发送测试消息

在钉钉中找到您创建的机器人，发送一条消息。

---

## 介绍

- ✅ **Stream 模式** — WebSocket 长连接，无需公网 IP 或 Webhook
- ✅ **私聊支持** — 直接与机器人对话
- ✅ **群聊支持** — 在群里 @机器人
- ✅ **多种消息类型** — 文本、图片、语音（自带识别）、视频、文件
- ✅ **Markdown 回复** — 支持富文本格式回复
- ✅ **互动卡片** — 支持流式更新，适用于 AI 实时输出
- ✅ **完整 AI 对话** — 接入 OpenClaw 消息处理管道

---

## 配置选项

| 选项                    | 类型     | 默认值       | 说明                                         |
| ----------------------- | -------- | ------------ | ------------------------------------------- |
| `enabled`               | boolean  | `true`       | 是否启用                                     |
| `clientId`              | string   | 必填         | 应用的 AppKey                                |
| `clientSecret`          | string   | 必填         | 应用的 AppSecret                             |
| `robotCode`             | string   | -            | 机器人代码（用于下载媒体和发送卡片）            |
| `corpId`                | string   | -            | 企业 ID                                      |
| `agentId`               | string   | -            | 应用 ID                                      |
| `dmPolicy`              | string   | `"open"`     | 私聊策略：open/pairing/allowlist             |
| `groupPolicy`           | string   | `"open"`     | 群聊策略：open/allowlist                     |
| `allowFrom`             | string[] | `[]`         | 允许的发送者 ID 列表                          |
| `messageType`           | string   | `"markdown"` | 消息类型：markdown/card                      |
| `cardTemplateId`        | string   |              | AI 互动卡片模板 ID（仅当 messageType=card）   |
| `cardTemplateKey`       | string   | `"content"`  | 卡片模板内容字段键（仅当 messageType=card）   |
| `debug`                 | boolean  | `false`      | 是否开启调试日志                             |
| `maxConnectionAttempts` | number   | `10`         | 最大连接尝试次数                             |
| `initialReconnectDelay` | number   | `1000`       | 初始重连延迟（毫秒）                         |
| `maxReconnectDelay`     | number   | `60000`      | 最大重连延迟（毫秒）                         |
| `reconnectJitter`       | number   | `0.3`        | 重连延迟抖动因子（0-1）                      |

### 连接鲁棒性配置

为提高连接稳定性，插件支持以下高级配置：

- **maxConnectionAttempts**: 连接失败后的最大重试次数，超过后将停止尝试并报警。
- **initialReconnectDelay**: 第一次重连的初始延迟（毫秒），后续重连会按指数增长。
- **maxReconnectDelay**: 重连延迟的上限（毫秒），防止等待时间过长。
- **reconnectJitter**: 延迟抖动因子，在延迟基础上增加随机变化（±30%），避免多个客户端同时重连。

重连延迟计算公式：`delay = min(initialDelay × 2^attempt, maxDelay) × (1 ± jitter)`

示例延迟序列（默认配置）：~1s, ~2s, ~4s, ~8s, ~16s, ~32s, ~60s（达到上限）

## 安全策略

### 私聊策略 (dmPolicy)

- `open` — 任何人都可以私聊机器人
- `pairing` — 新用户需要通过配对码验证
- `allowlist` — 只有 allowFrom 列表中的用户可以使用

### 群聊策略 (groupPolicy)

- `open` — 任何群都可以 @机器人
- `allowlist` — 只有配置的群可以使用

## 消息类型支持

### 接收

| 类型   | 支持 | 说明                 |
| ------ | ---- | -------------------- |
| 文本   | ✅   | 完整支持             |
| 富文本 | ✅   | 提取文本内容         |
| 图片   | ✅   | 下载并传递给 AI      |
| 语音   | ✅   | 使用钉钉语音识别结果 |
| 视频   | ✅   | 下载并传递给 AI      |
| 文件   | ✅   | 下载并传递给 AI      |

### 发送

| 类型     | 支持 | 说明                             |
| -------- | ---- | -------------------------------- |
| 文本     | ✅   | 完整支持                         |
| Markdown | ✅   | 自动检测或手动指定               |
| 互动卡片  | ✅   | 支持流式更新，适用于 AI 实时输出 |
| 图片     | ⏳   | 需要通过媒体上传 API             |

## API 消耗说明

### Text/Markdown 模式

| 操作       | API 调用次数 | 说明                                                                         |
| ---------- | ------------ | ---------------------------------------------------------------------------- |
| 获取 Token | 1            | 共享/缓存（60 秒检查过期一次）                                               |
| 发送消息   | 1            | 使用 `/v1.0/robot/oToMessages/batchSend` 或 `/v1.0/robot/groupMessages/send` |
| **总计**   | **2**        | 每条回复 1 次                                                                |

### Card（AI 互动卡片）模式

| 阶段         | API 调用               | 说明                                                |
| ------------ | ---------------------- | --------------------------------------------------- |
| **创建卡片** | 1                      | `POST /v1.0/card/instances/createAndDeliver`        |
| **流式更新** | M                      | M = 回复块数量，每块一次 `PUT /v1.0/card/streaming` |
| **完成卡片** | 包含在最后一次流更新中 | 使用 `isFinalize=true` 标记                         |
| **总计**     | **1 + M**              | M = Agent 产生的回复块数                            |

### 典型场景成本对比

| 场景             | Text/Markdown | Card | 节省   |
| ---------------- | ------------- | ---- | ------ |
| 简短回复（1 块） | 2             | 2    | ✓ 相同 |
| 中等回复（5 块） | 6             | 6    | ✓ 相同 |
| 长回复（10 块）  | 12            | 11   | ✓ 1 次 |

### 优化策略

**降低 API 调用的方法：**

1. **合并回复块** — 通过调整 Agent 输出配置，减少块数量
2. **使用缓存** — Token 自动缓存（60 秒），无需每次都获取
3. **Buffer 模式** — 使用 `dispatchReplyWithBufferedBlockDispatcher` 合并多个小块

**成本建议：**

- ✅ **推荐** — Card 模式：流式体验更好，成本与 Text/Markdown 相当或更低
- ⚠️ **谨慎** — 频繁调用需要监测配额，建议使用钉钉开发者后台查看 API 调用量

## 消息类型选择

插件支持两种消息回复类型，可通过 `messageType` 配置：

### 1. markdown（Markdown 格式）**【默认】**

- 支持富文本格式（标题、粗体、列表等）
- 自动检测消息是否包含 Markdown 语法
- 适用于大多数场景

### 2. card（AI 互动卡片）

- 支持流式更新（实时显示 AI 生成内容）
- 更好的视觉呈现和交互体验
- 支持 Markdown 格式渲染
- 通过 `cardTemplateId` 指定模板
- 通过 `cardTemplateKey` 指定内容字段
- **适用于 AI 对话场景**

**AI Card API 特性：**
当配置 `messageType: 'card'` 时：

1. 使用 `/v1.0/card/instances/createAndDeliver` 创建并投放卡片
2. 使用 `/v1.0/card/streaming` 实现真正的流式更新
3. 自动状态管理（PROCESSING → INPUTING → FINISHED）
4. 更稳定的流式体验，无需手动节流

**配置示例：**

```json5
{
  messageType: 'card', // 启用 AI 互动卡片模式
  cardTemplateId: '382e4302-551d-4880-bf29-a30acfab2e71.schema', // AI 卡片模板 ID（默认值）
  cardTemplateKey: 'msgContent', // 卡片内容字段键（默认值：msgContent）
}
```

> **注意**：`cardTemplateKey` 应与您的卡片模板中定义的字段名称一致。默认值为 `'msgContent'`，适用于 DingTalk 官方 AI 卡片模板。如果您使用自定义模板，请根据模板定义的字段名称进行配置。

## 使用示例

配置完成后，直接在钉钉中：

1. **私聊机器人** — 找到机器人，发送消息
2. **群聊 @机器人** — 在群里 @机器人名称 + 消息

## 故障排除

### 收不到消息

1. 确认应用已发布
2. 确认消息接收模式是 Stream
3. 检查 Gateway 日志：`openclaw logs | grep dingtalk`

### 群消息无响应

1. 确认机器人已添加到群
2. 确认正确 @机器人（使用机器人名称）
3. 确认群是企业内部群

### 连接失败

1. 检查 clientId 和 clientSecret 是否正确
2. 确认网络可以访问钉钉 API
