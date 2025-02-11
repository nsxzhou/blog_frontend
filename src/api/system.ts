import type { baseResponse } from ".";
import { useAxios } from ".";

export interface captchaType {
  captcha_id: string;
  pic_path: string;
}

export function GenCaptcha(): Promise<baseResponse<captchaType>> {
  return useAxios.get("/api/system/captcha");
}

export interface refreshTokenType {
  token: string;
  user_id: string;
}

export function refreshToken(
  req: refreshTokenType
): Promise<baseResponse<string>> {
  return useAxios.post("/api/system/refreshToken", req);
}
