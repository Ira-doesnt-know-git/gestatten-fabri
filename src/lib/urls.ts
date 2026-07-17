const baseUrl = import.meta.env.BASE_URL;
const basePath = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");

export function withBase(path: string) {
  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}

export function withoutBase(path: string) {
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length);
  return path;
}
