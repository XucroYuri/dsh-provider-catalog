# dsh-provider-catalog

![CI](https://github.com/XucroYuri/dsh-provider-catalog/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/github/license/XucroYuri/dsh-provider-catalog)

为 DeepSeek Harness 维护基于 OpenCode 元数据的本地模型目录。

> 状态：稳定

## 功能特性

- 从 OpenCode 刷新模型目录
- 本地 JSON 缓存
- 按 provider 和关键字过滤
- 原生 Cordis 命令插件

## 环境要求

- DeepSeek Harness (DSH) 0.1.1+
- OpenCode CLI（可选，用于 sync/catalog/bridge 功能）
- Node.js 22+
- Python 3.12+（仅用于备用 CLI 测试）

## 安装

将插件添加到 DSH profile：

```bash
cd ~/.dsh/profiles/tools
npm install @xucroyuri/dsh-provider-catalog
```

然后在 `cordis.patch.yml` 中添加：

```yaml
- insert:
    - id: provider-catalog
      name: '@xucroyuri/dsh-provider-catalog'
```

## 使用方法

```bash
dsh --profile tools provider-catalog refresh
dsh --profile tools provider-catalog list --provider deepseek
dsh --profile tools provider-catalog list --query glm
```

## 开发

```bash
node --check src/index.js
PYTHONPATH=src python3 -m unittest discover -s tests -p 'test_*.py' -v
```

## 许可证

MIT


## 相关插件

- [dsh-opencode-sync](https://github.com/XucroYuri/dsh-opencode-sync)
- [dsh-provider-catalog](https://github.com/XucroYuri/dsh-provider-catalog)
- [dsh-model-manager](https://github.com/XucroYuri/dsh-model-manager)
- [dsh-llm-oauth-ui](https://github.com/XucroYuri/dsh-llm-oauth-ui)
- [dsh-opencode-bridge](https://github.com/XucroYuri/dsh-opencode-bridge)


## 文档

- [CHANGELOG.md](CHANGELOG.md)
- [CONTRIBUTING.zh.md](CONTRIBUTING.zh.md)
- [SECURITY.zh.md](SECURITY.zh.md)
- [AUTHORS.md](AUTHORS.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)


## 测试

```bash
npm test
npm run smoke
npm run pack:check
```

## 配置

| 参数 | 默认值 | 说明 |
|---|---|---|
| `--dsh-home` | `~/.dsh` | DSH 主目录 |
| `--json` | false | JSON 输出 |


## 路线图

- 发布到 npm
- 集成 DSH 主 Web UI
- 完整 tool-call 协议支持
- 更多模型发现来源
