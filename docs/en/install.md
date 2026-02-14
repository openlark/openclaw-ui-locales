# OpenClaw Install

##  System requirements
- **[Node 22+](https://nodejs.org/zh-cn/download)** (the installer script will install it if missing)
- macOS, Linux, or Windows
- pnpm only if you build from source

## Install methods

### Installer script

Downloads the CLI, installs it globally via npm, and launches the onboarding wizard.

**macOS / Linux / WSL2**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows（PowerShell）**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### npm / pnpm 

If you already have [Node 22+](https://nodejs.org/zh-cn/download) and prefer to manage the install yourself:

**npm**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**pnpm**

```bash
pnpm add -g openclaw@latest
# approve openclaw, node-llama-cpp, sharp, etc.
pnpm approve-builds -g        
openclaw onboard --install-daemon
```

### From Source

For contributors or anyone who wants to run from a local checkout.

1. **Clone and build**

Clone the OpenClaw repo and build:

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

2. **Link the CLI**

Make the openclaw command available globally:

```bashp
npm link --global
```

Alternatively, skip the link and run commands via pnpm openclaw ... from inside the repo.

3. **Run onboarding**

```bash
openclaw onboard --install-daemon
```

## After install
Verify everything is working:

```bash  
# check for config issues
openclaw doctor   
# gateway status    
openclaw status         
# open the browser UI
openclaw dashboard   
# gateway restart 
openclaw gateway restart      
```

If you need custom runtime paths, use:
- **OPENCLAW_HOME** for home-directory based internal paths
- **OPENCLAW_STATE_DIR** for mutable state location
- **OPENCLAW_CONFIG_PATH** for config file location