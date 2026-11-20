import { STATUS_CODES, type HttpStatusEntry } from "./data";

/**
 * 搜索 HTTP 状态码。
 *
 * 语义（PRD §7.19：按状态码查询 + 按名称/关键词查询 + 按类别展示）：
 * - 空查询：返回全部。
 * - 类别式查询（如 "2"、"20"、"200"、"2xx"）：按类别前缀匹配，返回整个 2xx 分组。
 *   纯数字前缀按百位归类；带 "xx" 后缀（如 "2xx"）也按百位归类。
 * - 纯数字且能精确命中某个状态码（如 "404"）：精确匹配排最前，并保留同类别其他条目供参考。
 * - 非数字 / 名称 / 关键词：不区分大小写包含匹配（名称、中英文描述）。
 * - 纯数字但不属于任何已知类别（如 "999"、"20" 中非前缀情形）：返回空。
 */
export function searchStatusCodes(query: string): HttpStatusEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...STATUS_CODES];

  // 类别前缀匹配：纯数字前缀或 "Nxx" 形式，按百位归类。
  // 例："2" / "20" / "200" / "2xx" 都映射到类别 200。
  const categoryPrefix = parseCategoryPrefix(q);
  if (categoryPrefix !== null) {
    const inCategory = STATUS_CODES.filter(
      (entry) => Math.floor(entry.code / 100) * 100 === categoryPrefix
    );
    if (inCategory.length > 0) {
      // 精确命中某条时（如输入 "404"），把它排到最前，其余同类别条目随后。
      const exact = inCategory.find((entry) => String(entry.code) === q);
      if (exact) {
        return [exact, ...inCategory.filter((entry) => entry !== exact)];
      }
      return inCategory;
    }
  }

  // 名称 / 中英文描述包含匹配（大小写不敏感）。
  return STATUS_CODES.filter((entry) => {
    const nameMatch = entry.name.toLowerCase().includes(q);
    const zhMatch = entry.description.zh.includes(query.trim());
    const enMatch = entry.description.en.toLowerCase().includes(q);
    return nameMatch || zhMatch || enMatch;
  });
}

/**
 * 解析类别前缀。接受 "2"、"20"、"200"、"2xx" 等形式，返回对应百位类别（如 200）。
 * 无法识别为类别前缀时返回 null。
 */
function parseCategoryPrefix(q: string): number | null {
  // "Nxx" 形式，如 "2xx" / "4xx"
  const xxMatch = /^([1-5])xx$/.exec(q);
  if (xxMatch) {
    return Number(xxMatch[1]) * 100;
  }
  // 纯数字前缀：1~3 位，首位 1~5，按百位归类
  if (!/^[1-5][0-9]{0,2}$/.test(q)) {
    return null;
  }
  const firstDigit = Number(q[0]);
  // 仅当该百位类别在数据中存在时才认为是类别前缀，否则交给后续匹配返回空
  const category = firstDigit * 100;
  const exists = STATUS_CODES.some(
    (entry) => Math.floor(entry.code / 100) * 100 === category
  );
  return exists ? category : null;
}