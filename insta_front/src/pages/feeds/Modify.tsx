import {SyntheticEvent, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
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
  const {fno: urlFno} = useParams<{fno: string}>()
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
    return <div>No data available for modification</div>
  }

  return (
    <div>
      <h2>Modify Feed</h2>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Fno</label>
          <input
            type="text"
            name="fno"
            className="form-control"
            value={formData.fno}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={e =>
              setFormData(prev => (prev ? {...prev, title: e.target.value} : null))
            }
          />
        </div>
        <div className="form-group">
          <label>Images</label>
          <ul>
            {/* 기존 이미지 */}
            {formData.photosDTOList.map(photo => (
              <li key={photo.uuid} style={{marginBottom: '10px'}}>
                <img
                  src={`http://localhost:8080/api/display?fileName=${photo.thumbnailURL}`}
                  alt="Feed Thumbnail"
                  style={{maxWidth: '100px', marginRight: '10px'}}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleImageDelete(photo.uuid)}>
                  Delete
                </button>
              </li>
            ))}
            {/* 새로 업로드한 이미지 미리보기 */}
            {newImagePreviews.map((url, index) => (
              <li key={index} style={{marginBottom: '10px'}}>
                <img
                  src={url}
                  alt="New Thumbnail"
                  style={{maxWidth: '100px', marginRight: '10px'}}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleNewImageDelete(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="form-group">
          <label>Review Count</label>
          <input
            type="text"
            name="reviewsCnt"
            className="form-control"
            value={formData.reviewsCnt}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Likes</label>
          <input
            type="text"
            name="likes"
            className="form-control"
            value={formData.likes}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-danger" onClick={handleFeedDelete}>
          Delete Feed
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(`/feeds/read?fno=${formData.fno}`)}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default Modify
