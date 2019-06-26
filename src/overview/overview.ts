import {
  promises as fsPromises, existsSync
} from 'fs'
import { join } from 'path'
import simplegit from 'simple-git/promise';
import { RemoteWithRefs } from 'simple-git/typings/response';
var copydir = require('copy-dir')

const rootFolder = join(__dirname, '../..')
const testFolder = join(rootFolder, '..')
const assetsFolder = join(rootFolder, 'static/projects')

async function isDirectory(path: string): Promise<boolean> {
  return (await fsPromises.lstat(path)).isDirectory()
}

function isCurrentDirectory(path: string): boolean {
  return path === join(__dirname, '..')
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

async function collectData(folder: string) {
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
      git_url: string | null,
      documentation?: boolean
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
    const gitUrl = getRusAgroUrl(remotes)
    if (!gitUrl) {
      return
    }
    res[name] = {
      git_url: gitUrl
    }
    await CopyReadme(name, path)
    const doc = await CopyDocumentation(name, path)
    if (doc) {
      console.log('documentation copy', name)
      res[name].documentation = true
    }
  })
  await Promise.all(tasks)
  const result = JSON.stringify(res, null, 2)
  fsPromises.writeFile(join(assetsFolder, 'projects.json'), result)
}

collectData(testFolder)

/*
readdir(testFolder, async (err, files) => {
  const isDirectory = (source: string) => lstatSync(source).isDirectory()
  const res:{ [index:string] : { git_url: string | null, path: string } } = {}
  const folderWithProjects = files
    .map(file => {
      return {
        name: file,
        path: join(testFolder, file)
      }
    })
    .filter(({ name, path }) => isDirectory(path) && path !== join(__dirname, '..'))
  await Promise.all(folderWithProjects.map(async ({ name, path }) => {
    const git = simplegit(path)
    const isRepo = await git.checkIsRepo()
    if (!isRepo) {
      return
    }
    const remotes = isRepo ? (await git.getRemotes(true)) : []
    const gitUrl = getRusAgroUrl(remotes)
    if (!gitUrl) {
      return
    }
    res[name] = {
      git_url: gitUrl,
      path: path
    }
    const assetsProjectDir = join(assetsFolder, name)
    mkdir(assetsProjectDir, { recursive: true }, (err) => {
      if (err) throw err;
      copyFile(join(path, 'README.md'), join(assetsProjectDir, 'README.md'), (err) => {
        if (err) throw err;
        console.log('name README was copied');
      });
    });
  }))
  console.log(JSON.stringify(res, null, 2))
});
*/
function checkIsRusagroRepo (remotes: RemoteWithRefs[]): boolean {
  const gitIp = '***REMOVED***'
  return remotes.some(remote => {
    return remote.refs.fetch.includes(gitIp)
  })
}

function getRusAgroUrl (remotes: RemoteWithRefs[]): (string | null) {
  const gitIp = '***REMOVED***'
  const finded = remotes.find(remote => {
    return remote.refs.fetch.includes(gitIp)
  })
  return finded ? finded.refs.fetch : null
}
