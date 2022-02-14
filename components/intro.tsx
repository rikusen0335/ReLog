import Link from 'next/link'
import { COOL_SITE_NAME } from '../lib/constants'

const Intro = () => {
  return (
    <section className="flex flex-col items-center mt-16 mb-16 lg:flex-row md:mb-12">
      <h1 className="text-6xl font-bold leading-tight tracking-tighter lg:text-8xl lg:pr-8 dark:text-light-100">
        {COOL_SITE_NAME}.
      </h1>
      <div className="ml-auto"></div>
      <Link href="/works"><a className="mt-5 text-xl font-bold text-center hover:underline dark:text-light-300">Works</a></Link>
      <h4 className="mt-5 text-lg text-center lg:text-left lg:pl-8 dark:text-light-300">
        An extremely garbage blog for notes.
      </h4>
    </section>
  )
}

export default Intro
