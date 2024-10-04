import type {ChangeEvent} from 'react'
import {useState, useCallback, useEffect} from 'react'
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

  useEffect(() => {
    U.readObjectP<LoginFormType>('user')
      .then(user => {
        if (user) setForm(user)
      })
      .catch(e => {})
  }, [])
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 border border-gray-300 shadow-xl rounded-xl">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
        <div className="w-full px-6 py-8 text-black bg-white rounded shadow-md">
          <h1 className="mb-8 text-2xl text-center text-primary">Login</h1>
          <input
            type="text"
            name="email"
            className="w-full p-3 mb-4 input input-primary"
            placeholder="Email"
            value={email}
            onChange={changed('email')}
          />
          <input
            type="password"
            name="pw"
            className="w-full p-3 mb-4 input input-primary"
            placeholder="Password"
            value={pw}
            onChange={changed('pw')}
          />
          <button type="submit" className="w-full btn btn-primary" onClick={loginAccount}>
            Login
          </button>
        </div>
        <div className="mt-6 text-grey-dark">
          Create account?
          <Link className="btn btn-primary btn-link" to="/signup">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
