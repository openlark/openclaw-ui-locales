
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import { PromptModule } from 'inquirer'
import open from 'open'

interface OpenClawHanldeOptions {
  // Enter Q&A data
  answers: any,
  // Current version number
  version: string,
  // Install the global path for OpenClaw
  globalDir: string,
  // OpenClaw main directory temporary folder
  homeTmpDir: string
}

function main() {
  const prompt: PromptModule = inquirer.createPromptModule()
  const questions: Array<any> = [
    {
      type: 'list', name: 'language', message: 'Please select a language', choices: [
        // 中文 Chinese
        { name: '简体中文', value: 'zh' },
        // 日语 Japanese
        { name: '日本語', value: 'ja' },
        // 韩语 Korean
        { name: '한국어', value: 'ko' },
        // 法语 French
        { name: 'Français', value: 'fr' },
        // 德语 German 
        { name: 'Deutsch', value: 'de' },
        // 意大利语 Italian 
        { name: 'Italiano', value: 'it' },
        // 葡萄牙语 Portuguese
        { name: 'Português', value: 'pt' },
        // 西班牙语 Spanish
        { name: 'Español', value: 'es' },
        // 孟加拉语 Bangla
        { name: 'বাংলা', value: 'bn' },
        // 越南语 Vietnamese
        { name: 'Tiếng Việt', value: 'vi' },
        // 菲律宾语 Filipino
        { name: 'Filipino', value: 'fi' },
      ]
    }
  ]

  prompt(questions).then(async (answers: any) => {
    // Show the installation root directory of npm global packages
    const globalRoot: string = execSync('npm root -g').toString().trim()
    // Install the global path for OpenClaw
    const openclawDir: string = path.join(globalRoot, 'openclaw')
    // OpenClaw main directory temporary folder
    const openclawHomeTmpdir: string = path.join(os.homedir(), '.openclaw', '__tmp')

    if (!fs.existsSync(openclawDir)) {
      console.error(`OpenClaw is not installed`)
      return
    }

    // OpenClaw Version
    const openclawVersion: string = execSync('openclaw -v').toString().trim()

    // await open(openclawDir)

    // hanlde ControlUI
    handleControlUIContents({
      answers,
      version: openclawVersion,
      globalDir: openclawDir,
      homeTmpDir: openclawHomeTmpdir
    })

  }).catch((error: any) => {
    console.log(error)
  })

}

// hanlde /ui/ui/
function handleControlUIContents(options: OpenClawHanldeOptions) {
  // Locale json file directory
  const localeJsonDir: string = `./src/locales/${options.answers.language}/ui`

  if (!fs.existsSync(localeJsonDir)) {
    console.error(`${localeJsonDir} path does not exist`)
    return
  }

  // UI assets file path
  const uiAssetsDir: string = path.join(options.globalDir, '/dist/control-ui/assets')
  const uiAssetsTmpDir: string = path.join(options.homeTmpDir, options.version, 'ui')

  // Read UI assets file path folder directory
  const assetsFiles: Array<string> = fs.readdirSync(uiAssetsDir)

  for (let i = 0; i < assetsFiles.length; i++) {
    const file: string = assetsFiles[i]

    // Find js file (index-xxxxxx.js)
    if (path.extname(file) === '.js') {
      let jsFileName: string = path.join(uiAssetsDir, file)
      const jsTmpFileName = path.join(uiAssetsTmpDir, file)
      let readFileName: string = jsFileName

      if (fs.existsSync(jsTmpFileName)) readFileName = jsTmpFileName
      else {
        createDirectory(uiAssetsTmpDir)

        fs.copyFileSync(jsFileName, jsTmpFileName)
      }

      let jsContent = fs.readFileSync(readFileName, 'utf-8')

      // Read locale folder directory
      readDirectory(localeJsonDir, (srcFile: any) => {
        // Find json file
        if (path.extname(srcFile) === '.json') {
          const jsonContent: string = fs.readFileSync(srcFile, 'utf-8')

          if (jsonContent) {
            try {
              const json = JSON.parse(jsonContent)
              if (typeof json === 'object') {
                for (const key in json) {
                  jsContent = jsContent.replace(new RegExp(key, 'g'), json[key])
                }
              }
              console.log(`${srcFile} successed.`)
            } catch (error) {
              console.error(error)
            }
          }
        }

        fs.writeFileSync(jsFileName, jsContent)
      })
    }
  }
}

/**
 * Read Directory
 */
function readDirectory(sourceDir: string, callback: Function) {
  if (!fs.existsSync(sourceDir)) return

  fs.readdirSync(sourceDir).forEach(async (file: string) => {
    let sourceFile = path.join(sourceDir, file)

    if (fs.statSync(sourceFile).isDirectory()) readDirectory(sourceFile, callback)
    else typeof callback === 'function' && callback(sourceFile)
  })
}

/**
 * Create directories
 */
function createDirectory(directory: string) {
  if (fs.existsSync(directory)) return true
  else {
    if (createDirectory(path.dirname(directory))) {
      fs.mkdirSync(directory)
      return true
    }
  }
}

main()