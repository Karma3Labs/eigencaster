import axios from 'axios'
import supabase from '../../lib/db'
import { formatCasts } from '../../utils/cast'

export async function searchCasts(query) {
  const startTime = Date.now()

  const { address } = query
  let casts = []

  try {
    casts = await axios.get(`${process.env.API_URL}/suggest_casts?address=${address}`)
  }
  catch (e) {
    console.log(e)
    return {
      error: "Server failed to suggest"
    }
  }

  // Restructure data
  const formattedResponse = formatCasts(casts.data)

  const endTime = Date.now()
  const elapsedTime = endTime - startTime

  return {
    casts: formattedResponse,
    meta: {
      count: formattedResponse.length,
      responseTime: elapsedTime,
    },
  }
}

export default async function handler(req, res) {
  try {
    res.json(await searchCasts(req.query))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
