import { SV_API_URL } from '../store/module'

export const useFile = (file: any) => {
  const fileUrl = file && `${SV_API_URL}/file/${file._id||file}`

  return {
    link: fileUrl,
    download: `${fileUrl}/download`
  }
}
