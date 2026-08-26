# dsh-provider-catalog

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
