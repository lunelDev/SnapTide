import '../../App.css'
import type {FC, CSSProperties} from 'react'

export type NavProps = {
  style?: CSSProperties
}

export const NavigationBar: FC<NavProps> = ({style}) => {
  return (
    <div id="navbar" style={style}>
      <div>
        <h3 className="nav-items">Logout</h3>
        <h3 className="nav-items">Home</h3>
        <h3 className="nav-items">Friends</h3>
        <h3 className="nav-items">My Page</h3>
      </div>
    </div>
  )
}
