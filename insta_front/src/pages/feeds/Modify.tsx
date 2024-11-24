import {useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

interface FeedsDTO {
  fno: number
  title: string
  reviewsCnt: number
  likes: number
  regDate: string
  modDate: string
  photosDTOList: PhotosDTO[]
}

interface PhotosDTO {
  uuid: string
  photosName: string
  thumbnailURL: string
}

const Modify: React.FC = () => {
  const {state} = useLocation() // Read에서 전달된 state 받기
  const navigate = useNavigate()
  const {fno: urlFno} = useParams<{fno: string}>()

  const [formData, setFormData] = useState<FeedsDTO | null>(state?.feedsDTO || null)
  const [newImages, setNewImages] = useState<File[]>([]) // 새로 추가된 이미지

  const addDefaultImg = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/path/to/default-image.png' // 기본 이미지 경로 설정
  }

  // 이미지 삭제 핸들러
  const handleImageDelete = (uuid: string) => {
    if (!formData) return

    fetch(`http://localhost:8080/api/feeds/photos/${uuid}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          console.error(`Error deleting image: ${res.statusText}`)
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(() => {
        setFormData(prev =>
          prev
            ? {
                ...prev,
                photosDTOList: prev.photosDTOList.filter(photo => photo.uuid !== uuid)
              }
            : null
        )
        alert('Image deleted successfully')
      })
      .catch(error => console.error('Error deleting image:', error))
  }

  // 새 이미지 추가 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  // 저장 버튼 클릭 핸들러
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) {
      console.error('No form data to save')
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('feed', JSON.stringify(formData))
    newImages.forEach(image => {
      formDataToSend.append('images', image)
    })

    console.log('Sending form data:', formDataToSend) // 디버그용 출력

    fetch(`http://localhost:8080/api/feeds/modify/${formData.fno}`, {
      method: 'PUT',
      body: formDataToSend
    })
      .then(response => {
        console.log('API Response:', response) // 응답 전체 출력
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(() => {
        alert('Modification successful')
        navigate(`/feeds/read?fno=${formData.fno}`)
      })
      .catch(error => {
        console.error('Error occurred:', error)
        alert('An error occurred while saving')
      })
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
            {formData.photosDTOList.map(photo => (
              <li key={photo.uuid} style={{marginBottom: '10px'}}>
                <img
                  src={`http://localhost:8080/api/display?fileName=${photo.thumbnailURL}`}
                  alt="Feed Thumbnail"
                  style={{maxWidth: '100px', marginRight: '10px'}}
                  onError={addDefaultImg}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleImageDelete(photo.uuid)}>
                  Delete
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
            onChange={e =>
              setFormData(prev =>
                prev ? {...prev, reviewsCnt: Number(e.target.value)} : null
              )
            }
          />
        </div>
        <div className="form-group">
          <label>Likes</label>
          <input
            type="text"
            name="likes"
            className="form-control"
            value={formData.likes}
            onChange={e =>
              setFormData(prev =>
                prev ? {...prev, likes: Number(e.target.value)} : null
              )
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save
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
