import crypto from "crypto";
import dayjs from "dayjs";

export const header = { alg: "HS256", typ: "JWT" };

/** Object 转 Base64url 字符串 */
const objectToBase64url = (obj: object): string =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");

/** Base64url 字符串 转 Object */
const base64urlToObject = (base64url: string): object =>
  JSON.parse(Buffer.from(base64url, "base64url").toString("utf8"));

/**
 * 计算 Token 签名
 * @param payload 身份认证信息 *（不要包含敏感信信息）*
 * @param secret 服务器密钥
 * @returns 签名
 */
export const sign = (payload: object, secret: string): string => {
  return crypto
    .createHmac("sha256", secret)
    .update(objectToBase64url(header))
    .update(objectToBase64url(payload))
    .digest("base64url");
};

/**
 * 生成 Token
 * @param payload 身份认证信息 *（不要包含敏感信信息）*
 * @param secret 服务器密钥
 * @returns 完整 Token 字符串 `header.payload.signature`
 */
export const generate = (payload: object, secret: string): string => {
  const headerString = objectToBase64url(header);
  const payloadString = objectToBase64url(payload);
  const signature = sign(payload, secret);
  return `${headerString}.${payloadString}.${signature}`;
};

/**
 * 验证 Token 签名
 * @param token 完整 Token
 * @param secret 服务器密钥
 * @returns 验证通过返回 `true`，否则抛出异常
 */
export const verify = (token: string, secret: string): true => {
  const [headerString, payloadString, signature] = token.split(".");

  if (!(headerString && payloadString && signature)) {
    throw createError({ statusCode: 401, message: "身份信息错误" });
  }

  const payload: any = base64urlToObject(payloadString);

  if (signature !== sign(payload, secret)) {
    throw createError({ statusCode: 401, message: "身份信息无效" });
  }

  if (payload.exp && payload.exp < dayjs().unix()) {
    throw createError({ statusCode: 401, message: "身份信息已失效" });
  }

  return true;
};
