import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveLatestProof = () => {
  const queryClient = useQueryClient();

  const saveLatestProof = useMutation({
    mutationKey: ["saveLatestProof"],
    mutationFn: async (provingTimeMillis: number) => {
      localStorage.setItem("latestProof", provingTimeMillis.toString());
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["latestProof"],
      });
    },
  });

  const reset = useMutation({
    mutationKey: ["resetLatestProof"],
    mutationFn: async () => {
      localStorage.removeItem("latestProof");
      console.log("removed latest proof");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["latestProof"],
      });
    },
  });

  return { saveLatestProof, reset };
};
