import { useMutation } from "@tanstack/react-query";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import axios from "axios";
import CreateUserRequest from "../../interfaces/user/CreateUserRequest";
import { User } from "../../interfaces/user/User";

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
  const mutation = useMutation<User, Error, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success(`Account created successfully! 🎉`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });
  return mutation;
};
