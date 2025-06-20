import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { api } from "../../config/axios";
import { authStateAtom } from "../../state/authState";
import axios from "axios";
import AuthToken from "../../interfaces/authentication/AuthToken";
import DecodedToken from "../../interfaces/authentication/DecodedToken";

const unexpectedErrorText = "Unexpected error. Please try again.";

const postSpectatorLogin = async (): Promise<AuthToken> => {
  try {
    const response = await api.post<AuthToken>(`/api/v1/auth/spectator-login`);

    if (response.status === 201) return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Wrong spectator credentials. Try again later.");
      }

      throw new Error(error.response?.data?.message || unexpectedErrorText);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useSpectatorLogin = () => {
  const [, setAuthState] = useAtom(authStateAtom);
  const router = useRouter();

  const mutation = useMutation<AuthToken, Error, void>({
    mutationFn: postSpectatorLogin,
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
  });

  return mutation;
};
