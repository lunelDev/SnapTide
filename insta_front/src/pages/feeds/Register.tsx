import {FormEvent, useCallback, useRef, useState} from 'react'

export default function Register() {
  const refTitle = useRef<HTMLInputElement | null>(null)
  const refFile = useRef<HTMLInputElement | null>(null)
  const refLabelFile = useRef<HTMLLabelElement | null>(null)
  const [labelFile, setLabelFile] = useState('')

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
    let formData = new FormData()
    const fileName = refFile.current?.value.split('\\').pop()
    console.log(fileName)
    const flist = refFile.current?.files
    console.log(flist?.length)

    const tmpLabel =
      (flist?.length ?? 0) - 1 == 0 ? '' : `${fileName} 외 ${(flist?.length ?? 0) - 1}개`
    setLabelFile(tmpLabel)
    // setLabelFile(refFile.current?.files.length - 1 == 0
    //     ? ''
    //     : `${fileName} 외 ${fileInput.files.length - 1}개`)

    // let appended = false // 파일이 잘 추가되는지 확인
    // for (let i = 0; i < fileInput.files.length; i++) {
    //   if (!checkExtension(fileInput.files[i].name, fileInput.files.size)) {
    //     label.innerHTML = ''
    //     fileInput.value = ''
    //     appended = false
    //     break
    //   }
    //   formData.append('uploadFiles', fileInput.files[i])
    //   appended = true
    // }
    // if (!appended) return
    // for (const value of formData.values()) console.log(value)
    // const url = /*[[@{/uploadAjax}]]*/ 'url'
    // fetch(url, {
    //   method: 'POST',
    //   body: formData,
    //   dataType: 'json'
    // })
    //   .then(res => res.json())
    //   .then(json => {
    //     console.log(json)
    //     showResult(json)
    //   })
    //   .catch(err => console.log('Error: ', err))
  }, [labelFile])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (refTitle.current?.value === '' || refTitle.current?.value == null) {
      alert('Please Check Title')
      refTitle.current?.focus()
      return
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title" style={{fontSize: '22px'}}>
            Title
          </label>
          <input
            type="text"
            name="title"
            ref={refTitle}
            style={{fontSize: '22px'}}
            id="title"
            className="form-control"
            placeholder="타이틀을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="fileInput"
            style={{fontSize: '22px'}}
            ref={refLabelFile}
            defaultValue={labelFile ?? ''}>
            Select Image Files
          </label>
          <input
            type="file"
            id="fileInput"
            ref={refFile}
            style={{fontSize: '22px'}}
            onChange={fileChange}
            className="custom-file-input form-control files"
            multiple></input>
          <label id="custom-label"></label>
        </div>
        <div className="box"></div>
        <div className="form-group">
          <button
            type="submit"
            id="btnSend"
            className="btn btn-primary"
            style={{fontSize: '22px'}}>
            Submit
          </button>
        </div>
      </form>
      <div className="uploadResult">
        <ul></ul>
      </div>
    </>
  )
}
