# OpenClaw

OpenClaw, a truly capable artificial intelligence. Your cross-platform personal assistant. An AI agent Gateway suitable for any operating system, supporting WhatsApp, Telegram, Discord, iMessage, and more.

Send a message, get an agent response from your pocket. Plugins add Mattermost and more.

## What is OpenClaw?

OpenClaw is a **self-hosted gateway** that connects your favorite chat apps — WhatsApp, Telegram, Discord, iMessage, and more — to AI coding agents like Pi. You run a single Gateway process on your own machine (or a server), and it becomes the bridge between your messaging apps and an always-available AI assistant.

**Who is it for?** Developers and power users who want a personal AI assistant they can message from anywhere — without giving up control of their data or relying on a hosted service.

**What makes it different?**

- **Self-hosted**: runs on your hardware, your rules
- **Multi-channel**: one Gateway serves WhatsApp, Telegram, Discord, and more simultaneously
- **Agent-native**: built for coding agents with tool use, sessions, memory, and multi-agent routing
- **Open source**: MIT licensed, community-driven

**What do you need?** Node 22+, an API key (Anthropic recommended), and 5 minutes.

## How it works

```mermaid
  A["Chat apps + plugins"] --> B["Gateway"]
  B --> C["Pi agent"]
  B --> D["CLI"]
  B --> E["Web Control UI"]
  B --> F["macOS app"]
  B --> G["iOS and Android nodes"]
```

The Gateway is the single source of truth for sessions, routing, and channel connections.

## Key capabilities

**Multi-channel gateway**

WhatsApp, Telegram, Discord, and iMessage with a single Gateway process.

**Plugin channels**

Add Mattermost and more with extension packages.

**Multi-agent routing**

Isolated sessions per agent, workspace, or sender.

**Media support**

Send and receive images, audio, and documents.

**Web Control UI**

Browser dashboard for chat, config, sessions, and nodes.

**Mobile nodes**

 Pair iOS and Android nodes with Canvas support.
