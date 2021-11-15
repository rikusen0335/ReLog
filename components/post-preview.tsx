import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'
import Author from '../types/author'
import React from 'react'
import Tag from './tag'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
  tags?: string[]
}

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  tags,
}: Props) => {
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <h3 className="mb-3 text-3xl leading-snug dark:text-light-50">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <p className="mb-4 text-base leading-relaxed dark:text-light-300">{excerpt}</p>
      <div className="flex items-center mb-4">
        <div className="block mr-4 md:hidden">
          <DateFormatter dateString={date} />
        </div>
        {tags?.map(t => <Tag className="mr-4" key={t} name={t} />)}
      </div>
      <div className="flex items-center">
        <Avatar name={author.name} picture={author.picture} />
        <p className="hidden mx-2 md:block dark:text-light-600">//</p>
        <div className="hidden md:block">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </div>
  )
}

export default PostPreview
