import Head from 'next/head'

import { arrowIcon } from '../assets/icons'
import { searchProfiles } from './api/profiles'
import Container from '../components/Container'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

export default function Search({ data, query }) {
  const hasData = data && data.length > 0

  return (
    <>
      <Head>
        <title>Farcaster Recommender</title>
        <meta
          property="og:image"
          content={`https://searchcaster.xyz/api/og/search?text=${query?.address || 'Eigencaster'
            }`}
        />
      </Head>

      <Container>
        <div className="header">
          <Logo className="mb-3" />

          <form>
            <div className="input-wrapper">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Enter your address"
                defaultValue={query.address || query.username}
              />
              <button type="submit">{arrowIcon}</button>
            </div>
            <input
              type="checkbox"
              name="showFollowing"
              id="showFollowing"
              value="on"
            />
            <label htmlFor="showFollowing" style={{display: "inline-block", marginLeft: "1ex", marginTop: "1ex"}}>Include those who you already follow</label>
          </form>
        </div>

        {hasData && (
          <div className="profiles">
            {data.map((profile) => (
              <div className="profile" key={profile.body.id}>
                <div className="profile__main">
                  <a href={`farcaster://profiles/${profile.body.id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.body?.avatarUrl}
                      alt=""
                      width={48}
                      height={48}
                    />
                  </a>
                  <div className="name-meta">
                    <a href={`farcaster://profiles/${profile.body.id}`}>
                      {profile.body.displayName}
                    </a>
                    <a
                      href={`farcaster://profiles/${profile.body.id}`}
                      className="username"
                    >
                      @{profile.body?.username}
                    </a>
                  </div>
                  {profile.followsYou && <div><p className='isFollowed'>Follows you</p></div>}
                  {profile.youFollow && <div><p className='isFollowed'>Following</p></div>}
                </div>
                <p>{profile.body?.bio}</p>
              </div>
            ))}
          </div>
        )
        }
      </Container >

      {data.length > 10 && <Footer />}

      < style jsx > {`
        .header {
          display: flex;
          flex-direction: column;
          padding: 3rem 0 2rem;
        }

        .isFollowed {
          width: 150px;
          margin: 0 auto;
          display: inline;

          gap: 0rem;
          padding: 0.1rem 0.4rem;
          border-radius: 0.3rem;
          background-color: #413656;
        }

        .input-wrapper {
          display: flex;
          background-color: #4d4063;
          border-radius: 2.5rem;
          justify-content: space-between;
          border: 1px solid #6f6581;
          position: relative;
          padding-right: 2.25rem;
          overflow: hidden;

          input {
            background: transparent;
            color: #eee4ff;
            outline: none;
            font-size: 1rem;
            padding: 0.25rem 1rem;

            &::placeholder {
              color: #eee4ff;
              opacity: 0.4;
            }
          }

          button {
            --size: 2.5rem;

            position: absolute;
            width: fit-content;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: var(--size);
            height: var(--size);
            padding: 0.5rem;
            line-height: 0;
            border-radius: 5rem;
            opacity: 1;
            transition: opacity 0.1s ease-in-out;

            &:hover,
            &:focus-visible {
              opacity: 0.85;
            }
          }
        }

        .profiles {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid #6f588b;

          img {
            object-fit: cover;
            border-radius: 0.25rem;
          }

          p {
            color: rgba(255, 255, 255, 0.8);
          }

          a {
            color: inherit;
          }
        }

        .profile__main {
          display: flex;
          gap: 0.6rem;
          width: 100%;
        }

        .name-meta {
          display: flex;
          flex-direction: column;

          .username {
            font-size: 0.875rem;
            opacity: 0.5;
          }
        }
      `}</style >
    </>
  )
}

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')

  const data = await searchProfiles(query)

  return {
    props: {
      data,
      query,
    },
  }
}
