import Link from "next/link";
import { VFC } from "react";
import Work from '../types/work'

type Prop = {
    work: Work
}

export const WorkCard: VFC<Prop> = ({ work: { slug, title, subtitle, introduction, used, thumbnail } }) => {
    return (
        <Link href={`/works/${slug}`}>
            <div className="relative h-[500px] dark:brightness-[90%] group hover:cursor-pointer transition duration-150">
                <img src={thumbnail} className="h-[500px] w-full object-cover group-hover:brightness-[30%] group-hover:grayscale-[0.4] ease-out transition duration-150" />
                <div className="absolute inset-0 flex-col hidden p-16 transition duration-150 group-hover:flex">
                    <p className="text-4xl font-bold text-light-100">{title}</p>
                    <p className="mt-1 text-xl font-bold text-light-200">{subtitle}</p>
                    <p className="mt-6 text-light-100">{introduction}</p>
                    <div className="flex mt-4 space-x-4">
                        {used.map((name, idx) => <p key={idx} className="text-light-300">{name}</p>)}
                    </div>
                    <p className="mt-auto text-lg font-bold text-center text-light-300">クリックしてもっと見る</p>
                </div>
            </div>
        </Link>
    )
}
