﻿import { baseResponse, listDataType, paramsType, useAxios } from ".";

export interface loginType {
  account: string;
  password: string;
  captcha: string;
  captcha_id: string;
}

export function Login(req: loginType): Promise<baseResponse<string>> {
  return useAxios.post("/api/user/login", req);
}

export interface QQLoginUrlType {
  url: string;
}

export function QQLoginUrl(): Promise<baseResponse<QQLoginUrlType>> {
  return useAxios.get("/api/user/qq/login-url");
}

export function QQLogin(code: string): Promise<baseResponse<string>> {
  return useAxios.get(`/api/user/qq/callback?code=${code}`);
}

export function Logout(): Promise<baseResponse<string>> {
  return useAxios.post("/api/user/logout");
}

export interface userInfoType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  nick_name: string;
  account: string;
  email: string;
  address: string;
  token: string;
  role: string;
}

export function userInfo(header?: {
  headers: { Authorization: string };
}): Promise<baseResponse<userInfoType>> {
  return useAxios.get("/api/user", header);
}

export function userList(
  params: paramsType
): Promise<baseResponse<listDataType<userInfoType>>> {
  return useAxios.get("/api/user/list", { params: { ...params } });
}

export interface userCreateType {
  nick_name: string;
  password: string;
  role: string;
}

export function userCreate(
  data: userCreateType
): Promise<baseResponse<string>> {
  return useAxios.post("/api/user", data);
}

export function userDelete(id: number): Promise<baseResponse<string>> {
  return useAxios.delete(`/api/user/${id}`);
}
