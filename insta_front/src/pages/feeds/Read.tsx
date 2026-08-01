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

  if (!feedsDTO)
    return <div className="py-20 text-center text-ink-soft">불러오는 중…</div>

  const photos = feedsDTO.photosDTOList.filter(p => p.thumbnailURL)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
          <span className="material-icons text-[18px]">arrow_back</span>목록으로
        </button>
        <button onClick={handleModifyClick} className="st-btn st-btn--primary">
          <span className="material-icons text-[18px]">edit</span>수정
        </button>
      </div>

      <article className="st-card overflow-hidden">
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-1 bg-black/[0.04] sm:grid-cols-3">
            {photos.map((photosDTO, idx) => (
              <img
                key={idx}
                src={`http://localhost:8080/api/display?fileName=${photosDTO.thumbnailURL}`}
                alt={`${feedsDTO.title} ${idx + 1}`}
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
        )}

        <div className="space-y-4 p-6">
          <h1 className="text-2xl font-bold text-ink">{feedsDTO.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="material-icons text-[18px]">chat_bubble_outline</span>
              리뷰 {feedsDTO.reviewsCnt}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-icons text-[18px]">star_outline</span>
              평점 {feedsDTO.likes}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-2 border-t border-ink-line pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-ink-soft">작성일</dt>
              <dd className="text-ink">{transDateFormat(feedsDTO.regDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-soft">수정일</dt>
              <dd className="text-ink">{transDateFormat(feedsDTO.modDate)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  )
}
