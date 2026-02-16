
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import shell from 'shelljs'
import latestVersion from 'latest-version'
import compareVersion from 'compare-version'

export async function main() {
  // Check if OpenClaw is installed
  if (shell.which('openclaw')) {
    const latestV: string = await latestVersion('openclaw')
    const localeV: string = execSync('openclaw -v').toString().trim()

    if (compareVersion(latestV, localeV) < 0) {
      console.log('OpenClaw Updating...')
      shell.exec('npm update -g openclaw')
      shell.exec('openclaw gateway restart')
    }
  }
  else {
    console.log('OpenClaw Installing...')
    shell.exec('npm install -g openclaw@latest')
  }

  shell.exec('openclaw -v')

  console.log('Installation successful!')
}

main()