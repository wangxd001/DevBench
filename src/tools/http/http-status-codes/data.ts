export interface HttpStatusEntry {
  code: number;
  name: string;
  description: { zh: string; en: string };
  category: string;
}

export const STATUS_CODES: readonly HttpStatusEntry[] = [
  { code: 100, name: "Continue", description: { zh: "继续", en: "Request received, client may continue" }, category: "1xx" },
  { code: 101, name: "Switching Protocols", description: { zh: "切换协议", en: "Server is switching protocols" }, category: "1xx" },
  { code: 102, name: "Processing", description: { zh: "处理中", en: "WebDAV: request in progress" }, category: "1xx" },
  { code: 200, name: "OK", description: { zh: "成功", en: "Standard success response" }, category: "2xx" },
  { code: 201, name: "Created", description: { zh: "已创建", en: "Resource created successfully" }, category: "2xx" },
  { code: 202, name: "Accepted", description: { zh: "已接受", en: "Request accepted, processing not complete" }, category: "2xx" },
  { code: 204, name: "No Content", description: { zh: "无内容", en: "No content to return" }, category: "2xx" },
  { code: 206, name: "Partial Content", description: { zh: "部分内容", en: "Partial content delivered (range request)" }, category: "2xx" },
  { code: 301, name: "Moved Permanently", description: { zh: "永久重定向", en: "Resource permanently moved to new URL" }, category: "3xx" },
  { code: 302, name: "Found", description: { zh: "临时重定向", en: "Resource temporarily moved" }, category: "3xx" },
  { code: 304, name: "Not Modified", description: { zh: "未修改", en: "Resource not modified since last request" }, category: "3xx" },
  { code: 307, name: "Temporary Redirect", description: { zh: "临时重定向", en: "Temporary redirect, preserve method" }, category: "3xx" },
  { code: 308, name: "Permanent Redirect", description: { zh: "永久重定向", en: "Permanent redirect, preserve method" }, category: "3xx" },
  { code: 400, name: "Bad Request", description: { zh: "错误请求", en: "Server cannot process the request" }, category: "4xx" },
  { code: 401, name: "Unauthorized", description: { zh: "未授权", en: "Authentication required" }, category: "4xx" },
  { code: 403, name: "Forbidden", description: { zh: "禁止访问", en: "Client does not have permission" }, category: "4xx" },
  { code: 404, name: "Not Found", description: { zh: "未找到", en: "Resource not found" }, category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: { zh: "方法不允许", en: "HTTP method not allowed for this resource" }, category: "4xx" },
  { code: 408, name: "Request Timeout", description: { zh: "请求超时", en: "Client did not make request in time" }, category: "4xx" },
  { code: 409, name: "Conflict", description: { zh: "冲突", en: "Request conflicts with current resource state" }, category: "4xx" },
  { code: 410, name: "Gone", description: { zh: "已移除", en: "Resource permanently removed" }, category: "4xx" },
  { code: 413, name: "Payload Too Large", description: { zh: "请求体过大", en: "Request body exceeds server limit" }, category: "4xx" },
  { code: 415, name: "Unsupported Media Type", description: { zh: "不支持的媒体类型", en: "Content type not supported" }, category: "4xx" },
  { code: 418, name: "I'm a Teapot", description: { zh: "我是茶壶", en: "RFC 2324: server is a teapot" }, category: "4xx" },
  { code: 429, name: "Too Many Requests", description: { zh: "请求过多", en: "Rate limit exceeded" }, category: "4xx" },
  { code: 451, name: "Unavailable For Legal Reasons", description: { zh: "法律原因不可用", en: "Content blocked by legal order" }, category: "4xx" },
  { code: 500, name: "Internal Server Error", description: { zh: "服务器内部错误", en: "Unexpected server error" }, category: "5xx" },
  { code: 501, name: "Not Implemented", description: { zh: "未实现", en: "Server does not implement the requested method" }, category: "5xx" },
  { code: 502, name: "Bad Gateway", description: { zh: "错误网关", en: "Invalid response from upstream server" }, category: "5xx" },
  { code: 503, name: "Service Unavailable", description: { zh: "服务不可用", en: "Server temporarily overloaded or down" }, category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: { zh: "网关超时", en: "Upstream server did not respond in time" }, category: "5xx" },
  { code: 505, name: "HTTP Version Not Supported", description: { zh: "不支持的 HTTP 版本", en: "HTTP version not supported by server" }, category: "5xx" },
];
