# OpenClaw安装

## 系统要求

- **[Node 22+](https://nodejs.org/zh-cn/download)**（如果缺失，安装脚本会自动安装）
- macOS、Linux 或 Windows
- 如果从源代码构建，只支持 pnpm


## 安装方法

### 安装脚本

下载命令行工具，通过 npm 全局安装，并启动入门向导。

**macOS / Linux / WSL2**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows（PowerShell）**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### npm / pnpm 

若已安装[Node 22+](https://nodejs.org/zh-cn/download)且希望自行管理安装：

**npm**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**pnpm**

```bash
pnpm add -g openclaw@latest
# 审批 openclaw、node-llama-cpp、sharp 等依赖
pnpm approve-builds -g        
openclaw onboard --install-daemon
```

### 从源代码安装

适用于贡献者或希望从本地代码库运行的用户。

1. **克隆并构建**

克隆 OpenClaw 仓库并构建：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

2. **全局链接命令行工具**

使 openclaw 命令全局可用：

```bash
pnpm link --global
```

或跳过链接步骤，在仓库目录内通过 pnpm openclaw ... 执行命令。

3. **运行初始化程序**

```bash
openclaw onboard --install-daemon
```

## 安装后

验证系统运行状态：

```bash  
# 检查配置问题
openclaw doctor   
# 网关状态    
openclaw status         
# 打开浏览器界面
openclaw dashboard      
# 网关重启
openclaw gateway restart     
```

若需自定义运行时路径，请使用：
- **OPENCLAW_HOME** 用于基于用户目录的内部路径
- **OPENCLAW_STATE_DIR** 用于可变状态存储位置
- **OPENCLAW_CONFIG_PATH** 用于配置文件存储位置