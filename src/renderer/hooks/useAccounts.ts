import { useQuery } from '@tanstack/react-query'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => window.api.getAccounts(),
    staleTime: 60_000
  })
}
