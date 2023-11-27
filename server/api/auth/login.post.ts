import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  // 模拟查询数据库验证用户名和密码，验证通过返回用户信息
  const user = queryDB(username, password);

  // 根据用户信息生成 JSON Web Token
  const { secret } = useRuntimeConfig(event);

  // Token 有效期设置为 1 小时
  const oneHour = 60 * 60;
  const exp = dayjs().unix() + oneHour;
  const token = generate({ ...user, exp }, secret);

  // 将 Token 写入 Cookie，并设置 Cookie 的有效期
  setCookie(event, "Authorization", token, { maxAge: oneHour });

  return user;
});

const queryDB = (username: string, password: string) => {
  if (!(username && password)) {
    throw createError({
      statusCode: 400,
      message: "用户名或密码不能为空",
    });
  }

  if (!(username === "test" && password === "test")) {
    throw createError({
      statusCode: 401,
      message: "用户名或密码错误",
    });
  }

  return {
    id: 1,
    username: "test",
    admin: true,
  };
};
