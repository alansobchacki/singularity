import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { api } from "../../config/axios";
import { authStateAtom } from "../../state/authState";
import { toast } from "react-toastify";
import axios from "axios";
import LoginRequest from "../../interfaces/authentication/LoginRequest";
import AuthToken from "../../interfaces/authentication/AuthToken";
import DecodedToken from "../../interfaces/authentication/DecodedToken";

const unexpectedErrorText = "Wrong email or password. Please try again.";

const postLogin = async (data: LoginRequest): Promise<AuthToken> => {
  try {
    const response = await api.post<AuthToken>(`/api/v1/auth/login`, data);

    if (response.status === 201) return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Wrong email or password. Please try again.");
      }

      throw new Error(error.response?.data?.message || unexpectedErrorText);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useLogin = () => {
  const [, setAuthState] = useAtom(authStateAtom);
  const router = useRouter();

  return useMutation<AuthToken, Error, LoginRequest>({
    mutationFn: postLogin,
    onSuccess: (data) => {
      const decodedToken: DecodedToken = jwtDecode(data.access_token);
      const userId = decodedToken.sub;
      const userType = decodedToken.userType;

      localStorage.setItem("accessToken", data.access_token);
      setAuthState({
        id: userId,
        credentials: userType,
        isAuthenticated: true,
      });
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login");
    },
  });
};
