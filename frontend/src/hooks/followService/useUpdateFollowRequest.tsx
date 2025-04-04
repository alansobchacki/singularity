import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { Follow } from "../../interfaces/follow/Follow";

const unexpectedErrorText = "Unexpected error. Please try again.";

const updateFollowRequest = async ({
  id,
  followStatus,
}: {
  id: string;
  followStatus: "ACCEPTED" | "REJECTED";
}): Promise<Follow> => {
  try {
    const response = await api.put(`/api/v1/follow/requests/${id}`, {
      followStatus,
    });

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
      throw new Error("Unable to update follow request. Please try again.");
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useUpdateFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<Follow, Error, { id: string; followStatus: "ACCEPTED" | "REJECTED" }>({
    mutationFn: updateFollowRequest,
    onSuccess: (_data, variables) => {
      alert(`Follow request ${variables.followStatus.toLowerCase()} successfully!`);

      queryClient.invalidateQueries({
        queryKey: ["follow-requests"],
      });
    },
  });
};
