import { useErrorStore } from '@/stores/error'

const API_BASE_URL = 'http://localhost:3000'

export const fetchApi = async (endpoint, options = {}) => {
  const errorStore = useErrorStore()

  try {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      if (data.message) {
        errorStore.showErrorMessage(data.message)
      } else {
        errorStore.showErrorMessage(`error${response.status}`)
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
