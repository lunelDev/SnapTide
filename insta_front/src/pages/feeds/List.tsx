import {useEffect, useState} from 'react'
import useToken from '../../hooks/useToken'

// Feed 데이터 구조 정의
interface Feed {
  fno: number
  title: string
  photosDTOList: {path: string}[]
  reviewsCnt: number
  likes: number
  regDate: string
}

// PageRequestDTO 구조 정의
interface PageRequestDTO {
  type: string
  keyword: string
}

// PageResultDTO 구조 정의
interface PageResultDTO {
  dtoList: Feed[]
  page: number
  start: number
  end: number
  pageList: number[]
  prev: boolean
  next: boolean
}

export default function List() {
  const token = useToken()
  const [pageRequestDTO, setPageRequestDTO] = useState<PageRequestDTO>({
    type: '',
    keyword: ''
  })
  const [pageResultDTO, setPageResultDTO] = useState<PageResultDTO | null>(null)

  const options = [
    {value: 't', label: '제목'},
    {value: 'c', label: '내용'},
    {value: 'w', label: '작성자'},
    {value: 'tc', label: '제목 + 내용'},
    {value: 'tcw', label: '제목 + 내용 + 작성자'}
  ]
  const placeholder = '검색 타입'
  const [selected, setSelected] = useState('')
  const onChangeSelect = (e: any) => {
    if (e) {
      setSelected(e.value)
      console.log(e.value)
    } else setSelected('')
  }
  const [choice, setChoice] = useState('t')
  const handleType = (e: any) => {
    setChoice(e.target.value)
    console.log(e.target.value) // option value
    console.log(e.target.selectedIndex) // option index
    console.log(e.target.options[e.target.selectedIndex].text) // text
  }
  useEffect(() => {
    if (token) {
      // console.log('token : ', token)

      fetch('http://localhost:8080/api/feeds/list', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.code === '403') {
            console.log('FAIL CHECK API TOKEN')
          } else {
            setPageRequestDTO(data.pageRequestDTO)
            setPageResultDTO(data.pageResultDTO)
          }
        })
        .catch(err => console.log('Error:', err))
    } else {
      console.log('노토큰')
    }
  }, [token])

  // const tbodyContents = dtoList.map(function (user, index) {
  //   return (
  //     <tr key={user.uuid}>
  //       <th>{index + 1}</th>
  //       <td className="flex items-center">
  //         <Avatar src={user.avatar} size="1.5rem" />
  //         <p className="ml-2">{user.name}</p>
  //       </td>
  //       <td>{user.jobTitle}</td>
  //       <td>{user.email}</td>
  //     </tr>
  //   );
  // });

  return (
    <div style={{width: '100%', margin: '0'}}>
      <h2 className="mt-4">
        Feeds
        <a className="btn btn-outline-primary" href="/feeds/register">
          Register
        </a>
      </h2>
      <form id="frmSearch" method="get">
        <div className="input-group">
          <div className="input-group-prepend" style={{marginRight: '10px'}}>
            <select value={choice} onChange={handleType}>
              {options.map((item, idx) => (
                <option key={idx} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="keyword"
              style={{borderRadius: '5px', border: '1px solid gray'}}
              id="keyword"
            />
            <button className="btn btn-outline-primary btnSearch">Search</button>
          </div>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Fno</th>
            <th scope="col">Title & Photo</th>
            <th scope="col">Review Count</th>
            <th scope="col">Average Rating</th>
            <th scope="col">RegDate</th>
          </tr>
        </thead>
        <tbody>
          {pageResultDTO?.dtoList.map(feedsDTO => (
            <tr key={feedsDTO.fno} style={{cursor: 'pointer'}}>
              <th scope="row">{feedsDTO.fno}</th>
              <td>
                {feedsDTO.photosDTOList.length > 0 && (
                  <img
                    src={`/display?fileName=${feedsDTO.photosDTOList[0].path}`}
                    alt="Feed Thumbnail"
                  />
                )}
                {feedsDTO.title}
              </td>
              <td>
                <b>{feedsDTO.reviewsCnt}</b>
              </td>
              <td>
                <b>{feedsDTO.likes}</b>
              </td>
              <td>{new Date(feedsDTO.regDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {pageRequestDTO ? (
          <pre>{JSON.stringify(pageRequestDTO, null, 2)}</pre>
        ) : (
          <div>노토큰</div>
        )}
      </div>
    </div>
  )
}
