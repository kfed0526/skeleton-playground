import {useEffect, useRef, useState} from 'react'
import GameLabels from './GameLabels'
import {games} from '../services/play'
import type {GameId} from '../services/play'
import {verifyParentPassword} from '../services/parentSettings'

type ParentAdminProps = {
  enabledGameIds: readonly GameId[]
  onSave: (gameIds: GameId[]) => void
}

export default function ParentAdmin({enabledGameIds, onSave}: ParentAdminProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [draftGameIds, setDraftGameIds] = useState<GameId[]>([])
  const triggerButton = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLElement>(null)
  const passwordInput = useRef<HTMLInputElement>(null)

  const close = () => {
    setIsOpen(false)
    setIsUnlocked(false)
    setPassword('')
    setError('')
  }
  const open = () => {
    setDraftGameIds([...enabledGameIds])
    setIsOpen(true)
    setIsUnlocked(false)
    setPassword('')
    setError('')
  }

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ) ?? [])]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable.at(-1)!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    passwordInput.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerButton.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && isUnlocked) {
      dialog.current?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.focus()
    }
  }, [isOpen, isUnlocked])

  const login = (event: React.FormEvent) => {
    event.preventDefault()
    if (!verifyParentPassword(password)) {
      setError('密碼不正確，請再試一次。')
      passwordInput.current?.focus()
      return
    }
    setIsUnlocked(true)
    setPassword('')
    setError('')
  }
  const toggleGame = (gameId: GameId) => {
    setDraftGameIds(current => current.includes(gameId)
      ? current.filter(id => id !== gameId)
      : [...current, gameId])
  }
  const save = (event: React.FormEvent) => {
    event.preventDefault()
    onSave(draftGameIds)
    close()
  }

  return <>
    <button ref={triggerButton} className="parent-admin-trigger" aria-label="家長管理" onClick={open}>
      <span aria-hidden="true">👤</span>
    </button>
    {isOpen && <div className="parent-admin-overlay" onMouseDown={event => {
      if (event.target === event.currentTarget) close()
    }}>
      <section ref={dialog} className="parent-admin-dialog" role="dialog" aria-modal="true" aria-labelledby="parent-admin-title">
        <button className="parent-admin-close" aria-label="關閉家長管理" onClick={close}>×</button>
        {!isUnlocked ? <form className="parent-login" onSubmit={login}>
          <span className="parent-admin-icon" aria-hidden="true">👤</span>
          <h2 id="parent-admin-title">家長管理</h2>
          <p>請輸入六位數密碼，進入遊戲庫設定。</p>
          <label htmlFor="parent-password">六位數密碼</label>
          <input
            ref={passwordInput}
            id="parent-password"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            pattern="[0-9]{6}"
            maxLength={6}
            value={password}
            onChange={event => setPassword(event.target.value.replace(/\D/g, '').slice(0, 6))}
            aria-describedby={error ? 'parent-password-error' : undefined}
            required
          />
          {error && <p id="parent-password-error" className="parent-admin-error" role="alert">{error}</p>}
          <button className="parent-admin-primary" type="submit">進入管理</button>
        </form> : <form className="parent-library" onSubmit={save}>
          <div className="parent-library-heading">
            <div>
              <p className="parent-admin-eyebrow">家長管理</p>
              <h2 id="parent-admin-title">選擇要顯示的遊戲</h2>
              <p>只有勾選的遊戲會出現在遊樂場首頁。</p>
            </div>
            <strong>{draftGameIds.length} / {games.length}</strong>
          </div>
          <div className="parent-game-list">
            {games.map(game => <label className="parent-game-option" key={game.id}>
              <input
                type="checkbox"
                checked={draftGameIds.includes(game.id)}
                onChange={() => toggleGame(game.id)}
              />
              <span className="parent-game-check" aria-hidden="true">✓</span>
              <span className="parent-game-emoji" aria-hidden="true">{game.emoji}</span>
              <span><strong>{game.title}</strong><GameLabels game={game}/><small>{game.description}</small></span>
            </label>)}
          </div>
          <div className="parent-admin-actions">
            <button type="button" className="parent-admin-secondary" onClick={close}>取消</button>
            <button type="submit" className="parent-admin-primary">儲存遊戲庫</button>
          </div>
        </form>}
      </section>
    </div>}
  </>
}
