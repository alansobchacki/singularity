import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../config/axios";
import axios from "axios";
import CreateUserRequest from "../../interfaces/user/CreateUserRequest";
import User from "../../interfaces/user/CreateUserResponse";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createUser = async (data: CreateUserRequest): Promise<User> => {
  try {
    const response = await api.post(`/api/v1/users`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response)
      throw new Error(err.response.data?.message);
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateUser = () => {
  const router = useRouter();

  const mutation = useMutation<User, Error, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: () => {
      try {
        router.push("/login");
      } catch (err) {
        throw new Error(unexpectedErrorText);
      }
    },
  });
  return mutation;
};
