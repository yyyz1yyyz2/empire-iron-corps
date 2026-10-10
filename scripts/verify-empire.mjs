import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 双模式验证:
//   node verify-empire.mjs            → 自检本 skill 的 references/(包完整性)
//   node verify-empire.mjs <项目根>   → 检查 <项目根>/docs/empire/(组装结果)
const arg = process.argv[2];
const docsDir = arg
  ? path.join(path.resolve(arg), 'docs', 'empire')
  : path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'references');
const errors = [];
const expectedDocs = ['00-组织总纲.md','01-铁军条令.md','02-总裁-杨红飞.md','03-参谋长-楚衡.md','04-情报参谋-白枭.md','05-产品官-沈砚.md','06-工程官-霍岩.md','07-增长官-程野.md','08-风控参谋-纪岚.md','09-原典-大同盛世论.md','10-远征军-侦察兵条令.md','11-内容铁军-条令.md','12-军团长-林晚照.md','13-军团长-陆千帆.md','14-军团长-顾北声.md','15-评审总监-秦镜.md','16-对标评审席-魏征言.md','17-红队评审席-荆破军.md','18-受众评审席-麦穗.md','19-商机参谋-贾真.md','20-展望参谋-任重.md','21-外部侦察与自我扩充条令.md'];
for (const f of expectedDocs) {
  if (!fs.existsSync(path.join(docsDir, f))) errors.push('缺文档: ' + f);
}
// 落地模板五件(分发版配套)
const tplDir = path.join(docsDir, 'templates');
const expectedTemplates = ['作战日志模板.md','侦察兵台账模板.md','班次交接单模板.md','基准清单模板.md','军械库登记模板.md'];
for (const f of expectedTemplates) {
  if (!fs.existsSync(path.join(tplDir, f))) errors.push('缺模板: templates/' + f);
}
if (errors.length) { console.log('FAIL ' + errors.length + ' 项:\n' + errors.join('\n')); process.exit(1); }
// 总纲交叉引用
const zl = fs.readFileSync(path.join(docsDir, '00-组织总纲.md'), 'utf8');
for (const m of zl.matchAll(/(?:0[1-9]|1[0-9]|2[01])-[^ \s|)】」*()#\[\]]+\.md/g)) {
  if (!fs.existsSync(path.join(docsDir, m[0]))) errors.push('总纲引用不存在: ' + m[0]);
}
// 成员档案:姓名在档 + 硬边界章节 + 恋爱拒收条款
for (const f of expectedDocs.filter(f => /^(0[2-8]|1[2-9]|20)/.test(f))) {
  const t = fs.readFileSync(path.join(docsDir, f), 'utf8');
  if (!t.includes('拒收') || !t.includes('第 5 条')) errors.push(f + ': 缺恋爱硬边界条款');
  if (!t.includes('硬边界')) errors.push(f + ': 缺硬边界章节');
}
const roster = [['杨红飞','02-总裁-杨红飞.md'],['楚衡','03-参谋长-楚衡.md'],['白枭','04-情报参谋-白枭.md'],['沈砚','05-产品官-沈砚.md'],['霍岩','06-工程官-霍岩.md'],['程野','07-增长官-程野.md'],['纪岚','08-风控参谋-纪岚.md'],['林晚照','12-军团长-林晚照.md'],['陆千帆','13-军团长-陆千帆.md'],['顾北声','14-军团长-顾北声.md'],['秦镜','15-评审总监-秦镜.md'],['魏征言','16-对标评审席-魏征言.md'],['荆破军','17-红队评审席-荆破军.md'],['麦穗','18-受众评审席-麦穗.md'],['贾真','19-商机参谋-贾真.md'],['任重','20-展望参谋-任重.md']];
for (const [n, f] of roster) {
  const t = fs.readFileSync(path.join(docsDir, f), 'utf8');
  if (!t.includes(n)) errors.push(f + ': 人设缺姓名 ' + n);
}
console.log(errors.length ? ('FAIL ' + errors.length + ' 项:\n' + errors.join('\n')) : 'PASS [' + docsDir + ']: 文档 ' + expectedDocs.length + '/' + expectedDocs.length + ' + 模板 ' + expectedTemplates.length + '/5, 交叉引用/硬边界/名册 一致性全过');
