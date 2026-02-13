
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import { PromptModule } from 'inquirer'
import open from 'open'

function main() {
  const prompt: PromptModule = inquirer.createPromptModule()
  const questions: Array<any> = [
    {
      type: 'list', name: 'language', message: 'Please select a language', choices: [
        { name: '简体中文', value: 'zh' },
        { name: '日本語', value: 'ja' },
        { name: '한국어', value: 'ko' }
      ]
    }
  ]

  prompt(questions).then(async (answers: any) => {
    // Show the installation root directory of npm global packages
    const globalRoot: string = execSync('npm root -g').toString().trim()
    // Install the global path for OpenClaw
    const openclawDir: string = path.join(globalRoot, 'openclaw')

    if (!fs.existsSync(openclawDir)) {
      console.error(`OpenClaw is not installed`)
      return
    }

    // UI assets file path
    const openclawUIAssetsDir: string = path.join(openclawDir, '/dist/control-ui/assets')
    // Read UI assets file path folder directory
    const assetsFiles: Array<string> = fs.readdirSync(openclawUIAssetsDir)
    // locale json file directory
    const localeJsonDir: string = `./src/locales/${answers.language}`

    if (!fs.existsSync(localeJsonDir)) {
      console.error(`${localeJsonDir} path does not exist`)
      return
    }

    await open(openclawDir)

    for (let i = 0; i < assetsFiles.length; i++) {
      const file: string = assetsFiles[i]

      // Find js file (index-xxxxxx.js)
      if (path.extname(file) === '.js') {
        const jsFileName: string = path.join(openclawUIAssetsDir, file)
        let jsContent = fs.readFileSync(jsFileName, 'utf-8')

        fs.writeFileSync(jsFileName + `.${Date.now()}.bak`, jsContent)

        // Read locale folder directory
        readDirectory(localeJsonDir, (srcFile: any) => {
          // Find json file
          if (path.extname(srcFile) === '.json') {
            const jsonContent: string = fs.readFileSync(srcFile, 'utf-8')

            if (jsonContent) {
              const json = JSON.parse(jsonContent)
              if (typeof json === 'object') {
                for (const key in json) {
                  jsContent = jsContent.replace(new RegExp(key, 'g'), json[key])
                }
              }
              console.log(`${srcFile} successed.`)
            }
          }
          fs.writeFileSync(jsFileName, jsContent)
        })
      }
    }
  }).catch((error: any) => {
    console.log(error)
  })

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

main()