---
summary: "Feishu Bot: Status, Features, and Configuration"
read_when:
  - You want to connect a Feishu bot
  - You are configuring the Feishu channel
title: Feishu
---
```

# Feishu Bot

**Status**: Production-ready, supports bot private messaging and group chats. Uses WebSocket persistent connection mode to receive messages.

---

## Required Plugin

Install the Feishu plugin:

```bash
openclaw plugins install @openclaw/feishu
```

Local checkout (run inside the git repository):

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

openclaw plugins install ./extensions/feishu
```

Local manual installation

1.  Copy the `./extensions/feishu` directory from the git repository to `~/.openclaw/extensions/feishu`.
2.  Ensure it contains `index.ts`, `openclaw.plugin.json`, and `package.json`.
3.  If there are dependencies, run `npm install` in the `~/.openclaw/extensions/feishu` directory.
4.  Run `openclaw plugins list` to confirm `feishu` is displayed in the list.

---

## Quick Start

There are two ways to add a Feishu channel:

### Method 1: Add via the Setup Wizard (Recommended)

If you've just installed OpenClaw, you can run the wizard directly and follow the prompts to add Feishu:

```bash
openclaw onboard
```

The wizard will guide you through:

1.  Creating a Feishu app and obtaining credentials
2.  Configuring the app credentials
3.  Starting the gateway

✅ **After configuration**, you can use these commands to check the gateway status:

-   `openclaw gateway status` - View gateway running status
-   `openclaw logs --follow` - View real-time logs

### Method 2: Add via the Command Line

If you've already completed the initial installation, you can add the Feishu channel with this command:

```bash
openclaw channels add
```

Then follow the interactive prompts to select Feishu and enter your App ID and App Secret.

✅ **After configuration**, you can use these commands to manage the gateway:

-   `openclaw gateway status` - View gateway running status
-   `openclaw gateway restart` - Restart the gateway to apply new configuration
-   `openclaw logs --follow` - View real-time logs

---

## Step 1: Create a Feishu App

### 1. Open the Feishu Open Platform

Visit the [Feishu Open Platform](https://open.feishu.cn/app) and log in with your Feishu account.

For Lark (International version), use https://open.larksuite.com/app and set `domain: "lark"` in your configuration.

### 2. Create an App

1.  Click **Create Enterprise Self-built App**
2.  Fill in the app name and description
3.  Choose an app icon

![Create Enterprise Self-built App](/assets/feishu-step2-create-app.png)

### 3. Obtain App Credentials

On the app's **Credentials & Basic Information** page, copy:

-   **App ID** (format like `cli_xxx`)
-   **App Secret**

❗ **Important**: Keep your App Secret secure. Do not share it with anyone.

![Obtain App Credentials](/assets/feishu-step3-credentials.png)

### 4. Configure App Permissions

On the **Permissions Management** page, click the **Batch Import** button and paste the following JSON configuration to import all required permissions at once:

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

![Configure App Permissions](/assets/feishu-step4-permissions.png)
![Batch Import](/assets/feishu-step4-permissions-batchimport.png)

### 5. Enable Bot Capability

On the **App Capabilities** > **Bot** page:

1.  Enable the bot capability
2.  Configure the bot name

![Enable Bot Capability](/assets/feishu-step5-bot-capability.png)

### 6. Configure Event Subscription

⚠️ **Important Reminder**: Before configuring event subscriptions, ensure you have completed the following steps:

1.  Run `openclaw channels add` to add the Feishu channel.
2.  The gateway is running (check status with `openclaw gateway status`).

On the **Event Subscription** page:
![Configure Event Subscription](/assets/feishu-step6-event-subscription.png)

1.  Select **Use persistent connection to receive events** (WebSocket mode).
2.  After saving, add the event: `im.message.receive_v1` (to receive messages).

⚠️ **Note**: If the gateway is not started or the channel is not added, saving the persistent connection settings will fail.

![Configure Event Subscription Add](/assets/feishu-step6-event-subscription-add.png)

### 7. Publish the App

1.  Create a version on the **Version Management & Release** page.
2.  Submit for review and release.
3.  Wait for administrator approval (usually automatic for enterprise self-built apps).

---

## Step 2: Configure OpenClaw

### Configure via the Wizard (Recommended)

Run the following command, select the Feishu channel, and paste your App ID and App Secret when prompted:

```bash
openclaw channels add
```

Or directly set the Feishu App ID and App Secret with these commands:

```bash
openclaw channels add channels.feishu.appId cli_xxx
openclaw channels add channels.feishu.appSecret xxx
```

### Configure via the Configuration File

Edit `~/.openclaw/openclaw.json`:

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
          botName: "My AI Assistant",
        },
      },
    },
  },
}
```

### Configure via Environment Variables

```bash
export FEISHU_APP_ID="cli_xxx"
export FEISHU_APP_SECRET="xxx"
```

### Lark (International Version) Domain

If your tenant is on Lark (International version), set the domain to `lark` (or the full domain). You can configure `channels.feishu.domain` or `channels.feishu.accounts.<id>.domain`:

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

## Step 3: Start and Test

### 1. Start the Gateway

```bash
openclaw gateway
```

### 2. Send a Test Message

Find the bot you created in Feishu and send it a message.

### 3. Pairing Authorization

By default, the bot replies with a **pairing code**. You need to approve this code:

```bash
openclaw pairing approve feishu <PAIRING_CODE>
```

After approval, you can have normal conversations.

---

## Introduction

-   **Feishu Bot Channel**: Feishu bot managed by the OpenClaw gateway.
-   **Deterministic Routing**: Replies are always sent back to Feishu; the model does not choose the channel.
-   **Session Isolation**: Private chats share a main session; group chats are isolated independently.
-   **WebSocket Connection**: Uses the Feishu SDK's persistent connection mode, requiring no public URL.

---

## Access Control

### Private Chat Access

-   **Default**: `dmPolicy: "pairing"`. Unknown users receive a pairing code.
-   **Approve Pairing**:
    ```bash
    openclaw pairing list feishu      # View pending approvals
    openclaw pairing approve feishu <CODE>  # Approve a code
    ```
-   **Allowlist Mode**: Configure allowed user Open IDs via `channels.feishu.allowFrom`.

### Group Access

**1. Group Policy** (`channels.feishu.groupPolicy`):

-   `"open"` = Allow everyone in the group (default).
-   `"allowlist"` = Only allow users specified in `groupAllowFrom`.
-   `"disabled"` = Disable group messages entirely.

**2. @Mention Requirement** (`channels.feishu.groups.<chat_id>.requireMention`):

-   `true` = Bot only responds when @mentioned (default).
-   `false` = Bot responds even without @mention.

---

## Group Configuration Examples

### Allow all groups, require @mention (default behavior)

```json5
{
  channels: {
    feishu: {
      groupPolicy: "open",
      // default requireMention: true
    },
  },
}
```

### Allow all groups, no @mention required

Needs to be configured for specific groups:

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

### Only allow specific users in groups

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

## Get Group/User IDs

### Get Group ID (chat_id)

The group ID format is `oc_xxx`. You can obtain it in the following ways:

**Method 1** (Recommended):

1.  Start the gateway and @mention the bot in the group to send a message.
2.  Run `openclaw logs --follow` to see the `chat_id` in the logs.

**Method 2**:
Use the Feishu API debugging tool to get the list of groups the bot is in.

### Get User ID (open_id)

The user ID format is `ou_xxx`. You can obtain it in the following ways:

**Method 1** (Recommended):

1.  Start the gateway and send a message to the bot.
2.  Run `openclaw logs --follow` to see the `open_id` in the logs.

**Method 2**:
View the list of pairing requests, which contains the user's Open ID:

```bash
openclaw pairing list feishu
```

---

## Common Commands

| Command   | Description                 |
| --------- | --------------------------- |
| `/status` | View bot status             |
| `/reset`  | Reset conversation session  |
| `/model`  | View or switch the AI model |

> Note: Feishu currently does not support native command menus; commands must be sent as text messages.

## Gateway Management Commands

When configuring and using the Feishu channel, you may need these gateway management commands:

| Command                      | Description                    |
| ---------------------------- | ------------------------------ |
| `openclaw gateway status`    | View gateway running status    |
| `openclaw gateway install`   | Install/start the gateway service |
| `openclaw gateway stop`      | Stop the gateway service       |
| `openclaw gateway restart`   | Restart the gateway service    |
| `openclaw logs --follow`     | View real-time log output      |

---

## Troubleshooting

### Bot does not respond in groups

1.  Check if the bot has been added to the group.
2.  Check if the bot was @mentioned (required by default).
3.  Check if `groupPolicy` is set to `"disabled"`.
4.  Check the logs: `openclaw logs --follow`.

### Bot cannot receive messages

1.  Check if the app has been published and approved.
2.  Check if the event subscription is configured correctly (`im.message.receive_v1`).
3.  Check if **persistent connection** mode is selected.
4.  Check if all required app permissions are granted.
5.  Check if the gateway is running: `openclaw gateway status`.
6.  View real-time logs: `openclaw logs --follow`.

### What if the App Secret is leaked?

1.  Reset the App Secret on the Feishu Open Platform.
2.  Update the App Secret in your OpenClaw configuration.
3.  Restart the gateway.

### Failed to send messages

1.  Check if the app has the `im:message:send_as_bot` permission.
2.  Check if the app has been published.
3.  Check the logs for detailed error information.

---

## Advanced Configuration

### Multi-Account Configuration

If you need to manage multiple Feishu bots:

```json5
{
  channels: {
    feishu: {
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "Main Bot",
        },
        backup: {
          appId: "cli_yyy",
          appSecret: "yyy",
          botName: "Backup Bot",
          enabled: false, // Temporarily disabled
        },
      },
    },
  },
}
```

### Message Limits

-   `textChunkLimit`: Outbound text chunk size (default 2000 characters).
-   `mediaMaxMb`: Media upload/download limit (default 30MB).

### Streaming Output

Feishu supports streaming output through interactive cards. The bot updates the card content in real-time to show generation progress. Default configuration:

```json5
{
  channels: {
    feishu: {
      streaming: true, // Enable streaming card output (default true)
      blockStreaming: true, // Enable block-level streaming (default true)
    },
  },
}
```

To disable streaming output (wait for the complete reply before sending), set `streaming: false`.

### Message Quoting

In group chats, the bot's reply can quote the user's original message for clearer context.

Configuration options:

```json5
{
  channels: {
    feishu: {
      // Account-level configuration (default "all")
      replyToMode: "all",
      groups: {
        oc_xxx: {
          // Specific groups can override
          replyToMode: "first",
        },
      },
    },
  },
}
```

`replyToMode` values:

| Value     | Behavior                                                       |
| --------- | -------------------------------------------------------------- |
| `"off"`   | Do not quote the original message (default for private chats). |
| `"first"` | Quote the original message only on the first reply.            |
| `"all"`   | Quote the original message on all replies (default for groups). |

> Note: Message quoting cannot be used simultaneously with streaming card output (`streaming: true`). When streaming is enabled, replies are presented as cards and will not show quotes.

### Multi-Agent Routing

Using `bindings` configuration, you can have one Feishu bot interface with multiple agents, each with different functions or personalities. The system automatically routes conversations to the corresponding agent based on the user ID or group ID.

Configuration example:

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
      // User A's private chat -> main agent
      agentId: "main",
      match: {
        channel: "feishu",
        peer: { kind: "dm", id: "ou_28b31a88..." },
      },
    },
    {
      // User B's private chat -> clawd-fan agent
      agentId: "clawd-fan",
      match: {
        channel: "feishu",
        peer: { kind: "dm", id: "ou_0fe6b1c9..." },
      },
    },
    {
      // A specific group -> clawd-xi agent
      agentId: "clawd-xi",
      match: {
        channel: "feishu",
        peer: { kind: "group", id: "oc_xxx..." },
      },
    },
  ],
}
```

Matching rule details:

| Field             | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `agentId`         | Target Agent ID, must be defined in `agents.list`.          |
| `match.channel`   | Channel type, fixed to `"feishu"` here.                     |
| `match.peer.kind` | Conversation type: `"dm"` (private chat) or `"group"`.      |
| `match.peer.id`   | User Open ID (`ou_xxx`) or Group ID (`oc_xxx`).             |

> How to get IDs: See the [Get Group/User IDs](#get-groupuser-ids) section above.

---

## Configuration Reference

For complete configuration, please refer to: [Gateway Configuration](https://docs.openclaw.ai/en-US/gateway/configuration)

Main options:

| Configuration Item                               | Description                             | Default    |
| ------------------------------------------------ | --------------------------------------- | ---------- |
| `channels.feishu.enabled`                        | Enable/disable the channel.             | `true`     |
| `channels.feishu.domain`                          | API domain (`feishu` or `lark`).        | `feishu`   |
| `channels.feishu.accounts.<id>.appId`             | App ID.                                 | -          |
| `channels.feishu.accounts.<id>.appSecret`         | App Secret.                             | -          |
| `channels.feishu.accounts.<id>.domain`            | API domain override for this account.   | `feishu`   |
| `channels.feishu.dmPolicy`                        | Private chat policy.                    | `pairing`  |
| `channels.feishu.allowFrom`                       | Private chat allowlist (list of open_ids). | -       |
| `channels.feishu.groupPolicy`                     | Group policy.                           | `open`     |
| `channels.feishu.groupAllowFrom`                  | Group allowlist (list of open_ids).     | -          |
| `channels.feishu.groups.<chat_id>.requireMention` | Whether @mention is required.           | `true`     |
| `channels.feishu.groups.<chat_id>.enabled`        | Whether this group is enabled.          | `true`     |
| `channels.feishu.textChunkLimit`                  | Outbound message chunk size.            | `2000`     |
| `channels.feishu.mediaMaxMb`                      | Media file size limit (MB).              | `30`       |
| `channels.feishu.streaming`                       | Enable streaming card output.           | `true`     |
| `channels.feishu.blockStreaming`                  | Enable block-level streaming.           | `true`     |

---

## dmPolicy Description

| Value         | Behavior                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `"pairing"`   | **Default**. Unknown users receive a pairing code; an admin must approve before conversation.    |
| `"allowlist"` | Only users in the `allowFrom` list can converse; others are silently ignored.                    |
| `"open"`      | Allow everyone to converse (requires adding `"*"` to `allowFrom`).                               |
| `"disabled"`  | Completely disable private chats.                                                                |

---

## Supported Message Types

### Receiving

-   ✅ Text messages
-   ✅ Images
-   ✅ Files
-   ✅ Audio
-   ✅ Video
-   ✅ Stickers

### Sending

-   ✅ Text messages
-   ✅ Images
-   ✅ Files
-   ✅ Audio
-   ⚠️ Rich text (partially supported)