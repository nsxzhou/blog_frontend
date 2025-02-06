import { baseResponse, useAxios, paramsType, listDataType } from ".";

export interface logType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  level: string;
  caller: string;
  message: string;
  error_msg: string;
}

export function logList(
  params: paramsType
): Promise<baseResponse<listDataType<logType>>> {
  return useAxios.get("/api/log/list", { params: { ...params } });
}

export function logDelete(id: number): Promise<baseResponse<string>> {
  return useAxios.delete(`/api/log/${id}`);
}
