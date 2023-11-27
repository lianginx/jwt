# Nuxt 3 + JSON Web Token 鉴权

基于 Nuxt 3 + Vite 开发的 JSON Web Token 鉴权示例。

## 环境变量

```bash
cp .evn.example .env
```

修改 `.env` 文件中的 `NUXT_SECRET` 为你的密钥，用作计算 Token。

它的值不能是纯数字，否则会被识别为 `number` 类型，导致计算 Token 时抛出异常。

## 运行

```bash
pnpm install
pnpm dev
```

## 调试 API

启动 Nuxt 服务器并在浏览器中打开后，单击底部的 Nuxt 图标（或按 `Shift` + `Alt/Option` + `D`）打开开发工具。

然后在开发工具中找到 `Server Routes`，就可以看到所有的 API 接口。

**无需鉴权**

```
GET /api/helloworld
200 Hello World!
```

**需要鉴权**

```
POST /api/user
401 Error "请登录后访问"
```

### 模拟登录

```
POST /api/auth/login { username: "test", password: "test" }
// 返回登录用户的身份信息，并将 Token 保存在 Cookie 中
// 之后每次请求会自动附带 Cookie 中的 Token
// 现在重新去调用需要鉴权的接口，已经可以正常访问了
```
