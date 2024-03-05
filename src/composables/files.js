import axios from 'axios'
import { kebabCase as paramCase } from 'change-case'
import consola from 'consola'


export function uploadTempFile(file) {

  const name  = cleanFileName(file.name)
  const type  = file.type

  const postData = { name, type };

  return axios.post('https://88g0q0fw15.execute-api.us-east-1.amazonaws.com/dev/s3-pre-sign/upload', postData)
  .then(({ data }) => {
    const { putUrl, url } = data

    return axios.put(putUrl, file, { headers: { 'Content-Type': type } })
      .then(() => url);
  });
}



export function cleanFileName(fileName){
  const [ extension, indexOfStart ] = /[^.]+$/.exec(fileName) || []
  
  if(!indexOfStart) encodeURIComponent(paramCase(fileName))

  const name = encodeURIComponent(paramCase(fileName.replace(`.${extension}`, '')))

  return `${name}.${extension}`
}