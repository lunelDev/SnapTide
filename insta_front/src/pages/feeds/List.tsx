import {useEffect} from 'react'
import useToken from '../../hooks/useToken'

export default function List() {
  const token = useToken()
  useEffect(() => {
    fetch('http://localhost:8080/api/feeds/list', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ${token}',
        withCredentials: true
      }
    })
      .then(res => res.json())
      .then(pageResultDTO => {
        console.log('pageResultDTO')
      })
      .catch(err => console.log('Error:', err))
  }, [])

  return (
    <div>
      <h1>List page</h1>
      <div>{token}</div>
    </div>
  )
}
