import { baseResponse, useAxios, paramsType, listDataType } from ".";

export interface visitType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  public_ip: string;
  internal_ip: string;
  visitor_id: number;
  user_agent: string;
  distribution: string;
}

export function visitList(
  params: paramsType
): Promise<baseResponse<listDataType<visitType>>> {
  return useAxios.get("/api/visit/list", { params: { ...params } });
}

export function visitDelete(id: number): Promise<baseResponse<string>> {
  return useAxios.delete(`/api/visit/${id}`);
}
