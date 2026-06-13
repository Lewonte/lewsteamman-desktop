import { useState } from 'react'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  steamId: string
  displayName: string | null
  uid: string | null
  gameUsername: string | null
  rank: string | null
  level: string | null
  characterName: string | null
  nameplateUrl: string | null
  note: string | null
  onSaved: () => void
  onClose: () => void
}

export function EditAccountDialog({
  steamId,
  displayName,
  uid,
  gameUsername,
  rank,
  level,
  characterName,
  nameplateUrl,
  note,
  onSaved,
  onClose
}: Props) {
  const [nextDisplayName, setNextDisplayName] = useState(displayName || '')
  const [nextUid, setNextUid] = useState(uid || '')
  const [nextGameUsername, setNextGameUsername] = useState(gameUsername || '')
  const [nextRank, setNextRank] = useState(rank || '')
  const [nextLevel, setNextLevel] = useState(level || '')
  const [nextCharacterName, setNextCharacterName] = useState(characterName || '')
  const [nextNameplateUrl, setNextNameplateUrl] = useState(nameplateUrl || '')
  const [nextNote, setNextNote] = useState(note || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await window.api.updateAccount(steamId, {
        display_name: nextDisplayName || undefined,
        uid: nextUid || undefined,
        game_username: nextGameUsername || undefined,
        rank: nextRank || undefined,
        level: nextLevel || undefined,
        character_name: nextCharacterName || undefined,
        nameplate_url: nextNameplateUrl || undefined,
        note: nextNote || undefined
      })
      toast.success('Account updated')
      onSaved()
    } catch (err) {
      toast.error(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-80 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Edit Account</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Display name" value={nextDisplayName} onChange={setNextDisplayName} />
          <Field label="Marvel username" value={nextGameUsername} onChange={setNextGameUsername} />
          <Field label="Marvel UID" value={nextUid} onChange={setNextUid} />
          <Field label="Rank" value={nextRank} onChange={setNextRank} />
          <Field label="Level" value={nextLevel} onChange={setNextLevel} />
          <Field label="Character" value={nextCharacterName} onChange={setNextCharacterName} />
          <Field label="Nameplate image URL" value={nextNameplateUrl} onChange={setNextNameplateUrl} />
          <TextArea label="Note" value={nextNote} onChange={setNextNote} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}
