import React from 'react'
import type {FC, CSSProperties} from 'react'
import FeedsList from '../../pages/feeds/List'
import {useLocation, useParams} from 'react-router-dom'
import Register from '../../pages/feeds/Register'
import Modify from '../../pages/feeds/Modify'
import Read from '../../pages/feeds/Read'

export type MainContentsProps = {
  style?: CSSProperties
}

export const MainContents: FC<MainContentsProps> = ({style}) => {
  const location = useLocation()
  const {pathname} = location
  const {fno} = useParams<{fno: string}>()

  // 경로를 단축하여 보여주기
  const shortPathname = pathname.replace('/feeds/', '').replace('/', '') || 'list'

  // 경로에 따른 컴포넌트 선택
  const renderContent = () => {
    if (pathname === '/' || pathname === '/feeds/list') {
      return <FeedsList />
    }
    if (pathname === '/feeds/register') {
      return <Register />
    }
    if (pathname === '/feeds/read') {
      return <Read />
    }
    if (pathname.startsWith('/feeds/modify')) {
      return <Modify fno={fno} />
    }
    return <h2>Page Not Found</h2> // 기본 경로 (404 대체)
  }

  return (
    <div className="p-0 container-fluid" style={{marginTop: '10px', textAlign: 'left'}}>
      <section id="about" style={{margin: '0 40px', height: '100vh'}}>
        <div className="resume-section-content">
          <h1 className="mt-4">
            <span style={{color: '#5a6363'}}>Snap Tide </span>
            <div
              style={{
                paddingLeft: '10px',
                display: 'inline-block',
                width: '250px'
              }}>
              {shortPathname}
            </div>
          </h1>
          <div className="resume-section">{renderContent()}</div>
        </div>
      </section>
    </div>
  )
}
