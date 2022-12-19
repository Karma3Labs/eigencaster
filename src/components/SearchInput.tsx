import { useEffect, useState } from 'react'
import { usePlausible } from 'next-plausible'
import { useRouter } from 'next/router'
import { useStorage } from '../hooks/useLocalStorage'

import { arrowIcon } from '../assets/icons'

type SearchInputProps = {
  size: 'lg' | undefined
}

export type SearchQuery = {
  address: string
}

export default function SearchInput({ size, ...props }: SearchInputProps) {
  const router = useRouter()
  const { getItem } = useStorage()
  const [mounted, setMounted] = useState<boolean>(false)
  const [basicText, setBasicText] = useState<string>('')
  const [sessionQuery, setSessionQuery] = useState<SearchQuery | undefined>()

  useEffect(() => {
    const searchSession = getItem('search-query', 'session')
    if (searchSession) {
      const _sessionQuery: SearchQuery = JSON.parse(searchSession)
      setBasicText(_sessionQuery.address)
      setSessionQuery(_sessionQuery)
    } else {
      const searchParams = router.query as unknown as SearchQuery
      setSessionQuery(searchParams)
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleFormSubmit(e: any) {
    e.preventDefault()
    let query: SearchQuery = {
      address: e.target!.text?.value,
    }

    router.push(`/profiles?address=${query.address}`)
  }

  return (
    <>
      <form onSubmit={(e) => handleFormSubmit(e)} {...props}>
          <div className="input-wrapper">
            <input
              type="text"
              name="text"
              placeholder={mounted ? 'Enter your farcaster address' : ''}
              defaultValue={sessionQuery?.address || ''}
              onChange={(e) => setBasicText(e.target.value)}
            />
            <input type="hidden" name="username" />
            <button type="submit">{arrowIcon}</button>
          </div>
      </form>

      <style jsx>{`
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
            font-size: ${size === 'lg' ? '1.25rem' : '1rem'};
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

        .checkbox {
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 0.875rem;
          border-radius: 0.25rem;
          background-color: #5e5278;
          overflow: hidden;

          :checked::after {
            content: '✓';
            color: #fff;
            transform: translate(0.03125rem, -0.0625rem);
          }
        }
      `}</style>
    </>
  )
}
