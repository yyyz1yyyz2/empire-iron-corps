// verify-graph.mjs — 分发版知识图谱机械校验
// 双模式:
//   node verify-graph.mjs                 → 自检本 skill 的 references/knowledge-graph/
//   node verify-graph.mjs <项目根>        → 检查 <项目根>/docs/knowledge-graph/(组装结果)
// 检查项:文件存在 / 本体表完整(实体 7 类+关系 10 种)/ 层骨架齐 / 图谱内引用一致
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = process.argv[2];
const kgDir = arg
  ? path.join(path.resolve(arg), 'docs', 'knowledge-graph')
  : path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'references', 'knowledge-graph');
const errors = [];

// 1) 文件存在
const mustFiles = ['README.md', '00-本体与分层模板.md'];
for (const f of mustFiles) {
  if (!fs.existsSync(path.join(kgDir, f))) errors.push('缺文件: ' + f);
}
if (errors.length) { console.log('FAIL:\n' + errors.join('\n')); process.exit(1); }

const tpl = fs.readFileSync(path.join(kgDir, '00-本体与分层模板.md'), 'utf8');

// 2) 本体表完整:7 类实体 + 10 种关系
const entRows = (tpl.match(/^\| (?:人|组织单位|使命|规则|产品|战场|外部实体)[^|]*\|/gm) || []).length;
if (entRows < 7) errors.push('实体类型表不足 7 类(现 ' + entRows + ')');
const relNames = ['指挥', '直报', '隶属', '产出', '依赖', '约束', '评审', '敌友', '派生', '对位'];
const relMissing = relNames.filter(r => !new RegExp('^\\| ' + r + ' \\|', 'm').test(tpl));
if (relMissing.length) errors.push('关系类型缺: ' + relMissing.join('/'));

// 3) 层骨架齐(01-10 各层小节在模板第五节中)
for (let i = 1; i <= 10; i++) {
  const tag = ('0' + i).slice(-2);
  if (!tpl.includes('**' + tag + '-')) errors.push('层骨架缺第 ' + tag + ' 层');
}

// 4) 图谱内引用一致性:README/模板引用的同目录文件必须存在(通配除外)
const files = fs.readdirSync(kgDir).filter(f => f.endsWith('.md'));
let miss = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(kgDir, f), 'utf8');
  for (const m of t.matchAll(/\]\(([^)#\s]+\.md)\)/g)) {
    if (m[1].startsWith('http')) continue;
    if (!fs.existsSync(path.join(kgDir, m[1]))) { errors.push(f + ' 引用不存在: ' + m[1]); miss++; }
  }
}

// 5) 黄金纪律在场(手册必须载明两条硬纪律,防精简走样)
const rm = fs.readFileSync(path.join(kgDir, 'README.md'), 'utf8');
if (!/不是第二(事实源|信息源)/.test(rm)) errors.push('README 缺"索引非第二事实源"定位');
if (!/易变状态(永不|不得)入谱/.test(rm)) errors.push('README 缺"易变状态永不入谱"纪律');

console.log(errors.length
  ? 'FAIL ' + errors.length + ' 项:\n' + errors.join('\n')
  : 'PASS [' + kgDir + ']: 文件 ' + files.length + ' 个;实体 7 类/关系 10 种/层骨架 10 层/引用一致/硬纪律在位 全过');
process.exit(errors.length ? 1 : 0);
