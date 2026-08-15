# 在呢 ZAI NE

> 急急急？先别急，先记录此刻。

在呢是一款莫兰迪色系的本地优先桌面生活记录应用，把待办、日历、随手记和知识库放在一个安静的空间里。

## 功能

- 待办清单：区分今天截止与后续事项，支持截止日期和倒计时
- 日历日程：真实月历、开始与结束时间、重复日程、日程图标
- 随手记：按日期整理 Markdown 灵感，支持快速记录
- 知识库：导入正式笔记及附件，并在应用内预览常见格式
- 本地优先：当前版本无需注册，数据默认保存在每位用户自己的电脑中

## 下载

- [macOS Apple Silicon 版](https://github.com/shenfang055-gif/zaine/releases/download/v0.1.0/zai-ne-0.1.0-macOS-Apple-Silicon.zip)
- [Windows 10 / 11 x64 版](https://github.com/shenfang055-gif/zaine/releases/download/v0.1.0/zai-ne-0.1.0-Windows-x64.exe)

当前为 `0.1.0` 公开测试版，安装包尚未进行 Apple 与 Microsoft 商店签名，首次打开时系统可能显示安全提醒。

## 本地开发

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run build          # 构建宣传页与网页版
npm run desktop:dev    # 启动桌面版开发环境
npm run desktop:build  # 构建桌面端资源
npm run dist:mac       # 打包 macOS Apple Silicon
npm run dist:win       # 打包 Windows x64
```

## 数据说明

`0.1.0` 不连接云端数据库。每次安装拥有独立的本地数据空间，不会自动与其他用户共享。卸载应用或清理应用数据前，请先自行备份重要内容。

## 文件校验值

```text
macOS   a7c6bc7f636739d1d57d38988a5de49f9d16c42903a306835ad6a770e951f860
Windows c32b84c1f37cf512ae2ec1821821cd7750b6d7cb411819dcfbab94a28ead6696
```

## License

All rights reserved.
