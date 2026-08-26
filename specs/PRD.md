# dsh-provider-catalog PRD

## Problem Statement

DSH 需要知道“某个 provider 有哪些可用模型”，但又不能把所有模型直接塞进用户的选择列表。
需要一个独立的可用模型目录，与用户启用的 allowlist 分离。

## Goals

- 从 OpenCode / pi-ai / 本地缓存收集可用模型目录。
- 提供查询 API/CLI。
- 不直接修改用户 allowlist。

## Non-Goals

- 不负责模型调用。
- 不存储密钥。
