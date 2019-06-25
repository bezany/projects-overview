import { lstatSync, readdir } from 'fs'
import { join } from 'path'
import simplegit from 'simple-git/promise';
import { RemoteWithRefs } from 'simple-git/typings/response';

const testFolder = join(__dirname, '../..')

readdir(testFolder, (err, files) => {
  const isDirectory = (source: string) => lstatSync(source).isDirectory()

  files
    .map(file => join(testFolder, file))
    .filter(file => isDirectory(file) && file !== join(__dirname, '..')).forEach(async file => {
    const git = simplegit(file)
    const isRepo = await git.checkIsRepo()
    const remotes = isRepo ? (await git.getRemotes(true)) : []
    console.log(file);
    console.log('is git repo: ', isRepo)
    console.log('rusagro repo: ', getRusAgroUrl(remotes))

  });
});

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
