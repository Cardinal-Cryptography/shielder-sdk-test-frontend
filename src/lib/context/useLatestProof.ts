import { useQuery } from "@tanstack/react-query";

export const useLatestProof = () => {
  const { data: config } = useQuery({
    queryKey: ["latestProof"],
    queryFn: async () => {
      console.log("Fetching latest proof");
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
