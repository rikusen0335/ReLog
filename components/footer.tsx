import Container from './container'
import { BLOG_REPOSITORY_URL } from '../lib/constants'

const Footer = () => {
  return (
    <footer className="border-t bg-accent-1 border-accent-2">
      <Container>
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-4xl font-bold leading-tight tracking-tighter text-center lg:text-5xl lg:text-left lg:mb-0 lg:pr-4 lg:w-1/2">
            Here's nothing to write. Please give me an idea.
          </h3>
          <div className="flex flex-col items-center justify-center lg:flex-row lg:pl-4 lg:w-1/2">
            <a
              href={BLOG_REPOSITORY_URL}
              className="mx-3 font-bold hover:underline"
            >
              <p>Dumb codes</p>
              <p>written by rikusen0335</p>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
