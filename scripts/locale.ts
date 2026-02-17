
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import ora from 'ora'
import { execSync } from 'child_process'
import { select } from '@clack/prompts'

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

const spinner = ora('Starting...').start()

export async function execLocale() {
  spinner.color = 'yellow'
  spinner.text = 'Verifying whether OpenClaw is installed.'

  // Show the installation root directory of npm global packages
  const globalRoot: string = execSync('npm root -g').toString().trim()
  // Install the global path for OpenClaw
  const openclawDir: string = path.join(globalRoot, 'openclaw')
  // OpenClaw main directory temporary folder
  const openclawHomeTmpdir: string = path.join(os.homedir(), '.openclaw', '__tmp')

  if (!fs.existsSync(openclawDir)) {
    spinner.color = 'red'
    spinner.fail(`OpenClaw is not installed`)
    spinner.stop()
    process.exit(0)
  }

  spinner.color = 'green'

  // OpenClaw Version
  const openclawVersion: string = execSync('openclaw -v').toString().trim()

  spinner.succeed(`OpenClaw Version：${openclawVersion}`)

  // await open(openclawDir)

  const options: Array<any> = [
    // 中文 Chinese
    { label: '简体中文', value: 'zh' },
    // 日语 Japanese
    { label: '日本語', value: 'ja' },
    // 韩语 Korean
    { label: '한국어', value: 'ko' },
    // 法语 French
    { label: 'Français', value: 'fr' },
    // 德语 German 
    { label: 'Deutsch', value: 'de' },
    // 意大利语 Italian 
    { label: 'Italiano', value: 'it' },
    // 葡萄牙语 Portuguese
    { label: 'Português', value: 'pt' },
    // 西班牙语 Spanish
    { label: 'Español', value: 'es' },
    // 孟加拉语 Bangla
    { label: 'বাংলা', value: 'bn' },
    // 越南语 Vietnamese
    { label: 'Tiếng Việt', value: 'vi' },
    // 菲律宾语 Filipino
    { label: 'Filipino', value: 'fi' },
    // 泰卢固语 Telugu
    { label: 'ప్రామాణిక', value: 'te' },
    // 印地语 Hindi
    { label: 'तेलुगु', value: 'hi' },
  ]
  const language = await select({
    message: 'Please select a language.',
    options,
  })

  // hanlde ControlUI
  handleControlUIContents({
    answers: { language },
    version: openclawVersion,
    globalDir: openclawDir,
    homeTmpDir: openclawHomeTmpdir
  })

}

// hanlde /ui/ui/
function handleControlUIContents(options: OpenClawHanldeOptions) {
  // Locale json file directory
  const localeJsonDir: string = `./src/locales/${options.answers.language}/ui`

  if (!fs.existsSync(localeJsonDir)) {
    spinner.fail(`${localeJsonDir} path does not exist`)
    spinner.stop()
    process.exit(0)
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

        spinner.color = 'yellow'
        spinner.text = 'Converting...'

        // Find json file
        if (path.extname(srcFile) === '.json') {
          const jsonContent: string = fs.readFileSync(srcFile, 'utf-8')

          if (jsonContent) {
            try {
              const json = JSON.parse(jsonContent)
              if (typeof json === 'object') {
                for (const key in json) {
                  jsContent = jsContent.replace(new RegExp(key, 'g'), json[key])

                  spinner.color = 'blue'
                }
                spinner.color = 'green'
              }
            } catch (error) {
              console.error(error)
            }
          }
        }
      })

      spinner.color = 'green'
      spinner.succeed(`Conversion successed.`)
      spinner.stop()

      fs.writeFileSync(jsFileName, jsContent)
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