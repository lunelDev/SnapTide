import {FormEvent, useEffect, useRef, useState} from 'react'
import useToken from '../../hooks/useToken'
import {useNavigate, useSearchParams} from 'react-router-dom'

// Feed 데이터 구조 정의
interface Feed {
  fno: number
  title: string
  photosDTOList: {path?: string; thumbnailURL?: string}[]
  reviewsCnt: number
  likes: number
  regDate: string
}

// PageRequestDTO 구조 정의
interface PageRequestDTO {
  page: string
  size: string
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
  const navigate = useNavigate()

  // 주소의 쿼리를 받기 위한 선언
  const [query] = useSearchParams()

  // 입력양식태그 접근을 위한 선언
  const refType = useRef<HTMLSelectElement | null>(null)
  const refKeyword = useRef<HTMLInputElement | null>(null)
  const refBtnSrch = useRef<HTMLButtonElement | null>(null)

  // 가변 상태를 캐시하기 위한 선언
  const [pageRequestDTO, setPageRequestDTO] = useState<PageRequestDTO>({
    page: '',
    size: '',
    type: '',
    keyword: ''
  })
  const [pageResultDTO, setPageResultDTO] = useState<PageResultDTO | null>(null)
  const [inverted, setInverted] = useState(true)
  const [keywords, setKeywords] = useState('')
  const [types, setTypes] = useState('')

  const options = [
    {value: '', label: '선택하세요'},
    {value: 't', label: '제목'},
    {value: 'c', label: '내용'},
    {value: 'w', label: '작성자'},
    {value: 'tc', label: '제목 + 내용'},
    {value: 'tcw', label: '제목 + 내용 + 작성자'}
  ]

  useEffect(() => {
    // ?? 는 null 병합 연산자, 왼쪽값이 null, undefined일 때 오른쪽 값을 반환
    // null과 undefined을 '==' 하면 true, '===' 하면 false
    let compare = query.get('page') // 기본적으로 페이지 1을 사용
    const page = compare === 'null' || compare == null ? '1' : compare
    compare = query.get('type')
    const type = compare === 'null' || compare == null ? '' : compare
    compare = query.get('keyword')
    const keyword = compare === 'null' || compare == null ? '' : compare

    let url = 'http://localhost:8080/api/feeds/list'
    const queryParams = []

    if (type) {
      setTypes(type)
      setInverted(false)
      queryParams.push(`type=${type}`)
    }
    if (page) queryParams.push(`page=${page}`)
    if (keyword) {
      console.log(keyword + inverted)
      setInverted(false)
      queryParams.push(`keyword=${keyword}`)
    }
    if (queryParams.length > 0) url += '?' + queryParams.join('&')

    if (token) {
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          setPageRequestDTO(data.pageRequestDTO)
          setPageResultDTO(data.pageResultDTO)
        })
        .catch(err => console.log('Error:', err))
    }
  }, [query, types, token]) // 쿼리 파라미터 변경 시 리스트 다시 불러옴

  const url = `/feeds`

  const getSearch = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const keywordw = refKeyword.current?.value
    const typew = refType.current?.value

    if (!keywordw) {
      refKeyword.current?.focus()
      return
    }

    // navigate 호출로 URL만 변경
    navigate(url + `/list?type=${typew}&keyword=${keywordw}&page=1`)
  }

  const goRead = (fno: number, page: number, type: string, keyword: string) => {
    location.href = url + `/read?fno=${fno}&page=${page}&type=${type}&keyword=${keyword}`
  }
  const goRegister = () => {
    location.href =
      url +
      `/register?page=${pageRequestDTO.page}&type=${pageRequestDTO.type}&keyword=${pageRequestDTO.keyword}`
  }

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(Date.parse(d))

  return (
    <div className="space-y-6">
      {/* 헤더 + 검색 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">피드</h1>
        <button onClick={goRegister} className="st-btn st-btn--primary self-start sm:self-auto">
          <span className="material-icons text-[18px]">add</span>새 게시물
        </button>
      </div>

      <form method="GET" className="flex flex-col gap-2 sm:flex-row">
        <select
          className="st-input sm:w-44"
          ref={refType}
          name="type"
          value={types}
          onChange={e => {
            if (e) {
              setTypes(refType.current?.value ?? '')
              if (e.target.selectedIndex === 0) {
                if (!keywords) setKeywords('')
                setInverted(true)
                if (refKeyword.current?.value) setKeywords('')
                navigate(`/`)
              } else if (e.target.value !== types) {
                if (!keywords) setKeywords('')
                setInverted(false)
                if (refKeyword.current?.value) setKeywords('')
                navigate(`/`)
                refKeyword.current?.focus()
              } else {
                setInverted(false)
              }
            }
            setTypes(e.target.value)
          }}>
          {options.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="st-input flex-1 disabled:cursor-not-allowed disabled:opacity-60"
          name="keyword"
          placeholder="검색어를 입력하세요"
          ref={refKeyword}
          disabled={inverted}
          onChange={e => setKeywords(e.target.value)}
          value={pageRequestDTO.keyword ?? keywords}
        />
        <button
          type="button"
          className="st-btn st-btn--ghost"
          onClick={getSearch}
          ref={refBtnSrch}
          disabled={inverted}>
          <span className="material-icons text-[18px]">search</span>검색
        </button>
      </form>

      {/* 카드 그리드 */}
      {pageResultDTO && pageResultDTO.dtoList.length === 0 ? (
        <div className="st-card py-20 text-center text-ink-soft">
          <span className="material-icons mb-2 text-4xl">photo_library</span>
          <p className="font-semibold">게시물이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pageResultDTO?.dtoList.map(feedsDTO => {
            const thumb = feedsDTO.photosDTOList?.[0]?.thumbnailURL
            return (
              <button
                key={feedsDTO.fno}
                onClick={() =>
                  goRead(
                    feedsDTO.fno,
                    pageResultDTO.page,
                    pageRequestDTO.type,
                    pageRequestDTO.keyword
                  )
                }
                className="st-card group overflow-hidden text-left transition hover:shadow-soft">
                <div className="relative aspect-square w-full overflow-hidden bg-black/[0.04]">
                  {thumb ? (
                    <img
                      src={`http://localhost:8080/api/display?fileName=${thumb}`}
                      alt={feedsDTO.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-line">
                      <span className="material-icons text-5xl">image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-semibold text-ink">{feedsDTO.title}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-soft">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-[15px]">chat_bubble_outline</span>
                      {feedsDTO.reviewsCnt ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-[15px]">star_outline</span>
                      {feedsDTO.likes ?? 0}
                    </span>
                    <span className="ml-auto">{formatDate(feedsDTO.regDate)}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {pageResultDTO && pageResultDTO.pageList.length > 0 && (
        <nav className="flex items-center justify-center gap-1 pt-2">
          {pageResultDTO.prev && (
            <a
              className="st-btn st-btn--ghost px-3 py-2"
              href={`/feeds/list?page=${Math.max(1, pageResultDTO.start - 1)}`}>
              이전
            </a>
          )}
          {pageResultDTO.pageList.map(page => (
            <a
              key={page}
              className={`st-btn px-3.5 py-2 ${
                pageResultDTO.page === page
                  ? 'st-btn--primary'
                  : 'st-btn--ghost'
              }`}
              href={`/feeds/list?page=${page}&type=${query.get('type')}&keyword=${query.get(
                'keyword'
              )}`}>
              {page}
            </a>
          ))}
          {pageResultDTO.next && (
            <a
              className="st-btn st-btn--ghost px-3 py-2"
              href={`/feeds/list?page=${pageResultDTO.end + 1}`}>
              다음
            </a>
          )}
        </nav>
      )}
    </div>
  )
}
