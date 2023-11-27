export default defineEventHandler(async (event) => {
  const token = getCookie(event, "Authorization");
  if (verifyRoute(event.path, event.method)) {
    if (!token) {
      throw createError({ statusCode: 401, message: "请登录后访问" });
    }
    const { secret } = useRuntimeConfig(event);
    verify(token, secret);
  }
});

/**
 * 需要鉴权的 API 路由
 */
const routes = [{ path: "/api/user", method: "POST" }];

/**
 * 验证路由是否需要鉴权
 * @param path 请求地址
 * @param method 请求方法
 * @returns 是否需要鉴权
 */
const verifyRoute = (path: string, method: string) =>
  routes.some((route) => route.path === path && route.method === method);
