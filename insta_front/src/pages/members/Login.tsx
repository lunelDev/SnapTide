import type {ChangeEvent, FormEvent} from 'react'
import {useState, useCallback, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts'
import * as U from '../../utils'

// react의 Record 타입은 key, value형태로 자료를 받을 수 있다.
type LoginFormType = Record<'email' | 'pw', string>
const initialFormState = {email: '', pw: ''}

export default function Login() {
  const [{email, pw}, setForm] = useState<LoginFormType>(initialFormState)
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {login} = useAuth()
  const loginAccount = useCallback(() => {
    login(email, pw, () => {
      navigate('/')
    })
  }, [email, pw, navigate, login])

  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (emailRef.current?.value === '') {
      alert('Please Check Email')
      if (emailRef.current !== null) emailRef.current.focus()
      return
    }
    if (pwRef.current?.value === '') {
      alert('Please Check Password')
      if (pwRef.current !== null) {
        pwRef.current.focus()
      }
      return
    }
    getSession(email, pw)
  }
  const getSession = async (email: string, pw: string) => {
    try {
      const res = await fetch(
        'http://localhost:8080/api/auth/login?email=' + email + '&pw=' + pw,
        {method: 'POST'}
      )
      const token = await res.text()
      if (token.startsWith('{"code"')) {
        navigate('/login')
      } else {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('email', email)
        navigate('/feeds/list')
      }
    } catch (err) {
      console.log('Error:', err)
    }
  }
  useEffect(() => {
    U.readObjectP<LoginFormType>('user')
      .then(user => {
        if (user) setForm(user)
      })
      .catch(() => {})
    emailRef.current?.focus()
  }, [])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="st-card px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="st-brand text-4xl">SnapTide</h1>
            <p className="mt-2 text-sm text-ink-soft">사진으로 소통하는 공간</p>
          </div>
          <form method="post" onSubmit={onSubmit} className="space-y-3">
            <input
              type="text"
              name="email"
              ref={emailRef}
              className="st-input"
              placeholder="이메일"
              onChange={changed('email')}
            />
            <input
              type="password"
              name="pw"
              ref={pwRef}
              className="st-input"
              placeholder="비밀번호"
              value={pw}
              onChange={changed('pw')}
            />
            <button
              type="submit"
              className="st-btn st-btn--primary w-full"
              onClick={loginAccount}>
              로그인
            </button>
          </form>
        </div>
        <div className="st-card mt-4 px-8 py-5 text-center text-sm text-ink">
          계정이 없으신가요?{' '}
          <Link className="font-semibold text-brand hover:underline" to="/join">
            가입하기
          </Link>
        </div>
      </div>
    </div>
  )
}
