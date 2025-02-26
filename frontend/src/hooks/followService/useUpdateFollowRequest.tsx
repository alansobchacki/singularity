import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const updateFollowRequest = async ({
  id,
  followStatus,
}: {
  id: string;
  followStatus: "ACCEPTED" | "REJECTED";
}): Promise<any> => {
  try {
    const response = await api.put(`/api/v1/follow/requests/${id}`, { followStatus });

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to update follow request. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useUpdateFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string; followStatus: "ACCEPTED" | "REJECTED" }, Error, any>({
    mutationFn: updateFollowRequest,
    onSuccess: (data, variables) => {
      try {
        const { status } = variables;

        alert(`Follow request ${status.toLowerCase()} successfully!`);

        queryClient.invalidateQueries({
          queryKey: ["follow-requests"]
        });
      } catch (err) {
        throw new Error(unexpectedErrorText);
      }
    },
  });
};
