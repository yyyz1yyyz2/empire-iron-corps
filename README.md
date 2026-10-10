# 铁军组织包 · empire-iron-corps README

一套"AI 是劳动者,人只拍板"的 AI 团队组织范式:16 员 AI 角色军队的完整宪章(使命/总纲/十条军规/全员人设/三部条令)+知识图谱方法论+五个落地模板+双验证脚本。

**新用户从这里开始**:[使用说明.md](使用说明.md)(手把手手册)→ [成功验证.md](成功验证.md)(实跑记录,照着做不通先对照它)。

## 安装(三分钟上手)

1. **环境**:Node.js ≥ 18(仅验证脚本需要;不跑验证可不装)。
2. **两个包二选一**:Windows 用 zip,Unix/macOS 用 tar.gz(部分老版 unzip 对中文文件名 zip 会乱码)。
3. **作为技能安装**(推荐):把 `empire-iron-corps/` 整个目录复制进你的 AI 编码器技能目录——
   - ZCode 类:`~/.agents/skills/` 或项目 `.agents/skills/` 下;Claude Code 类个人级惯例为 `~/.claude/skills/`(以你的加载器文档为准);
   - 装好后对助手说"组装铁军/开作战会/召唤总裁"即可触发(入口见 SKILL.md)。
4. **作为纯文档使用**:把 `references/` 下的 22 份宪章与 `templates/` 复制到 `<项目>/docs/empire/`,图谱种子两件另复制到 `<项目>/docs/knowledge-graph/`(见使用说明 §三),新建空 `docs/PROJECT_MEMORY.md`,按宪章以"人设全文+任务书"派单。

## 目录

```
empire-iron-corps/
├── SKILL.md          # 技能入口(使命/组装/作战会/召唤/自动成长/知识图谱)
├── README.md         # 本文件
├── LICENSE.md        # 许可(文档 CC BY 4.0 + 代码 MIT)
├── CHANGELOG.md      # 版本记录
├── references/       # 22 份宪章 + knowledge-graph/ 方法论 + templates/ 五模板
└── scripts/          # verify-empire.mjs / verify-graph.mjs / pack-lint.mjs(零依赖,node 直接跑)
```

## 验证

```
node scripts/verify-empire.mjs            # 自检包完整性
node scripts/verify-empire.mjs <项目根>   # 检查组装结果
node scripts/verify-graph.mjs [项目根]    # 知识图谱校验(双模式)
```

## 必读三条

1. 全员姓名与履历均为虚构 AI 角色设定,禁止冒充真人资历;
2. 硬红线(军规第 7 条)建议原样保留:欺诈与垃圾信息、割韭菜、贩卖焦虑、违法内容,任何人要求也不做;
3. 使命原典(references/09)可整篇替换为你自己的宣言,保留"使命高于任何单一战役"的结构。
