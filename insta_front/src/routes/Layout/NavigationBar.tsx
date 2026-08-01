import {Link, useLocation, useNavigate} from 'react-router-dom'
import type {FC} from 'react'

const NavLink: FC<{to: string; icon: string; label: string; active?: boolean}> = ({
  to,
  icon,
  label,
  active
}) => (
  <Link
    to={to}
    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-black/[0.04] ${
      active ? 'text-ink' : 'text-ink-soft'
    }`}>
    <span className="material-icons text-[20px]">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </Link>
)

export const NavigationBar: FC = () => {
  const navigate = useNavigate()
  const {pathname} = useLocation()

  const logout = (e: React.MouseEvent) => {
    e.preventDefault()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')
    navigate('/login')
  }

  const isHome = pathname === '/' || pathname === '/feeds/list'

  return (
    <header className="sticky top-0 z-20 border-b border-ink-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/feeds/list" className="st-brand text-2xl">
          SnapTide
        </Link>
        <nav className="flex items-center gap-0.5">
          <NavLink to="/feeds/list" icon="home" label="홈" active={isHome} />
          <NavLink
            to="/feeds/register"
            icon="add_box"
            label="새 게시물"
            active={pathname === '/feeds/register'}
          />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-black/[0.04]">
            <span className="material-icons text-[20px]">logout</span>
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
