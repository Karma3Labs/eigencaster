import axios from 'axios'

export async function searchProfiles(query) {
  let { address } = query
  let profiles = { data: [] }

  if (address) {
    try {
      profiles = await axios.get(`${process.env.API_URL}/suggest_profiles?address=${address}`)
    }
    catch (e) {
      return {
        error: "Server failed to suggest"
      }
    }
    console.log(profiles)
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
