import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import PostTitle from './post-title'
import Author from '../types/author'
import Tag from './tag'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
  tags?: string[]
}

const PostHeader = ({ title, coverImage, date, author, tags }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="flex items-center mb-4 space-x-4">
        {tags?.map(t => <Tag key={t} name={t} />)}
      </div>
      <div className="hidden pl-5 border-l-2 border-black md:block md:mb-12">
        <div className="mb-4">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <DateFormatter dateString={date} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block mb-6 md:hidden">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="mb-6 text-lg md:hidden">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  )
}

export default PostHeader
