import Link from 'next/link'
import { COOL_SITE_NAME } from '../lib/constants'

const Header = () => {
  return (
    <h2 className="mt-8 mb-20 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
      <Link href="/">
        <a className="hover:underline">{COOL_SITE_NAME}</a>
      </Link>
      .
    </h2>
  )
}

export default Header
