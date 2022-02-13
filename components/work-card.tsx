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
                <img src="https://picsum.photos/800/1000" className="h-[500px] w-full object-cover group-hover:brightness-[40%] group-hover:grayscale-[0.4] transition duration-150" />
                <div className="absolute inset-0 hidden group-hover:flex flex-col transition duration-150 p-16">
                    <p className="text-light-100 font-bold text-4xl">{title}</p>
                    <p className="text-light-200 font-bold text-xl mt-1">{subtitle}</p>
                    <p className="text-light-200 mt-6">{introduction}</p>
                    <div className="flex space-x-4 mt-4">
                        {used.map((name) => <p className="text-light-500">{name}</p>)}
                    </div>
                    <p className="text-light-300 font-bold text-lg mt-auto text-center">クリックしてもっと見る</p>
                </div>
            </div>
        </Link>
    )
}
