import { baseResponse, useAxios } from ".";

export interface dataType {
  total_articles: number;
  total_comments: number;
  total_views: number;
  total_users: number;
}

export function getStatistics(): Promise<baseResponse<dataType>> {
  return useAxios.get("/api/data/statistics");
}

export interface visitTrendType {
  dates: string[];
  values: number[];
}

export function getVisitTrend(): Promise<baseResponse<visitTrendType>> {
  return useAxios.get("/api/data/visit_trend");
}

export interface userDistributionType {
  name: string;
  value: number;
}

export function getUserDistribution(): Promise<
  baseResponse<userDistributionType[]>
> {
  return useAxios.get("/api/data/user_distribution");
}
