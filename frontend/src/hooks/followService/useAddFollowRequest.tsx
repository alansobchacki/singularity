import { useMutation } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreateFollowRequest from "../../interfaces/follow/CreateFollowRequest";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createFollowRequest = async (data: CreateFollowRequest): Promise<any> => {
  try {
    const response = await api.post(`/api/v1/follow`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to send a follow request. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateFollowRequest = () => {
  const mutation = useMutation<CreateFollowRequest, Error, any>({
    mutationFn: createFollowRequest,
    onSuccess: () => {
      try {
        alert('Follow request sent!');
      } catch (err) {
        throw new Error(unexpectedErrorText);
      }
    },
  });
  return mutation;
};
