import { useQuery } from '@tanstack/react-query'

export function use2FACode(steamId: string, enabled = true) {
  return useQuery({
    queryKey: ['code', steamId],
    queryFn: () => window.api.getCode(steamId),
    enabled,
    // Refetch every 30s to match Steam Guard rotation
    refetchInterval: 30_000,
    // Keep showing old code while fetching new one
    placeholderData: (prev) => prev
  })
}
