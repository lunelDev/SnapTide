import {Routes, Route} from 'react-router-dom'
import Join from '../pages/members/Join'
import Login from '../pages/members/Login'
import Layout from './Layout'
import NoMatch from './NoMatch'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/feeds/list" element={<Layout />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
