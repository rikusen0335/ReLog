type WorkImage = {
    source: string
    alt?: string
}

type WorkType = {
    slug: string
    title: string
    subtitle?: string
    introduction: string
    description: string
    images: WorkImage[]
    thumbnail?: string
    used: string[]
}

export default WorkType
