---
title: "Beyond Dialect Labels: Validation-Gated Sparse Features in Dialectalized Chinese Writing"
lang: "zh"
kind: "publications"
key: "beyond-dialect-labels"
draft: false
created: "2026-09-10"
status: "published"
venue: "NLPCC 2026（CCF-C Oral）"
authors:
  - "Wanqin Zhou"
  - "Keyan Jin*"
year: 2026
order: 10
---

## 研究概述

研究大语言模型如何表征汉语方言书写中的语言变异。基于 180 个语义核心构造 1,800 条受控刺激，并在 Qwen2.5-1.5B 的 28 个 Transformer 层上训练 TopK 稀疏自编码器（SAE），结合反事实替换、held-out token validation 与随机特征消融，对方言相关稀疏特征进行严格验证。

结果显示，模型内部更普遍地编码局部书写形式和具体标记类型，而非宽泛的方言类别。最强特征 Layer 27–F9116 的 AUROC 达到 0.991，precision@50 为 0.96。研究据此提出一套 validation-gated 的可解释性分析流程，用以区分表面可解释的 SAE 特征与真正能够泛化并影响模型预测的特征。
