import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useConfirmations(steamId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['confirmations', steamId],
    queryFn: () => window.api.getConfirmations(steamId),
    enabled,
    staleTime: 10_000
  })
}

export function useApproveConfirmation(steamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ confId, nonce }: { confId: string; nonce: string }) =>
      window.api.approveConfirmation(steamId, confId, nonce),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmations', steamId] })
    }
  })
}

export function useDenyConfirmation(steamId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ confId, nonce }: { confId: string; nonce: string }) =>
      window.api.denyConfirmation(steamId, confId, nonce),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmations', steamId] })
    }
  })
}
