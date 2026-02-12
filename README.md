# OpenClaw 🦞

[OpenClaw](https://openclaw.ai/) 真正能做事的人工智能。您的跨平台个人助手。适用于任何操作系统的 AI 智能体 Gateway 网关，支持 WhatsApp、Telegram、Discord、iMessage 等。

OpenClaw 通过单个 Gateway 网关进程将聊天应用连接到 Pi 等编程智能体。它为 OpenClaw 助手提供支持，并支持本地或远程部署。

# 工作原理

```mermaid
flowchart LR
  A["聊天应用 + 插件"] --> B["网关"]
  B --> C["Pi代理"]
  B --> D["CLI"]
  B --> E[""Web 控制界面"]
  B --> F["macOS 应用"]
  B --> G["iOS 和 Android 节点"]
```

Gateway 网关是会话、路由和渠道连接的唯一事实来源。

# 核心功能

**多渠道 Gateway 网关**

通过单个 Gateway 网关进程连接 WhatsApp、Telegram、Discord 和 iMessage。

**插件渠道**

通过扩展包添加 Mattermost 等更多渠道。

**多智能体路由**

按智能体、工作区或发送者隔离会话。

**媒体支持**

发送和接收图片、音频和文档。

**Web 控制界面**

浏览器仪表板，用于聊天、配置、会话和节点管理。

**移动节点**

 配对 iOS 和 Android 节点，支持 Canvas。


# OpenClaw安装

## 快速安装（推荐）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows（PowerShell）：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

下一步（如果你跳过了新手引导）：

```bash
openclaw onboard --install-daemon
```

## 系统要求

- **Node >=22**
- macOS、Linux 或通过 WSL2 的 Windows
- `pnpm` 仅在从源代码构建时需要

## 选择安装路径

### 1）安装器脚本（推荐）

通过 npm 全局安装 `openclaw` 并运行新手引导。

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装器标志：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --help
```


### 2）全局安装（手动）

如果你已经有 [NodeJs](https://nodejs.org/zh-cn/download) ：

```bash
npm install -g openclaw@latest
```

如果你全局安装了 libvips（macOS 上通过 Homebrew 安装很常见）且 `sharp` 安装失败，请强制使用预构建二进制文件：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

如果你看到 `sharp: Please add node-gyp to your dependencies`，要么安装构建工具（macOS：Xcode CLT + `npm install -g node-gyp`），要么使用上面的 `SHARP_IGNORE_GLOBAL_LIBVIPS=1` 变通方法来跳过原生构建。

或使用 pnpm：

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g                # 批准 openclaw、node-llama-cpp、sharp 等
pnpm add -g openclaw@latest           # 重新运行以执行 postinstall 脚本
```

pnpm 需要显式批准带有构建脚本的包。在首次安装显示"Ignored build scripts"警告后，运行 `pnpm approve-builds -g` 并选择列出的包，然后重新运行安装以执行 postinstall 脚本。

然后：

```bash
openclaw onboard --install-daemon
```

## OpenClaw UI 本地化

### 安装
```
git clone https://github.com/openlark/openclaw-ui-locales.git
cd openclaw-ui-locales

npm install
npm run dev
```



## 💬 交流群
![OpenClaw交流群](https://ai.stanyun.com/static/wx/openclaw.png)