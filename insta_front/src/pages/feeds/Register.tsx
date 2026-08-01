import {FormEvent, useCallback, useRef, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import useToken from '../../hooks/useToken'
// PhotosDTO 구조 정의
interface PhotosDTO {
  uuid: string | Blob
  photosName: string | Blob
  path: string | Blob
}

// 업로드 API(UploadResultDTO) 응답 구조
interface UploadResult {
  fileName: string
  uuid: string
  folderPath: string
  photosURL: string
  thumbnailURL: string
}

export default function Register() {
  // 주소의 쿼리를 받기 위한 선언
  const [query] = useSearchParams()
  const token = useToken()
  const navigate = useNavigate()

  const refTitle = useRef<HTMLInputElement | null>(null)
  const refFile = useRef<HTMLInputElement | null>(null)
  const refLabelFile = useRef<HTMLLabelElement | null>(null)

  const [labelFile, setLabelFile] = useState('')
  const [inputHiddens, setInputHiddens] = useState('')

  const checkExtension = useCallback((fileName: string, fileSize: number) => {
    const maxSize = 1024 * 1024 * 10
    if (fileSize >= maxSize) {
      alert('파일사이즈 초과')
      return false
    }
    //const regex = new RegExp("(.*?)\.(exe|sh|zip|alz|tiff)$"); //i대소문자구분X
    const regex = new RegExp('(.*?).(jpg|jpeg|png|gif|bmp|pdf)$', 'i')
    if (!regex.test(fileName)) {
      alert('해당파일 업로드 금지!')
      return false
    }
    return true
  }, [])

  const fileChange = useCallback(() => {
    const formData = new FormData()
    const fileName = refFile.current?.value.split('\\').pop()
    console.log(fileName)
    const flist = refFile.current?.files ?? []
    const flistLength = flist?.length ?? 0
    console.log(flist?.length, isNaN(flistLength))

    const tmpLabel =
      (flist?.length ?? 0) - 1 === 0 ? '' : `${fileName} 외 ${(flist?.length ?? 0) - 1}개`
    console.log(tmpLabel)
    setLabelFile(tmpLabel)

    let appended = false // 파일이 잘 추가되는지 확인
    for (let i = 0; i < flistLength; i++) {
      if (!checkExtension(flist[i]?.name, flist[i].size)) {
        if (refFile?.current?.value !== undefined) refFile.current.value = ''
        appended = false
        break
      }
      formData.append('uploadFiles', flist[i])
      appended = true
    }

    if (!appended) return
    for (const value of formData.values()) console.log(value)
    let url = 'http://localhost:8080/api/uploadAjax'

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'multipart/form-data'
      }
      // dataType: 'json'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        showResult(json)
      })
      .catch(err => console.log('Error: ', err))
  }, [labelFile])

  function showResult(arr: UploadResult[]) {
    const uploadUL = document.querySelector('.uploadResult ul')
    if (!uploadUL) return
    let str = ''
    const url = 'http://localhost:8080/api/display'
    for (let i = 0; i < arr.length; i++) {
      str += `<li data-name='${arr[i].fileName}' data-path='${arr[i].folderPath}'
      data-uuid='${arr[i].uuid}' data-file='${arr[i].photosURL}'><div>
      <button class="removeBtn" type="button">X</button>
      <img src="${url}?fileName=${arr[i].thumbnailURL}">
      </div></li>`
    }
    uploadUL.innerHTML = str
    const removeBtns = document.querySelectorAll<HTMLButtonElement>('.removeBtn')
    for (let i = 0; i < removeBtns.length; i++) {
      removeBtns[i].onclick = function (ev: MouseEvent) {
        const removeUrl = 'http://localhost:8080/api/removeFile?fileName='
        const targetLi = (ev.currentTarget as HTMLElement).closest('li')
        if (!targetLi) return
        const fileName = targetLi.dataset.file
        console.log(fileName)
        fetch(removeUrl + fileName, {method: 'POST'})
          .then(response => response.json())
          .then(json => {
            console.log(json)
            if (json === true) targetLi.remove()
            const label = document.querySelector('#custom-label')
            if (label) label.innerHTML = ''
            const fileInput = document.querySelector<HTMLInputElement>('#fileInput')
            if (fileInput) fileInput.value = ''
          })
          .catch(err => console.log('Error occurred: ', err))
      }
    }
  }
  const transform = (str: string) => {
    return str.replace(/\n/g, '')
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let compare = query.get('page') // 기본적으로 페이지 1을 사용
    const page = compare === 'null' || compare == null ? '1' : compare
    compare = query.get('type')
    const type = compare === 'null' || compare == null ? '' : compare
    compare = query.get('keyword')
    const keyword = compare === 'null' || compare == null ? '' : compare

    const formData = new FormData(e.currentTarget)

    const title = refTitle.current
    if (title?.value == '') {
      title.focus()
      return false
    }

    let str = ''
    const liArr = document.querySelectorAll<HTMLLIElement>('.uploadResult ul li')
    let arr: PhotosDTO[] = []
    for (let i = 0; i < liArr.length; i++) {
      const ds = liArr[i].dataset
      str += `
            <input type="hidden" name="photosDTOList[${i}].photosName" value="${ds.name}">
            <input type="hidden" name="photosDTOList[${i}].path" value="${ds.path}">
            <input type="hidden" name="photosDTOList[${i}].uuid" value="${ds.uuid}">
          `
      arr.push({
        photosName: ds.name ?? '',
        path: ds.path ?? '',
        uuid: ds.uuid ?? ''
      })
    }
    setInputHiddens(str)

    arr.forEach((photo, index) => {
      formData.append(`photosDTOList[${index}].uuid`, photo.uuid)
      formData.append(`photosDTOList[${index}].photosName`, photo.photosName)
      formData.append(`photosDTOList[${index}].path`, photo.path)
    })

    // for (const key of formData.keys()) console.log(key, ':', formData.get(key))

    const formDataObj = {
      title: refTitle.current?.value ?? '',
      photosDTOList: arr // PhotosDTO 타입의 배열 (클라이언트에서 JSON으로 보낼 데이터)
    }

    let resMessage = ''
    if (token) {
      fetch('http://localhost:8080/api/feeds/register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
        //JavaScript 값이나 객체를 JSON 문자열로 변환
        body: JSON.stringify(formDataObj)
      })
        .then(res => res.text())
        .then(data => {
          console.log(data)
          resMessage = data
        })
        .catch(err => console.log('Error: ' + err))
      navigate(
        `/feeds/list?page=${page}&type=${type}&keyword=${keyword}&$msg=${resMessage}`
      )
    } else {
      navigate(`/`)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">새 게시물</h1>
      <form
        onSubmit={handleSubmit}
        id="frmSend"
        method="post"
        action="http://localhost:8080/api/feeds/register"
        className="st-card space-y-5 p-6">
        <div>
          <label htmlFor="title" className="st-label">
            제목
          </label>
          <input
            type="text"
            name="title"
            ref={refTitle}
            id="title"
            className="st-input"
            placeholder="타이틀을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="fileInput" className="st-label" ref={refLabelFile}>
            사진 업로드
          </label>
          <input
            type="file"
            id="fileInput"
            ref={refFile}
            onChange={fileChange}
            className="block w-full text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-hover"
            multiple
          />
          <label id="custom-label" className="mt-1 block text-xs text-ink-soft"></label>
        </div>
        <div
          className="hidden"
          dangerouslySetInnerHTML={{__html: transform(inputHiddens)}}></div>
        <div className="uploadResult">
          <ul></ul>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="st-btn st-btn--primary px-8">
            등록
          </button>
        </div>
      </form>
    </div>
  )
}
