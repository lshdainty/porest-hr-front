import axios from 'axios'
import config from '@/config/config'

const baseURL = config.apiBaseUrl
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 포함하여 요청 (Spring security에서 반환한 JSESSIONID, VALUE)
})

export { api }
