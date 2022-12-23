import axios from 'axios'
import { formatCasts } from '../../utils/cast'
import { isAddress } from 'ethers/lib/utils'

export async function searchCasts(query) {
  const startTime = Date.now()
  let casts = []

  if ('search' in query) {
    if (isAddress(query.search)) {
      query = { address: query.search }
    }
    else {
      query = { username: query.search }
    }
  }

  try {
    casts = await axios.get(`${process.env.API_URL}/suggest_casts`, {
      params: query
    })
  }
  catch (e) {
    console.log(`[CASTS] Error: ${e} for query:`, query)
    casts = { data: [] }
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
