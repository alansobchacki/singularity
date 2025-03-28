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
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Wrong spectator credentials. Try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useSpectatorLogin = () => {
  const [authState, setAuthState] = useAtom(authStateAtom);
  const router = useRouter();

  const mutation = useMutation<AuthToken, Error, void>({
    mutationFn: postSpectatorLogin,
    onSuccess: (data) => {
      try {
        const decodedToken: DecodedToken = jwtDecode(data.access_token);
        const userId = decodedToken.sub;

        localStorage.setItem("accessToken", data.access_token);
        setAuthState({ id: userId, isAuthenticated: true });
        router.replace("/dashboard");
      } catch (err) {
        throw new Error(unexpectedErrorText);
      }
    },
  });
  return mutation;
};
