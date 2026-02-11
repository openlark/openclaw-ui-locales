
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import { PromptModule } from 'inquirer'

class App {
  constructor() {
  }

  async start() {
    const prompt: PromptModule = inquirer.createPromptModule()
    const questions: Array<any> = [
      {
        type: 'list', name: 'language', message: 'Please select the OpenClaw UI language', choices: [
          { name: '简体中文', value: 'zh' },
          { name: 'English', value: 'en' }
        ]
      }
    ]

    prompt(questions).then(async (answers: any) => {
      // Show the installation root directory of npm global packages
      const globalRoot: string = execSync('npm root -g').toString().trim()
      // Install the global path for OpenClaw
      const openclawDir: string = path.join(globalRoot, 'openclaw')
      // UI assets file path
      const openclawUIAssetsDir: string = path.join(openclawDir, '/dist/control-ui/assets')
      // Read UI assets file path folder directory
      const assetsFiles: Array<string> = fs.readdirSync(openclawUIAssetsDir)
      // locale json file directory
      const localeJsonDir: string = `./src/${answers.language}`

      for (let i = 0; i < assetsFiles.length; i++) {
        const file: string = assetsFiles[i]

        // Find js file (index-xxxxxx.js)
        if (path.extname(file) === '.js') {
          const jsFileName: string = path.join(openclawUIAssetsDir, file)
          let jsContent = fs.readFileSync(jsFileName, 'utf-8')

          // Read locale folder directory
          this.readDirectory(localeJsonDir, (srcFile: any) => {
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

                console.log(`${srcFile} Conversion Successful.`)
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
  readDirectory(sourceDir: string, callback: Function) {
    fs.readdirSync(sourceDir).forEach(async (file: string) => {
      let sourceFile = path.join(sourceDir, file)

      if (fs.statSync(sourceFile).isDirectory()) this.readDirectory(sourceFile, callback)
      else typeof callback === 'function' && callback(sourceFile)
    })
  }

}

new App().start()