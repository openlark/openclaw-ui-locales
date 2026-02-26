
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
    { label: 'اللغة العربية (Arabic 阿拉伯语)', value: 'ar' },
    { label: 'বাংলা (Bangla 孟加拉语)', value: 'bn' },
    { label: '简体中文 (Chinese Simplified)', value: 'zh-CN' },
    { label: '繁體中文 (Chinese Traditional)', value: 'zh-TW' },
    { label: 'čeština (Czech 捷克语)', value: 'cs' },
    { label: 'ελληνικά (Greek 希腊语)', value: 'el' },
    { label: 'English (English 英语)', value: 'en' },
    { label: 'Esperanto (Esperanto 世界语)', value: 'eo' },
    { label: 'suomi (Finnish 芬兰语)', value: 'fi' },
    { label: 'Filipino (Filipino 菲律宾语)', value: 'fil' },
    { label: 'Français (French 法语)', value: 'fr' },
    { label: 'Deutsch (German 德语)', value: 'de' },
    { label: 'हिन्दी (Hindi 印地语)', value: 'hi' },
    { label: 'Bahasa Indonesia (Indonesian 印度尼西亚语)', value: 'id' },
    { label: 'Italiano(Italian 意大利语)', value: 'it' },
    { label: '日本語 (Japanese 日语)', value: 'ja' },
    { label: '한국어 (Korean 韩语)', value: 'ko' },
    { label: 'Bahasa Melayu (Malay 马来语)', value: 'ms' },
    { label: 'فارسی (Persian 波斯语)', value: 'pa' },
    { label: 'polski (Polish 波兰语)', value: 'pl' },
    { label: 'Português (Portuguese 葡萄牙语)', value: 'pt' },
    { label: 'Português do Brasil (Portuguese Brazilian 巴西葡萄牙语)', value: 'pt-BR' },
    { label: 'Română (Romanian 罗马尼亚语)', value: 'ro' },
    { label: 'Русский (Russian 俄语)', value: 'ru' },
    { label: 'Español (Spanish 西班牙语)', value: 'es' },
    { label: 'தமிழ் (Tamil 泰米尔语)', value: 'ta' },
    { label: 'తెలుగు (Telugu 泰卢固语)', value: 'te' },
    { label: 'Türkçe (Turkish 土耳其语)', value: 'tr' },
    { label: 'Українська (Ukrainian 乌克兰语)', value: 'uk' },
    { label: 'Tiếng Việt (Vietnamese 越南语)', value: 'vi' },
  ]
  const language = await select({
    message: 'Please select a language.',
    options,
  })

  if (!language) return
  if (typeof language === 'symbol') return

  // hanlde ControlUI
  handleControlUIContents({
    answers: { language },
    version: openclawVersion,
    globalDir: openclawDir,
    homeTmpDir: openclawHomeTmpdir
  })

}

// hanlde ControlUI
function handleControlUIContents(options: OpenClawHanldeOptions) {
  // Locale json file for language
  const langJsonDir: string = `./locales/${options.answers.language}`

  if (options.answers.language !== 'en' && !fs.existsSync(langJsonDir)) {
    spinner.fail(`${langJsonDir} path does not exist`)
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
    const jsTmpFileName = path.join(uiAssetsTmpDir, file)
    let jsFileName: string = path.join(uiAssetsDir, file)

    // Find js file (index-xxxxxx.js)
    if (file.indexOf('index-') > -1 && path.extname(file) === '.js') {
      if (options.answers.language === 'en') {
        if (fs.existsSync(jsTmpFileName)) {
          fs.copyFileSync(jsTmpFileName, jsFileName)

          spinner.color = 'green'
          spinner.succeed(`Conversion successed.`)
          spinner.stop()
        }

        continue
      }

      let readFileName: string = jsFileName

      if (fs.existsSync(jsTmpFileName)) readFileName = jsTmpFileName
      else {
        createDirectory(uiAssetsTmpDir)

        fs.copyFileSync(jsFileName, jsTmpFileName)
      }

      let jsContent = fs.readFileSync(readFileName, 'utf-8')

      // Read locale folder directory for UI
      readDirectory(`${langJsonDir}/ui`, (srcFile: any) => {

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

      fs.writeFileSync(jsFileName, jsContent)

      spinner.color = 'green'
      spinner.succeed(`Conversion successed.`)
      spinner.stop()
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