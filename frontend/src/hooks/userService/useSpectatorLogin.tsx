import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { api } from "../../config/axios";
import { authStateAtom } from "../../state/authState";
import axios from "axios";
import AuthUser from "../../interfaces/authentication/AuthUser";

const unexpectedErrorText = "Unexpected error. Please try again.";

const postSpectatorLogin = async (): Promise<AuthUser> => {
  try {
    const response = await api.post<AuthUser>(`/api/v1/auth/spectator-login`);

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

  const mutation = useMutation<AuthUser, Error, void>({
    mutationFn: postSpectatorLogin,
    onSuccess: (user) => {
      setAuthState({
        id: user.id,
        credentials: user.userType,
        isAuthenticated: true,
      });
      router.replace("/dashboard");
    },
  });

  return mutation;
};
