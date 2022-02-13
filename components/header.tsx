import Link from 'next/link'
import { VFC } from 'react'
import { COOL_SITE_NAME } from '../lib/constants'

type Props = {
  continuedText?: string
}

const Header: VFC<Props> = ({ continuedText = "" }) => {
  return (
    <h2 className="mt-8 mb-20 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter dark:text-light-100">
      <Link href="/">
        <a className="hover:underline">{COOL_SITE_NAME + continuedText}</a>
      </Link>
      .
    </h2>
  )
}

export default Header
