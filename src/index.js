// Minimal DSH Cordis command wrapper around the Python CLI.
import { spawnSync } from 'node:child_process'

export const name = 'dsh-provider-catalog'
export const description = 'Manage the local model catalog in DeepSeek Harness'

export function apply(ctx) {
  const args = ctx.get('cmdlineArgs')?.get() ?? []
  if (args[0] !== 'provider-catalog' && args[0] !== 'catalog') return

  const result = spawnSync('dsh-provider-catalog', args.slice(1), {
    stdio: 'inherit',
    shell: false,
  })

  const exit = ctx.get('appExit')
  if (exit) exit(result.status ?? 1)
}
