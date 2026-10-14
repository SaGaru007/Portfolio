import { useQuery } from "@tanstack/react-query";

export function usePortfolioSettings() {
  return useQuery<Record<string, string>>({
    queryKey: ["portfolio-settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Could not load portfolio settings.");
      return (await response.json()) as Record<string, string>;
    },
  });
}
