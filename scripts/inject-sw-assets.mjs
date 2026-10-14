import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const swPath = path.join(distDir, 'sw.js')

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...await listFiles(path.join(directory, entry.name), relative))
    } else if (relative !== 'sw.js' && relative !== '_redirects') {
      files.push(relative)
    }
  }
  return files
}

const files = (await listFiles(distDir)).sort()
const urls = ['./', ...files.map(file => `./${file}`)]
const versionHash = createHash('sha256')
for (const file of files) {
  versionHash.update(file)
  versionHash.update(await readFile(path.join(distDir, ...file.split('/'))))
}
const hash = versionHash.digest('hex').slice(0, 12)
let worker = await readFile(swPath, 'utf8')

if (!worker.includes('/*__PRECACHE_MANIFEST__*/[]') || !worker.includes('__BUILD_HASH__')) {
  throw new Error('Service Worker 缺少建置時注入標記')
}

worker = worker
  .replace('/*__PRECACHE_MANIFEST__*/[]', JSON.stringify(urls))
  .replace('__BUILD_HASH__', hash)

await writeFile(swPath, worker, 'utf8')
console.log(`Service Worker 已加入 ${urls.length} 個離線資源（${hash}）`)
