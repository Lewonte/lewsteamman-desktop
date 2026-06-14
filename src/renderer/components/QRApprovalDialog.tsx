import { useState } from 'react'
import jsQR from 'jsqr'
import { X, Loader2, CheckCircle, XCircle, Image } from 'lucide-react'
import { useApproveLogin } from '../hooks/useApproveLogin'
import { toast } from 'sonner'

interface Props {
  steamId: string
  onClose: () => void
}

export function QRApprovalDialog({ steamId, onClose }: Props) {
  const [challengeUrl, setChallengeUrl] = useState('')
  const [decoding, setDecoding] = useState(false)
  const mutation = useApproveLogin()

  const approveChallenge = (url: string) => {
    if (!url.trim()) return
    console.info('[QRApprovalDialog] approving challenge', {
      steamId,
      challengeUrlPreview: previewChallengeUrl(url),
      challengeUrlLength: url.trim().length
    })

    mutation.mutate(
      { steamId, challengeUrl: url.trim() },
      {
        onSuccess: (result) => {
          console.info('[QRApprovalDialog] approve result', result)
          if (result.success) {
            toast.success('Login approved')
            onClose()
          } else {
            toast.error('Approval failed')
          }
        },
        onError: (err) => {
          console.error('[QRApprovalDialog] approve error', err)
          toast.error(`Error: ${err.message}`)
        }
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    approveChallenge(challengeUrl)
  }

  const handlePasteImage = async () => {
    setDecoding(true)
    try {
      const dataUrl = window.api.readClipboardImage()
      console.info('[QRApprovalDialog] clipboard image read', {
        found: Boolean(dataUrl),
        dataUrlLength: dataUrl?.length ?? 0
      })
      if (!dataUrl) {
        toast.error('No image found on clipboard')
        return
      }

      const decodedUrl = await decodeQrDataUrl(dataUrl)
      console.info('[QRApprovalDialog] decoded QR', {
        decodedUrlPreview: decodedUrl ? previewChallengeUrl(decodedUrl) : null,
        decodedUrlLength: decodedUrl?.length ?? 0
      })
      if (!decodedUrl) {
        toast.error('No QR code found in clipboard image')
        return
      }
      if (!decodedUrl.includes('s.team/q/')) {
        toast.error('QR code is not a Steam login challenge')
        return
      }

      setChallengeUrl(decodedUrl)
      approveChallenge(decodedUrl)
    } catch (err) {
      console.error('[QRApprovalDialog] QR decode error', err)
      toast.error(`QR decode failed: ${String(err)}`)
    } finally {
      setDecoding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-80 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Approve QR Login</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Challenge URL</label>
            <input
              type="text"
              value={challengeUrl}
              onChange={(e) => setChallengeUrl(e.target.value)}
              placeholder="https://s.team/q/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={handlePasteImage}
            disabled={decoding || mutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
          >
            {decoding ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
            {decoding ? 'Reading QR...' : 'Paste QR Image'}
          </button>

          <button
            type="submit"
            disabled={!challengeUrl.trim() || mutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm font-medium transition-colors"
          >
            {mutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mutation.isSuccess ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : mutation.isError ? (
              <XCircle size={16} className="text-red-400" />
            ) : null}
            {mutation.isPending ? 'Approving...' : 'Approve Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

function decodeQrDataUrl(dataUrl: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(null)
        return
      }

      ctx.drawImage(image, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      resolve(code?.data || null)
    }
    image.onerror = () => reject(new Error('Could not load clipboard image'))
    image.src = dataUrl
  })
}

function previewChallengeUrl(challengeUrl: string): string {
  const trimmed = challengeUrl.trim()
  if (trimmed.length <= 60) return trimmed
  return `${trimmed.slice(0, 40)}...${trimmed.slice(-12)}`
}
