import axios from 'axios'

export default async function pingUrl(url) {
  try {
      const response = await axios(url)
      if (response.status !== 200) console.error(`Not found: ${url}`)
      return true
  } catch (error) {
    console.error(error)
  }
  return false
}