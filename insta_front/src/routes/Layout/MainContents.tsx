import type {FC} from 'react'
import {useLocation} from 'react-router-dom'
import FeedsList from '../../pages/feeds/List'
import Register from '../../pages/feeds/Register'
import Modify from '../../pages/feeds/Modify'
import Read from '../../pages/feeds/Read'

export const MainContents: FC = () => {
  const {pathname} = useLocation()

  if (pathname === '/' || pathname === '/feeds/list') return <FeedsList />
  if (pathname === '/feeds/register') return <Register />
  if (pathname === '/feeds/read') return <Read />
  if (pathname.startsWith('/feeds/modify')) return <Modify />

  return (
    <div className="py-20 text-center text-ink-soft">
      <p className="text-lg font-semibold">페이지를 찾을 수 없습니다</p>
    </div>
  )
}
