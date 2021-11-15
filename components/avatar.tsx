type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-12 h-12 mr-4 rounded-full" alt={name} />
      <div className="text-base font-bold dark:text-light-200">{name}</div>
    </div>
  )
}

export default Avatar
