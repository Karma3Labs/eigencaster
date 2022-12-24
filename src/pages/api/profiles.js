import axios from 'axios'
import { isAddress } from 'ethers/lib/utils'

export async function searchProfiles(query) {
  let profiles = { data: [] }
  console.log(query)
  if ('search' in query) {
    if (isAddress(query.search)) {
      query = { address: query.search }
    }
    else {
      query = { username: query.search }
    }
  }

  try {
    profiles = await axios.get(`${process.env.API_URL}/suggest_profiles`, {
      params: query
    })
  }
  catch (e) {
    console.log(`[PROFILES] Error: ${e} for query:`, query)
    profiles.data = []
  }

  const formattedProfiles = profiles.data.map((p) => {
    return {
      body: {
        id: p.fid,
        address: p.address,
        username: p.username,
        displayName: p.displayName,
        bio: p.bio,
        followers: p.followers,
        following: p.following,
        avatarUrl: p.avatarUrl || 'url',
        isVerifiedAvatar: p.avatarVerified,
        proofUrl: `https://api.farcaster.xyz/v1/verified_addresses/${p.address}`,
        registeredAt: new Date(p.registered_at).getTime(),
      },
      youFollow: p.youFollow,
      followsYou: p.followsYou,
      connectedAddress: p.connectedAddress,
    }
  })

  return formattedProfiles
}

export default async function handler(req, res) {
  try {
    res.json(await searchProfiles(req.address))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
