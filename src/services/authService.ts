
import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  question_balance: number;
  birth_datetime: string | null;
  birth_place: string | null;
  timezone_name: string | null;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post<User>("/users", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post<LoginResponse>(
    "/users/login",
    data
  );

  localStorage.setItem(
    "melooha_token",
    response.data.access_token
  );

  localStorage.setItem(
    "melooha_user",
    JSON.stringify(response.data.user)
  );

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("melooha_token");
  localStorage.removeItem("melooha_user");
};
