import {SyntheticEvent, useCallback, useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import useToken from '../../hooks/useToken'

// Feed 데이터 구조 정의
interface FeedsDTO {
  fno: number
  title: string
  photosDTOList: PhotosDTO[]
  reviewsCnt: number
  likes: number
  regDate: string
  modDate: string
}

// PhotosDTO 구조 정의
interface PhotosDTO {
  uuid: string
  photosName: string
  thumbnailURL: string // 기존 구조 유지
}

export default function Read() {
  const navigate = useNavigate()
  const [feedsDTO, setFeedsDTO] = useState<FeedsDTO | null>(null)
  const token = useToken()

  // URL 쿼리 파라미터 가져오기
  const [query] = useSearchParams()
  const page = query.get('page') || '1'
  const type = query.get('type') || ''
  const keyword = query.get('keyword') || ''
  const fno = query.get('fno') || ''

  // 데이터 가져오기
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/feeds/read/${fno}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setFeedsDTO(data) // 직접 feedsDTO로 설정
      } catch (error) {
        console.error('Error fetching feed:', error)
      }
    }

    if (fno && token) fetchFeed()
  }, [fno, token])

  const transDateFormat = useCallback((d: string) => {
    const date = new Date(Date.parse(d ?? ''))
    return (
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-') +
      ' ' +
      [
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
        String(date.getSeconds()).padStart(2, '0')
      ].join(':')
    )
  }, [])

  const handleModifyClick = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!feedsDTO) {
      console.error('No feed data available for modification')
      return
    }
    // Modify 페이지로 이동하며 feedsDTO 데이터를 전달
    navigate(`/feeds/modify/${feedsDTO.fno}`, {
      state: {feedsDTO} // 데이터 전달
    })
  }

  const handleBackClick = (e: SyntheticEvent) => {
    e.preventDefault()
    // List 페이지로 이동
    navigate(`/feeds/list?page=${page}&type=${type}&keyword=${keyword}`)
  }

  if (!feedsDTO) return <div>Loading...</div>

  return (
    <>
      <h2 className="mt-4">Feed Details</h2>
      <form>
        <div className="form-group">
          <label>Fno</label>
          <input
            type="text"
            value={feedsDTO.fno}
            name="fno"
            className="form-control"
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={feedsDTO.title}
            className="form-control"
            readOnly
          />
        </div>
        <div style={{marginBottom: '30px'}}>
          <label>Review Count</label>
          <input
            type="text"
            name="reviewsCnt"
            className="form-control"
            readOnly
            value={feedsDTO.reviewsCnt}
          />
        </div>
        <div style={{marginBottom: '30px'}}>
          <label>Average Likes</label>
          <input
            type="text"
            name="likes"
            readOnly
            className="form-control"
            value={feedsDTO.likes}
          />
        </div>
        <div className="form-group">
          <label>RegDate</label>
          <input
            type="text"
            className="form-control"
            value={transDateFormat(feedsDTO.regDate)}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>ModDate</label>
          <input
            type="text"
            className="form-control"
            value={transDateFormat(feedsDTO.modDate)}
            readOnly
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary btnModi" onClick={handleModifyClick}>
            Modify
          </button>
          <button className="btn btn-info btnBack" onClick={handleBackClick}>
            Back
          </button>
        </div>
      </form>
      {feedsDTO.photosDTOList.length > 0 && (
        <div className="uploadResult">
          <ul>
            {feedsDTO.photosDTOList
              .filter(photosDTO => photosDTO.thumbnailURL) // 이미지가 있는 항목만 필터링
              .map((photosDTO, idx) => (
                <li key={idx} style={{cursor: 'pointer'}}>
                  <img
                    src={`http://localhost:8080/api/display?fileName=${photosDTO.thumbnailURL}`}
                    style={{
                      display: 'inline-block',
                      marginRight: '20px',
                      maxWidth: '100px',
                      height: 'auto'
                    }}
                    alt="Feed Thumbnail"
                  />
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  )
}
