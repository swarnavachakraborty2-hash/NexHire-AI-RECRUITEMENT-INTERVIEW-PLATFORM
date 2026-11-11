import axios from 'axios'

const axios = axios.create({
  baseURL: process.meta.env.VITE_API_URL || "http://localhost:5173/",
  withCredentials: true
})


export const errorHandler = async (fn) => {
  try {
    return await fn()
  } catch (error) {
    if (error.response.status === 401) {
      console.log("refresh token required")
      return await fn()
    }
  }
}


export default axios



