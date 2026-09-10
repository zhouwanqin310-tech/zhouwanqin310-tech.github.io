# 周万勤的个人学术主页

正式地址：**https://zhouwanqin310-tech.github.io/**

使用 Markdown 维护的中英双语学术主页。中文首页为 `/`，英文首页为 `/en/`。正文由 Eleventy 预先生成，访问者无需等待前端框架加载。

## 日常更新：直接在 GitHub 编辑

1. 打开本仓库，进入要修改的 Markdown 文件。
2. 点击铅笔按钮 **Edit this file**，修改文字或文件开头的信息。
3. 点击 **Commit changes**，提交到 `main`。
4. 在 **Actions** 中查看构建结果；成功后网页会自动更新。部署通常需要几分钟。

你也可以在本地使用 Obsidian、VS Code 或任意文本编辑器修改，然后提交并推送。

### 应该修改哪个文件？

| 内容 | 位置 |
| --- | --- |
| 中文简介、研究方向、教育经历、奖励 | `src/content/zh/profile/profile.md` |
| 英文简介、研究方向、教育经历、奖励 | `src/content/en/profile/profile.md` |
| 中文论文条目 | `src/content/zh/publications/` |
| 英文论文条目 | `src/content/en/publications/` |
| 项目 | `src/content/zh/projects/` 与 `src/content/en/projects/` |
| 学术活动 | `src/content/zh/activities/` 与 `src/content/en/activities/` |
| 研究笔记 | `src/content/zh/notes/` 与 `src/content/en/notes/` |
| 主页照片 | `src/assets/portrait.jpg`，用同名照片替换即可 |
| 邮箱、GitHub、站点网址 | `src/_data/site.js` |

不需要修改 `src/_includes/` 中的 HTML 模板。

## 新增一篇论文、项目或笔记

1. 从 `templates/` 复制对应的 `.md` 模板。
2. 放入上表对应目录，文件名使用英文短横线，例如 `my-new-paper.md`。
3. 修改 `title`、`key`、日期和正文。`key` 必须唯一，建议和文件名一致。
4. `draft: true` 表示草稿，不出现在网页和站点地图中。准备好后改为 `draft: false`。
5. 将英文版本放入 `en` 下相同栏目；设置 `lang: en`，保留相同的 `key`。

中英文独立维护，切换语言会跳到相同 `kind` 和 `key` 的页面；如果还没有对应翻译，会回到另一语言首页。

```yaml
---
title: "论文标题：带冒号的标题应放在引号内"
lang: zh
kind: publications
key: my-new-paper
draft: false
created: "2026-09-10"
status: published
venue: "期刊或会议名称"
year: 2026
authors:
  - "周万勤"
  - "合作者姓名"
order: 15
links:
  - label: "PDF"
    url: "https://example.com/paper.pdf"
---

## 研究概述

在这里写研究问题、方法与发现。支持列表、链接、图片和表格。
```

### 常用字段

- `kind`：`publications`、`projects`、`activities` 或 `notes`。
- `status`（论文）：`published` 是已发表，`review` 是在投或审稿中；后者可添加 `reviewStatus` 说明具体状态。
- `order`：数字越小越靠前；相同顺序时年份较新者在前。默认 100。
- `authors`：按正式发表顺序填写；`周万勤` 和 `Wanqin Zhou` 自动加粗。作者表暂缺时可用 `contribution` 说明贡献。
- `links`：只填写已有的真实链接。不填写或留空时，不显示对应按钮。
- `image`：可选论文或项目图片，如 `/assets/my-paper.png`；配套填写 `imageAlt`。
- `assets`：正文引用的本地图片路径列表；这些图片的更换也会计入该条目的修改时间。
- `eventDate`：学术活动发生的日期；与页面更新时间不同。
- `bibtex`：可选引用文本，在详情页折叠显示。

日期与字符串建议加引号。不要直接编辑 `_site/`，该目录会在下一次构建时重新生成。

## 最近更新时间如何计算？

- 默认读取 Markdown 文件及关联图片的最近 Git 提交日期。
- 页脚显示当前语言所有公开内容的最新日期；详情页显示该条目的日期。
- 同一张照片被两种语言引用时，替换照片会更新两种语言的日期。
- 邮箱等共享资料在 `src/_data/site.js` 中修改时，也计入主页的更新日期。
- 重新构建、浏览页面或仅修改 CSS 不会刷新内容日期。
- 首次提交前的新文件使用 `created`；未填写时使用建站日期。不会用构建机器不可靠的文件修改时间。
- 如需指定内容的实际修订日期，在文件开头增加 `updated: "2026-09-10"`；它优先于 Git 日期。恢复自动更新时删除该字段。
- 时间统一按 `Asia/Shanghai` 转成日期显示。GitHub Actions 保留完整 Git 历史以保证日期计算正确。

## 本地预览与检查

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

打开 `http://localhost:8088/`。保存文件后会自动更新。

```bash
npm run check
```

检查内容日期、草稿状态、双语路径、内部链接和页面结构，再生成 `_site/`。

## 简历与个人资料

`/cv/` 与 `/en/cv/` 是可打印简历，内容和主页共享。点击“打印 / 保存为 PDF”后，可在浏览器打印对话框中保存 PDF。

当前仅公开学术邮箱。原始简历 PDF、电话、微信和项目邀请码不包含在仓库中。照片为本人提供的原图，不使用 AI 修图。

## 部署与回退

仓库 **Settings → Pages → Source** 设置为 **GitHub Actions**。工作流在 `main` 更新后检查、构建并部署。检查失败时不会替换已在线的版本。

需要撤销时，回退造成问题的内容提交，再推送到 `main` 即可触发重新发布；无需删除仓库。

## 内容核对记录

- 原始信息依据本人提供的学术简历，审稿状态仍待本人持续维护。
- RAG 论文 DOI：<https://doi.org/10.46451/ijclt.260413>。
- AAAI 论文完整标题、作者顺序与书目信息依据正式出版页：<https://ojs.aaai.org/index.php/AAAI/article/view/39350>。原简历中的“二作”与正式作者列表不一致，页面采用正式列表，不单独标作者排名。
- 中文论文的英文标题属于说明性翻译，详情页同时保留原始中文标题。
- 活动与笔记示例均为草稿，不作为真实经历发布。

## 设计参考与权利说明

整体视觉参考 [minimal-academic-homepage](https://github.com/Xin-Jiaqi/minimal-academic-homepage)，履历信息层级参考 [Awesome-CV](https://github.com/posquit0/Awesome-CV) 与 [RenderCV](https://github.com/rendercv/rendercv)。本项目的 HTML、CSS 和构建逻辑独立实现，没有复制这些项目的代码或图片。

原始照片与个人学术内容归其权利人所有。本仓库的公开可见性不表示许可他人使用个人照片或研究内容。
