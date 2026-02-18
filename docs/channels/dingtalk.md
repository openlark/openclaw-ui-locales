---
summary: "Dingtalk Internal Enterprise Bot: Status, Features, and Configuration"
read_when:
  - You want to connect a Dingtalk bot
  - You are configuring the Dingtalk channel
title: Dingtalk
---
```

# Dingtalk Bot

**Status**: Production-ready, supports bot private messaging and group chats. Uses Stream mode, no need to register a public callback URL.

---

## Required Plugin

Install the Dingtalk plugin:

```bash
openclaw plugins install @soimy/dingtalk
```

Install from local source code:

```bash
# 1. Clone the repository
git clone https://github.com/soimy/openclaw-channel-dingtalk.git
cd openclaw-channel-dingtalk

# 2. Install dependencies (required)
npm install

# 3. Install in linked mode (convenient for real-time effect after code modification)
openclaw plugins install -l .
```

Local manual installation

1. Download or copy this directory to `~/.openclaw/extensions/dingtalk`.
2. Ensure it contains `index.ts`, `openclaw.plugin.json`, and `package.json`.
3. If there are dependencies, run `npm install` in the `~/.openclaw/extensions/dingtalk` directory.
4. Run `openclaw plugins list` to confirm `dingtalk` is displayed in the list.

---

## Quick Start

There are two ways to add a Dingtalk channel:

### Method 1: Add via the Setup Wizard (Recommended)

If you've just installed OpenClaw, you can run the wizard directly and follow the prompts to add Dingtalk:

```bash
openclaw onboard
```

The wizard will guide you through:

1.  Creating a Dingtalk app and obtaining credentials
2.  Configuring the app credentials
3.  Starting the gateway

✅ **After configuration**, you can use these commands to check the gateway status:

-   `openclaw gateway status` - View gateway running status
-   `openclaw logs --follow` - View real-time logs

### Method 2: Add via the Command Line

If you've already completed the initial installation, you can add the Dingtalk channel with this command:

```bash
openclaw channels add
```

Interactive configuration process:

1.  **Select Plugin** — Choose `dingtalk` or `Dingtalk (钉钉)` from the plugin list.
2.  **Client ID** — Enter your Dingtalk app's AppKey.
3.  **Client Secret** — Enter your Dingtalk app's AppSecret.
4.  **Complete Configuration** — Optional configuration for Robot Code, Corp ID, Agent ID (recommended).
5.  **Card Mode** — Optionally enable AI interactive card mode.
    - If enabled, you need to enter the Card Template ID and Card Template Key.
6.  **Private Chat Policy** — Choose `open` or `allowlist`.
7.  **Group Chat Policy** — Choose `open` or `allowlist`.

✅ **After configuration**, you can use these commands to manage the gateway:

-   `openclaw gateway status` - View gateway running status
-   `openclaw gateway restart` - Restart the gateway to apply new configuration
-   `openclaw logs --follow` - View real-time logs

---

## Step 1: Create a Dingtalk App

### 1. Open the Dingtalk Open Platform

Visit the [Dingtalk Developer Backend](https://open-dev.dingtalk.com/fe/app) and log in with your Dingtalk account.

### 2. Create an App

1.  Click **Create App**
2.  Fill in the app name and description
3.  Choose an app icon

![Create App](/assets/dingtalk-step2-create-app.png)

### 3. Obtain App Credentials

On the app's **Credentials & Basic Information** page, copy:

-   **Client ID** (format like `dingxxx`)
-   **Client Secret**
-   **Agent ID**

❗ **Important**: Keep your Client Secret secure. Do not share it with anyone.

![Obtain App Credentials](/assets/dingtalk-step3-credentials.png)

### 4. Configure App Permissions

On the **Permissions Management** page, you need to enable the following permissions:

-   ✅ **Card.Instance.Write** — Create and deliver card instances.
-   ✅ **Card.Streaming.Write** — Perform streaming updates on cards.

![Configure App Permissions](/assets/dingtalk-step4-permissions.png)

### 5. Enable Bot Capability

On the **App Capabilities** > **Bot** page:

1.  Enable the bot capability.
2.  Configure the bot name.

![Enable Bot Capability](/assets/dingtalk-step5-bot-capability.png)

### 6. Configure Event Subscription

⚠️ **Important Reminder**: Before configuring event subscriptions, ensure you have completed the following steps:

1.  Run `openclaw channels add` to add the Dingtalk channel.
2.  The gateway is running (check status with `openclaw gateway status`).

On the **Event Subscription** page:
![Configure Event Subscription](/assets/dingtalk-step6-event-subscription.png)

1.  Select **Use Stream Mode** (WebSocket mode).

⚠️ **Note**: If the gateway is not started or the channel is not added, saving the persistent connection settings will fail.

### 7. Publish the App

1.  Create a new version on the **Version Management & Release** page.
2.  Submit for review and release.
3.  Wait for administrator approval.

![Version Management & Release](/assets/dingtalk-step7-version-release.png)

---

## Step 2: Configure OpenClaw

### Configure via the Wizard (Recommended)

Run the following command, select the Dingtalk channel, and paste your Client ID, Client Secret, Agent ID, and Corp ID when prompted:

```bash
openclaw channels add
```

Or directly set the Dingtalk Client ID, Client Secret, Agent ID, and Corp ID with these commands:

```bash
openclaw channels add channels.dingtalk.clientId dingxxx
openclaw channels add channels.dingtalk.clientSecret xxx
openclaw channels add channels.dingtalk.agentId xxx
openclaw channels add channels.dingtalk.corpId xxx
```

Select **Dingtalk**, then enter the credentials you obtained in Step 1.

### Configure via the Configuration File

Edit `~/.openclaw/openclaw.json`:

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
          name: "My AI Assistant",
        },
      },
    },
  },
}
```

---

## Step 3: Start and Test

### 1. Start the Gateway

```bash
openclaw gateway
```

### 2. Send a Test Message

Find the bot you created in Dingtalk and send it a message.

---

## Introduction

-   ✅ **Stream Mode** — WebSocket persistent connection, no public IP or Webhook required.
-   ✅ **Private Chat Support** — Direct conversation with the bot.
-   ✅ **Group Chat Support** — @mention the bot in groups.
-   ✅ **Multiple Message Types** — Text, images, voice (built-in recognition), video, files.
-   ✅ **Markdown Replies** — Support for rich text format replies.
-   ✅ **Interactive Cards** — Support for streaming updates, suitable for AI real-time output.
-   ✅ **Complete AI Conversation** — Integrated with the OpenClaw message processing pipeline.

---

## Configuration Options

| Option                   | Type     | Default       | Description                                        |
| ------------------------ | -------- | ------------- | -------------------------------------------------- |
| `enabled`                | boolean  | `true`        | Whether to enable the channel.                     |
| `clientId`               | string   | Required      | The app's AppKey.                                  |
| `clientSecret`           | string   | Required      | The app's AppSecret.                               |
| `robotCode`              | string   | -             | Robot code (used for downloading media and sending cards). |
| `corpId`                 | string   | -             | Enterprise ID.                                     |
| `agentId`                | string   | -             | Application ID.                                    |
| `dmPolicy`               | string   | `"open"`      | Private chat policy: open/pairing/allowlist.       |
| `groupPolicy`            | string   | `"open"`      | Group chat policy: open/allowlist.                 |
| `allowFrom`              | string[] | `[]`          | List of allowed sender IDs.                        |
| `messageType`            | string   | `"markdown"`  | Message type: markdown/card.                       |
| `cardTemplateId`         | string   |               | AI interactive card template ID (only if `messageType=card`). |
| `cardTemplateKey`        | string   | `"content"`   | Card template content field key (only if `messageType=card`). |
| `debug`                  | boolean  | `false`       | Whether to enable debug logs.                      |
| `maxConnectionAttempts`  | number   | `10`          | Maximum number of connection attempts.             |
| `initialReconnectDelay`  | number   | `1000`        | Initial reconnect delay (milliseconds).            |
| `maxReconnectDelay`      | number   | `60000`       | Maximum reconnect delay (milliseconds).            |
| `reconnectJitter`        | number   | `0.3`         | Reconnect delay jitter factor (0-1).               |

### Connection Robustness Configuration

To improve connection stability, the plugin supports the following advanced configurations:

-   **maxConnectionAttempts**: The maximum number of retry attempts after connection failure. Stops attempting and raises an alert after exceeding.
-   **initialReconnectDelay**: The initial delay for the first reconnection (milliseconds). Subsequent reconnection delays increase exponentially.
-   **maxReconnectDelay**: The upper limit for reconnect delay (milliseconds), preventing excessively long wait times.
-   **reconnectJitter**: The delay jitter factor, adding random variation (±30%) to the calculated delay to prevent multiple clients from reconnecting simultaneously.

Reconnect delay formula: `delay = min(initialDelay × 2^attempt, maxDelay) × (1 ± jitter)`

Example delay sequence (default config): ~1s, ~2s, ~4s, ~8s, ~16s, ~32s, ~60s (reached limit)

## Security Policies

### Private Chat Policy (dmPolicy)

-   `open` — Anyone can have private chats with the bot.
-   `pairing` — New users need to verify via a pairing code.
-   `allowlist` — Only users in the `allowFrom` list can use it.

### Group Chat Policy (groupPolicy)

-   `open` — Any group can @mention the bot.
-   `allowlist` — Only configured groups can use it.

## Message Type Support

### Receiving

| Type      | Support | Description                |
| --------- | ------- | -------------------------- |
| Text      | ✅      | Full support.              |
| Rich Text | ✅      | Extracts text content.     |
| Image     | ✅      | Downloads and passes to AI. |
| Voice     | ✅      | Uses Dingtalk speech recognition result. |
| Video     | ✅      | Downloads and passes to AI. |
| File      | ✅      | Downloads and passes to AI. |

### Sending

| Type          | Support | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| Text          | ✅      | Full support.                                  |
| Markdown      | ✅      | Auto-detected or manually specified.           |
| Interactive Card | ✅   | Supports streaming updates, suitable for AI real-time output. |
| Image         | ⏳      | Requires media upload API.                     |

## API Consumption Details

### Text/Markdown Mode

| Operation      | API Calls   | Description                                                        |
| -------------- | ----------- | ------------------------------------------------------------------ |
| Get Token      | 1           | Shared/cached (checked for expiry every 60 seconds).               |
| Send Message   | 1           | Uses `/v1.0/robot/oToMessages/batchSend` or `/v1.0/robot/groupMessages/send`. |
| **Total**      | **2**       | Per reply.                                                         |

### Card (AI Interactive Card) Mode

| Stage          | API Calls   | Description                                                 |
| --------------- | ----------- | ----------------------------------------------------------- |
| **Create Card** | 1           | `POST /v1.0/card/instances/createAndDeliver`                |
| **Streaming Updates** | M      | M = number of reply chunks, one `PUT /v1.0/card/streaming` per chunk. |
| **Finalize Card** | Included in the last streaming update | Marked with `isFinalize=true`.                               |
| **Total**       | **1 + M**   | M = number of reply chunks generated by the Agent.          |

### Typical Scenario Cost Comparison

| Scenario                     | Text/Markdown | Card | Savings     |
| ---------------------------- | ------------- | ---- | ----------- |
| Short reply (1 chunk)        | 2             | 2    | ✓ Same      |
| Medium reply (5 chunks)      | 6             | 6    | ✓ Same      |
| Long reply (10 chunks)       | 12            | 11   | ✓ 1 call    |

### Optimization Strategies

**How to reduce API calls:**

1.  **Merge reply chunks** — Adjust the Agent's output configuration to reduce the number of chunks.
2.  **Use caching** — Tokens are cached automatically (60 seconds), no need to fetch each time.
3.  **Buffer mode** — Use `dispatchReplyWithBufferedBlockDispatcher` to merge multiple small chunks.

**Cost Recommendations:**

-   ✅ **Recommended** — Card Mode: Better streaming experience, cost comparable to or lower than Text/Markdown.
-   ⚠️ **Caution** — Frequent calls require quota monitoring. Use the Dingtalk Developer Backend to view API call volume.

## Message Type Selection

The plugin supports two message reply types, configurable via `messageType`:

### 1. markdown (Markdown format) **[Default]**

-   Supports rich text format (headings, bold, lists, etc.).
-   Automatically detects if the message contains Markdown syntax.
-   Suitable for most scenarios.

### 2. card (AI Interactive Card)

-   Supports streaming updates (displays AI-generated content in real-time).
-   Better visual presentation and interactive experience.
-   Supports Markdown format rendering.
-   Specify the template via `cardTemplateId`.
-   Specify the content field via `cardTemplateKey`.
-   **Ideal for AI conversation scenarios.**

**AI Card API Features:**
When configured with `messageType: 'card'`:

1.  Uses `/v1.0/card/instances/createAndDeliver` to create and deliver the card.
2.  Uses `/v1.0/card/streaming` for true streaming updates.
3.  Automatic state management (PROCESSING → INPUTING → FINISHED).
4.  More stable streaming experience, no manual throttling needed.

**Configuration Example:**

```json5
{
  messageType: 'card', // Enable AI interactive card mode
  cardTemplateId: '382e4302-551d-4880-bf29-a30acfab2e71.schema', // AI card template ID (default value)
  cardTemplateKey: 'msgContent', // Card content field key (default value: msgContent)
}
```

> **Note**: `cardTemplateKey` should match the field name defined in your card template. The default value is `'msgContent'`, suitable for the Dingtalk official AI card template. If you are using a custom template, configure it according to the field name defined in your template.

## Usage Examples

After configuration, simply use Dingtalk:

1.  **Private chat with the bot** — Find the bot and send a message.
2.  **Group chat @mention the bot** — In a group, @mention the bot name followed by your message.

## Troubleshooting

### Not Receiving Messages

1.  Confirm the app has been published.
2.  Confirm the message reception mode is Stream.
3.  Check the Gateway logs: `openclaw logs | grep dingtalk`.

### No Response in Group Chats

1.  Confirm the bot has been added to the group.
2.  Confirm you correctly @mentioned the bot (using the bot name).
3.  Confirm the group is an internal enterprise group.

### Connection Failure

1.  Check if the clientId and clientSecret are correct.
2.  Confirm network access to the Dingtalk API.