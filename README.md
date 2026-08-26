# dsh-provider-catalog

![CI](https://github.com/XucroYuri/dsh-provider-catalog/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/github/license/XucroYuri/dsh-provider-catalog)

Maintain a local model catalog from OpenCode metadata for DeepSeek Harness.

> Status: Stable

## Features

- Refresh model catalog from OpenCode
- Local JSON cache
- Filter by provider and query
- Native Cordis command plugin

## Requirements

- DeepSeek Harness (DSH) 0.1.1+
- OpenCode CLI (optional, for sync/catalog/bridge features)
- Node.js 22+
- Python 3.12+ (only for fallback CLI tests)

## Installation

Add the plugin to your DSH profile:

```bash
cd ~/.dsh/profiles/tools
npm install @xucroyuri/dsh-provider-catalog
```

Then add to `cordis.patch.yml`:

```yaml
- insert:
    - id: provider-catalog
      name: '@xucroyuri/dsh-provider-catalog'
```

## Usage

```bash
dsh --profile tools provider-catalog refresh
dsh --profile tools provider-catalog list --provider deepseek
dsh --profile tools provider-catalog list --query glm
```

## Development

```bash
node --check src/index.js
PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_*.py' -v
```

## License

MIT
