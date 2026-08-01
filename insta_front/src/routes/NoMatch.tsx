import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

export default function NoMatch() {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <h1 className="st-brand text-5xl">404</h1>
      <p className="text-ink-soft">페이지를 찾을 수 없습니다.</p>
      <button className="st-btn st-btn--primary" onClick={goBack}>
        뒤로 가기
      </button>
    </div>
  )
}
