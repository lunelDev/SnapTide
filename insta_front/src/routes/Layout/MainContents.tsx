import type {FC, CSSProperties} from 'react'
import FeedsList from '../../pages/feeds/List'

export type MainContentsProps = {
  style?: CSSProperties
}

export const MainContents: FC<MainContentsProps> = ({style}) => {
  return (
    <div id="main_contents" style={style}>
      <span className="mc-title">insta</span>
      <span className="mc-title" style={{color: 'black'}}>
        Feeds
      </span>
      <FeedsList />
    </div>
  )
}
