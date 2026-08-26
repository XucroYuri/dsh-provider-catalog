// Native DSH Cordis plugin for the local model catalog.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

export const name = 'dsh-provider-catalog'
export const description = 'Maintain a local model catalog from OpenCode metadata'

function dshHome() {
  return process.env.DSH_HOME || join(homedir(), '.dsh')
}

function cachePath() {
  return join(dshHome(), 'cache', 'model-catalog.json')
}

function parseOpencodeModels(output) {
  const lines = output.split('\n')
  const entries = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line && line.includes('/') && !line.startsWith('{') && !line.startsWith('}')) {
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      if (j < lines.length && lines[j].trim() === '{') {
        const text = lines.slice(j).join('\n')
        let depth = 0
        let end = -1
        for (let k = 0; k < text.length; k++) {
          if (text[k] === '{') depth++
          else if (text[k] === '}') {
            depth--
            if (depth === 0) { end = k + 1; break }
          }
        }
        if (end > 0) {
          try {
            const obj = JSON.parse(text.slice(0, end))
            const idx = line.indexOf('/')
            const provider = line.slice(0, idx)
            const modelId = line.slice(idx + 1)
            entries.push({
              provider,
              id: modelId,
              name: obj.name || modelId,
              api: obj.api || {},
              limit: obj.limit || {},
              capabilities: obj.capabilities || {},
              variants: obj.variants || {},
            })
            const consumed = text.slice(0, end).split('\n').length
            i = j + consumed
            continue
          } catch {}
        }
      }
    }
    i++
  }
  return entries
}

export function apply(ctx) {
  const args = ctx.get('cmdlineArgs')?.get() ?? []
  if (args[0] !== 'provider-catalog' && args[0] !== 'catalog') return

  const exit = ctx.get('appExit')
  const finish = (code) => { if (exit) exit(code) }

  try {
    const command = args[1]
    if (!command) {
      console.error('Usage: dsh --profile tools provider-catalog <refresh|list> ...')
      finish(2); return
    }

    if (command === 'refresh') {
      const proc = spawnSync('opencode', ['models', '--verbose'], { encoding: 'utf8', timeout: 60000 })
      if (proc.status !== 0) {
        console.error('Failed to run `opencode models --verbose`', proc.stderr || '')
        finish(1); return
      }
      const entries = parseOpencodeModels(proc.stdout)
      const path = cachePath()
      mkdirSync(join(path, '..'), { recursive: true })
      writeFileSync(path, JSON.stringify(entries, null, 2) + '\n', 'utf8')
      console.log(`Refreshed ${entries.length} models -> ${path}`)
      finish(0); return
    }

    if (command === 'list') {
      const path = cachePath()
      let entries = []
      if (existsSync(path)) {
        try { entries = JSON.parse(readFileSync(path, 'utf8')) } catch { entries = [] }
      }
      if (!Array.isArray(entries) || entries.length === 0) {
        console.error('Catalog is empty. Run: dsh --profile tools provider-catalog refresh')
        finish(1); return
      }
      const filter = args.find((a, i) => a === '--provider' && args[i+1]) ? args[args.indexOf('--provider')+1] : undefined
      const qIdx = args.indexOf('--query')
      const q = qIdx >= 0 && args[qIdx+1] ? args[qIdx+1].toLowerCase() : ''
      const filtered = entries.filter(e => {
        if (filter && e.provider !== filter) return false
        if (q && !`${e.provider}/${e.id} ${e.name || ''}`.toLowerCase().includes(q)) return false
        return true
      })
      if (args.includes('--json')) {
        console.log(JSON.stringify(filtered, null, 2))
      } else {
        for (const e of filtered) console.log(`${e.provider}/${e.id} (${e.name || ''})`)
      }
      finish(0); return
    }

    console.error(`Unknown command: ${command}`)
    finish(2)
  } catch (error) {
    console.error('dsh-provider-catalog failed:', error)
    finish(1)
  }
}
