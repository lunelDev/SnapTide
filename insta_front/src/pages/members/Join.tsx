import type {ChangeEvent, FormEvent} from 'react'
import {useCallback, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

type JoinFormType = Record<'name' | 'nickname' | 'email' | 'pw' | 'pw2', string>
const initialState: JoinFormType = {name: '', nickname: '', email: '', pw: '', pw2: ''}

export default function Join() {
  const navigate = useNavigate()
  const [form, setForm] = useState<JoinFormType>(initialState)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const changed = useCallback(
    (key: keyof JoinFormType) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({...prev, [key]: e.target.value}))
    },
    []
  )

  const validate = (): string | null => {
    const {name, nickname, email, pw, pw2} = form
    if (!name.trim()) return '이름을 입력하세요.'
    if (!nickname.trim()) return '닉네임을 입력하세요.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '올바른 이메일 형식이 아닙니다.'
    if (pw.length < 4) return '비밀번호는 4자 이상이어야 합니다.'
    if (pw !== pw2) return '비밀번호가 일치하지 않습니다.'
    return null
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const message = validate()
    if (message) {
      setError(message)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:8080/api/members/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({
          email: form.email,
          pw: form.pw,
          name: form.name,
          nickname: form.nickname,
          roleSet: ['USER']
        })
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      alert('회원가입이 완료되었습니다. 로그인해 주세요.')
      navigate('/login')
    } catch (err) {
      setError('회원가입에 실패했습니다. 서버 상태를 확인해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="st-card px-8 py-10">
          <div className="mb-6 text-center">
            <h1 className="st-brand text-4xl">SnapTide</h1>
            <p className="mt-2 text-sm text-ink-soft">
              친구들의 순간을 보려면 가입하세요.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              className="st-input"
              placeholder="이름"
              value={form.name}
              onChange={changed('name')}
            />
            <input
              className="st-input"
              placeholder="닉네임"
              value={form.nickname}
              onChange={changed('nickname')}
            />
            <input
              type="email"
              className="st-input"
              placeholder="이메일"
              value={form.email}
              onChange={changed('email')}
            />
            <input
              type="password"
              className="st-input"
              placeholder="비밀번호"
              value={form.pw}
              onChange={changed('pw')}
            />
            <input
              type="password"
              className="st-input"
              placeholder="비밀번호 확인"
              value={form.pw2}
              onChange={changed('pw2')}
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="st-btn st-btn--primary w-full"
              disabled={submitting}>
              {submitting ? '가입 중…' : '가입하기'}
            </button>
          </form>
        </div>

        <div className="st-card mt-4 px-8 py-5 text-center text-sm text-ink">
          이미 계정이 있으신가요?{' '}
          <Link className="font-semibold text-brand hover:underline" to="/login">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
