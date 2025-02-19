import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../config/axios";
import axios from "axios";
import LoginRequest from "../../interfaces/authentication/LoginRequest";
import AuthToken from "../../interfaces/authentication/AuthToken";

const unexpectedErrorText = "Unexpected error. Please try again.";

const postLogin = async (data: LoginRequest): Promise<AuthToken> => {
  try {
    const response = await api.post<AuthToken>(`/api/v1/auth/login`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Wrong email or password. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation<AuthToken, Error, LoginRequest>({
    mutationFn: postLogin,
    onSuccess: (response) => {
      try {
        localStorage.setItem("token", response.access_token);
        router.push("/main");
      } catch (err) {
        throw new Error(unexpectedErrorText);
      }
    },
  });
  return mutation;
};
