import Link from 'next/link'
import Container from './Container'

export default function Footer({ includeTime = false }) {
  return (
    <>
      <Container size="full">
        <div className="footer">
          <div className="footer-links footer__left">
            <p>{includeTime ? 'Updates every  minutes' : 'Eigencaster'}</p>
          </div>
          <div className="footer-links footer__right">
            <p>Inspired from</p>
            <a
              className="footer-link"
              href="https://github.com/gskril/searchcaster"
              target="_blank"
              rel="noreferrer"
            >
              Searchcaster
            </a>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          padding-top: 1.25rem;
          padding-bottom: 0.25rem;
          align-items: center;
          color: #9584a7;

          &-links {
            display: flex;
            gap: 0.3rem;
          }

          &__left {
            opacity: 0.5;
          }

          &__right {
            padding-top: 25px;
          }

          @media (min-width: 768px) {
            gap: 2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            flex-direction: row;
            justify-content: space-between;

            &__left {
              opacity: 1;
            }
          }

          a {
            color: #e3e1de;

            &:hover,
            &:focus-visible {
              color: #af9ec1;
            }
          }
        }
      `}</style>
    </>
  )
}
