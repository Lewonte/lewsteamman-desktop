import { useState } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  onAdded: () => void
  onClose: () => void
}

export function AddAccountDialog({ onAdded, onClose }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [accountId, setAccountId] = useState('')
  const [uid, setUid] = useState('')
  const [gameUsername, setGameUsername] = useState('')
  const [rank, setRank] = useState('')
  const [level, setLevel] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [nameplateUrl, setNameplateUrl] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await window.api.createAccount({
        username,
        password,
        account_id: accountId || undefined,
        display_name: displayName || undefined,
        uid: uid || undefined,
        game_username: gameUsername || undefined,
        rank: rank || undefined,
        level: level || undefined,
        character_name: characterName || undefined,
        nameplate_url: nameplateUrl || undefined,
        note: note || undefined
      })
      toast.success('Account added')
      onAdded()
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
          <h2 className="text-sm font-semibold text-white">Add Account</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-3">
          <Field
            label="Username / email"
            value={username}
            onChange={setUsername}
            autoFocus
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
          />
          <Field
            label="Display name"
            value={displayName}
            onChange={setDisplayName}
          />
          <Field
            label="Marvel username"
            value={gameUsername}
            onChange={setGameUsername}
          />
          <Field
            label="Marvel UID"
            value={uid}
            onChange={setUid}
          />
          <Field
            label="Rank"
            value={rank}
            onChange={setRank}
          />
          <Field
            label="Level"
            value={level}
            onChange={setLevel}
          />
          <Field
            label="Character"
            value={characterName}
            onChange={setCharacterName}
          />
          <Field
            label="Nameplate image URL"
            value={nameplateUrl}
            onChange={setNameplateUrl}
          />
          <Field
            label="Account id"
            value={accountId}
            onChange={setAccountId}
          />
          <TextArea
            label="Note"
            value={note}
            onChange={setNote}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!username || !password || saving}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {saving ? 'Adding...' : 'Add'}
        </button>
      </div>
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
        rows={3}
        className="w-full resize-none bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoFocus = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoFocus?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}
