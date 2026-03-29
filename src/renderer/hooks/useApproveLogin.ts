import { useMutation } from '@tanstack/react-query'

export function useApproveLogin() {
  return useMutation({
    mutationFn: ({ steamId, challengeUrl }: { steamId: string; challengeUrl: string }) =>
      window.api.approveLogin(steamId, challengeUrl)
  })
}
