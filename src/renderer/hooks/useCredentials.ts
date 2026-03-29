import { useQuery } from '@tanstack/react-query'

export function useCredentials(steamId: string, enabled = false) {
  return useQuery({
    queryKey: ['credentials', steamId],
    queryFn: () => window.api.getCredentials(steamId),
    enabled,
    staleTime: 0 // Always fetch fresh credentials
  })
}
