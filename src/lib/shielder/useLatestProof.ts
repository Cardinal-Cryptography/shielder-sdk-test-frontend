import { useQuery } from "@tanstack/react-query";

export const useLatestProof = () => {
  const { data: config } = useQuery({
    queryKey: ["latestProof"],
    queryFn: async () => {
      const latestProof = localStorage.getItem("latestProof");
      if (!latestProof) {
        return null;
      }
      return parseInt(latestProof);
    },
    initialData: null,
  });

  return config;
};
