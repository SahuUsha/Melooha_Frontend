
import api from "./api";

export interface ChartFact {
  fact_key: string;
  fact_value: string;
}

export interface BirthChartResponse {
  user_id: number;
  birth_datetime: string;
  birth_place: string;
  timezone_name: string;
  chart_facts: ChartFact[];
}

export const getBirthChart = async (
  userId: number
): Promise<BirthChartResponse> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const calculateBirthChart = async (data: {
  user_id: number;
  birth_datetime: string;
  birth_place: string;
}) => {
  const response = await api.post("/chart/calculate", data);
  return response.data;
};
