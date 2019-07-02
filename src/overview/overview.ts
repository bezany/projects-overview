import {
  promises as fsPromises, existsSync
} from 'fs'
import { join } from 'path'
import simplegit from 'simple-git/promise';
import { RemoteWithRefs } from 'simple-git/typings/response';
import minimist from 'minimist'
var copydir = require('copy-dir')

const rootFolder = join(__dirname, '../..')
const testFolder = join(rootFolder, '..')
const assetsFolder = join(rootFolder, 'static/projects')

const argFilterGit = 'filter-git-remotes'
const args = minimist(process.argv.slice(2), {
  string: [argFilterGit]
})

async function isDirectory(path: string): Promise<boolean> {
  return (await fsPromises.lstat(path)).isDirectory()
}

function isCurrentDirectory(path: string): boolean {
  return path === join(__dirname, '..')
}

function getGitRemotes (remotes: RemoteWithRefs[], filter?: string): (string[]) {
  const allFetch = remotes.map(el => el.refs.fetch)
  if (filter) {
    return allFetch.filter(ref => ref.includes(filter))
  }
  return allFetch
}

async function tryGetPublishDirs(sourcePath: string): Promise<string[]> {
  try {
    const settingsPath = join(sourcePath, '.vscode\\settings.json')
    const file = await fsPromises.readFile(settingsPath)
    const settings = JSON.parse(file.toString())
    const dirs = settings['deploy.reloaded'].targets.map((el: any) => el.dir)
    return dirs
  } catch {
    return []
  }
}

async function CopyReadme(projectName: string, sourcePath: string) {
  const assetsProjectDir = join(assetsFolder, projectName)
  await fsPromises.mkdir(assetsProjectDir, { recursive: true })
  try {
    await fsPromises.copyFile(join(sourcePath, 'README.md'), join(assetsProjectDir, 'README.md'))
  } catch {
    console.log('README not exists or copy error', projectName)
    return
  }
  console.log('README was copied', projectName)
}

async function CopyDocumentation(projectName: string, sourcePath: string): Promise<boolean> {
  const resultDocDir = join(assetsFolder, projectName, 'documentation')
  const foledWithDocs = ['doc', 'documentation']
  const findedDocFolder = foledWithDocs.find(el => {
    if (!existsSync(join(sourcePath, el))) {
      return false
    }
    return true
  })
  if (!findedDocFolder) {
    return false
  }
  const sourceDoc = join(sourcePath, findedDocFolder)
  copydir.sync(sourceDoc, resultDocDir, {})
  return true
}

async function collectData(folder: string, filterGit?: string) {
  const subElements = await fsPromises.readdir(folder)
  const subFolders = subElements
    .map(subFolder => {
      return {
        name: subFolder,
        path: join(folder, subFolder)
      }
    })
    .filter(async ({ name, path }) => {
      (await isDirectory(path)) && !isCurrentDirectory(path)
    })
  const res: {
    [index: string]: {
      gitUrls: string[],
      documentation?: boolean,
      publishPaths?: string[]
    }
  } = {}
  const tasks = subFolders.map(async ({ name, path }) => {
    console.log(path)
    const git = simplegit(path)
    const isRepo = await git.checkIsRepo()
    if (!isRepo) {
      return
    }
    const remotes = await git.getRemotes(true)
    const gitUrls = getGitRemotes(remotes, filterGit)
    if (!gitUrls || gitUrls.length === 0) {
      return
    }
    res[name] = {
      gitUrls: gitUrls
    }
    await CopyReadme(name, path)
    const doc = await CopyDocumentation(name, path)
    if (doc) {
      console.log('documentation copy', name)
      res[name].documentation = true
    }
    const publishPaths = await tryGetPublishDirs(path)
    if (publishPaths.length > 0) {
      res[name].publishPaths = publishPaths
    }
  })
  await Promise.all(tasks)
  const result = JSON.stringify(res, null, 2)
  fsPromises.writeFile(join(assetsFolder, 'projects.json'), result)
}

collectData(testFolder, args[argFilterGit])
