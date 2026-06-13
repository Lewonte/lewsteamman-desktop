const RANK_LOGO_BASE =
  'https://rivalskins.com/wp-content/uploads/marvel-assets/assets/rank-logos'

const RANK_LOGOS: Record<string, string> = {
  bronze: `${RANK_LOGO_BASE}/1%20Bronze%20Rank.png`,
  silver: `${RANK_LOGO_BASE}/2%20Silver%20Rank.png`,
  gold: `${RANK_LOGO_BASE}/3%20Gold%20Rank.png`,
  platinum: `${RANK_LOGO_BASE}/4%20Platinum%20Rank.png`,
  diamond: `${RANK_LOGO_BASE}/5%20Diamond%20Rank.png`,
  grandmaster: `${RANK_LOGO_BASE}/6%20Grandmaster%20Rank.png`,
  celestial: `${RANK_LOGO_BASE}/7%20Celestial%20Rank.png`,
  eternity: `${RANK_LOGO_BASE}/8%20Eternity%20Rank.png`,
  'one above all': `${RANK_LOGO_BASE}/9%20One%20Above%20All%20Rank.png`
}

export function getRankLogoUrl(rank: string | null): string | null {
  if (!rank) return null
  const normalized = rank.toLowerCase().replace(/\s+/g, ' ').trim()
  const key = Object.keys(RANK_LOGOS).find((rankName) => normalized.includes(rankName))
  return key ? RANK_LOGOS[key] : null
}
