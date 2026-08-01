import {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import useToken from '../../hooks/useToken'

// Feed 데이터 구조 정의
interface FeedsDTO {
  fno: number
  title: string
  reviewsCnt: number
  likes: number
  regDate: string
  modDate: string
  photosDTOList: PhotosDTO[]
}

// PhotosDTO 데이터 구조 정의
interface PhotosDTO {
  uuid: string
  photosName: string
  thumbnailURL: string
}

const Modify: React.FC = () => {
  const {state} = useLocation() // Read에서 전달된 state 받기
  const navigate = useNavigate()
  const token = useToken()

  const [formData, setFormData] = useState<FeedsDTO | null>(state?.feedsDTO || null)
  const [newImages, setNewImages] = useState<File[]>([]) // 새로 추가된 이미지
  const [deletedImages, setDeletedImages] = useState<string[]>([]) // 삭제할 이미지의 UUID
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]) // 새로 추가된 이미지 미리보기 URL

  const handleImageDelete = (uuid: string) => {
    setDeletedImages(prev => [...prev, uuid])
    setFormData(prev =>
      prev
        ? {
            ...prev,
            photosDTOList: prev.photosDTOList.filter(photo => photo.uuid !== uuid)
          }
        : null
    )
  }

  const handleNewImageDelete = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewImages(prev => [...prev, ...files])

      // 미리보기 URL 생성
      const previewUrls = files.map(file => URL.createObjectURL(file))
      setNewImagePreviews(prev => [...prev, ...previewUrls])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !token) {
      alert('No form data or token to save.')
      return
    }

    try {
      const formDataToSend = new FormData()

      // Feed 데이터 추가
      formDataToSend.append(
        'feed',
        new Blob([JSON.stringify(formData)], {type: 'application/json'})
      )

      // 새로 추가된 이미지 추가
      newImages.forEach(image => {
        formDataToSend.append('images', image)
      })

      // 삭제된 이미지 UUID 추가
      deletedImages.forEach(uuid => {
        formDataToSend.append('deletedImages', uuid)
      })

      const response = await fetch('http://localhost:8080/api/feeds/modify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error Response:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      alert('Modification successful')
      navigate(`/feeds/read?fno=${formData.fno}`)
    } catch (error) {
      console.error('Error occurred while saving:', error)
      alert('An error occurred while saving')
    }
  }

  const handleFeedDelete = () => {
    if (!formData || !token) {
      console.error('No feed data or token available for deletion')
      return
    }

    if (window.confirm(`Are you sure you want to delete feed #${formData.fno}?`)) {
      fetch(`http://localhost:8080/api/feeds/${formData.fno}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          alert('Feed deleted successfully')
          navigate('/feeds/list')
        })
        .catch(error => {
          console.error('Error occurred while deleting the feed:', error)
          alert('An error occurred while deleting the feed')
        })
    }
  }

  if (!formData) {
    return (
      <div className="py-20 text-center text-ink-soft">수정할 데이터가 없습니다.</div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">게시물 수정</h1>
      <form onSubmit={handleSave} className="st-card space-y-5 p-6">
        <div>
          <label className="st-label">제목</label>
          <input
            type="text"
            name="title"
            className="st-input"
            value={formData.title}
            onChange={e =>
              setFormData(prev => (prev ? {...prev, title: e.target.value} : null))
            }
          />
        </div>

        <div>
          <label className="st-label">사진</label>
          <div className="flex flex-wrap gap-3">
            {/* 기존 이미지 */}
            {formData.photosDTOList.map(photo => (
              <div key={photo.uuid} className="relative">
                <img
                  src={`http://localhost:8080/api/display?fileName=${photo.thumbnailURL}`}
                  alt="Feed Thumbnail"
                  className="h-24 w-24 rounded-lg border border-ink-line object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(photo.uuid)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white">
                  ×
                </button>
              </div>
            ))}
            {/* 새로 업로드한 이미지 미리보기 */}
            {newImagePreviews.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt="New Thumbnail"
                  className="h-24 w-24 rounded-lg border border-brand object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleNewImageDelete(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white">
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-3 block w-full text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-hover"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-line pt-5">
          <button
            type="button"
            className="st-btn st-btn--ghost mr-auto"
            onClick={() => navigate(`/feeds/read?fno=${formData.fno}`)}>
            취소
          </button>
          <button type="button" className="st-btn st-btn--danger" onClick={handleFeedDelete}>
            삭제
          </button>
          <button type="submit" className="st-btn st-btn--primary px-8">
            저장
          </button>
        </div>
      </form>
    </div>
  )
}

export default Modify
