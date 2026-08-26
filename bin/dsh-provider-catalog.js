#!/usr/bin/env node
// Standalone CLI wrapper for dsh-provider-catalog.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../src/dsh_provider_catalog.py', import.meta.url))
const result = spawnSync('python3', [script, ...process.argv.slice(2)], { stdio: 'inherit' })
process.exit(result.status ?? 1)
