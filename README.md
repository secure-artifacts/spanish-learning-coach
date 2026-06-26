# 西语母语冲刺教练（桌面版）

Windows 独立桌面软件，**不是网页版，也不是 Cursor 插件**。

## 为什么选桌面软件而不是插件？

| 方案 | 适合度 | 原因 |
|------|--------|------|
| **独立桌面软件（当前方案）** | ✅ 最佳 | 离线可用、本地 SRS 进度、麦克风口语/听写、窗口全屏学习 |
| Cursor 插件 | ❌ 不适合 | 绑在 IDE 里，无法做每日 20 分钟系统学习、语音、视频、间隔重复 |
| 网页版 | ❌ 已移除 | 你已明确要求不要网页版；GitHub Pages 部署已删除 |

## 功能

- **A1–C2 语法课程**：111 个语法单元，听→说→读→写
- **场景生活**：医院、银行、政务、超市、餐厅、酒店、机场、警察、租房、邮局等
- **行业西语**：医生、律师、IT、教师、餐饮、零售、建筑、会计、房产、物流等 17 个行业
- **学习方法**：间隔重复 SRS、语块、费曼、影子跟读、场景记忆
- **本地存储**：进度与 SRS 保存在本机，无需联网

## 启动

### 方式一：双击 bat（推荐）

```
启动学习教练.bat
```

首次运行会自动 `npm install`，然后构建并打开桌面窗口。

### 方式二：命令行

```bash
npm install
npm run desktop        # 构建 + 启动桌面版
npm run desktop:dev    # 开发模式（热更新 + Electron）
```

## 使用说明

1. 顶部 **📚 语法课程** — 按 A1–C2 系统学习
2. 顶部 **🌍 场景 & 行业** — 按生活场景或职业浏览句子和词汇
3. 点击 **🔊** 朗读西语；点击 **+ SRS** 加入间隔重复复习
4. 顶部 **🔁** 按钮进入 SRS 复习

## 技术栈

- React + TypeScript + Vite
- **独立桌面壳**：Electron（内置 Chromium），不依赖本机安装的 Chrome / Edge
- Web Speech API（口语 / 听写）
- YouTube 在软件窗口内登录与播放

## 启动

```bash
npm install          # 首次会下载 Electron
npm run desktop      # 构建 + 启动独立桌面窗口
npm run desktop:dev  # 开发模式（热更新）
```

或双击 `启动学习教练.bat`。

用户数据（含 YouTube 登录状态）保存在项目目录 `.app-data/`。

## 仓库

https://github.com/secure-artifacts/spanish-learning-coach

## 如何发布新版本

本项目使用 GitHub Actions 自动构建和发布。每次发布新版本只需要创建一个 Git Tag 并推送即可，构建产物会自动附带 Attestation 安全签名。

### 发布步骤

#### 1. 确保代码已提交并推送

在发布之前，确保你的所有代码改动已经提交并推送到 GitHub：

```bash
# 查看当前状态
git status

# 添加所有改动
git add .

# 提交改动（把"你的改动说明"替换成实际的描述）
git commit -m "你的改动说明"

# 推送到 GitHub
git push origin master
```

#### 2. 创建版本 Tag

Git Tag 是一个版本标记，用于标识发布的版本号。版本号格式为 `v主版本.次版本.修订版本`，例如 `v1.0.0`、`v1.1.0`、`v2.0.0`。

```bash
# 创建一个新的版本 tag（将 v1.0.1 替换为你想要的版本号）
git tag -a v1.0.1 -m "Release version 1.0.1"
```

#### 3. 推送 Tag 触发自动构建

```bash
# 推送 tag 到 GitHub（这会自动触发 CI 构建）
git push origin v1.0.1
```

推送后，GitHub Actions 会自动执行以下操作：

1. 构建项目
2. 生成安全签名（Attestation）
3. 创建 Release 并上传构建产物（`.zip`）

#### 4. 查看构建结果

- 构建进度：访问项目的 **Actions** 页面查看
- 发布结果：访问项目的 **Releases** 页面查看已发布的文件

### 版本号说明

| 版本号格式 | 什么时候用 | 示例 |
|-----------|-----------|------|
| `vX.0.0` | 重大更新、不兼容改动 | `v2.0.0` |
| `vX.Y.0` | 新增功能 | `v1.1.0` |
| `vX.Y.Z` | 修复 bug | `v1.0.1` |

### 如果构建失败怎么办

1. 访问项目的 **Actions** 页面查看错误日志
2. 修复代码问题
3. 删除失败的 tag 并重新创建：

```bash
# 删除本地 tag
git tag -d v1.0.1

# 删除远程 tag
git push origin :refs/tags/v1.0.1

# 修复问题后，重新创建并推送
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```
