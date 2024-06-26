import Link from "next/link";
import React from "react";
import type Author from "../types/author";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import Tag from "./tag";

type Props = {
	title: string;
	coverImage: string;
	date: string;
	excerpt: string;
	author: Author;
	slug: string;
	tags?: string[];
};

const HeroPost = ({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug,
	tags,
}: Props) => {
	return (
		<section>
			<div className="mb-4 md:mb-10">
				<CoverImage
					title={title}
					src={coverImage}
					slug={slug}
					className="w-full"
					isTopHero
				/>
			</div>
			<div className="mb-24 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 md:mb-28">
				<div>
					<h3 className="mb-8 text-4xl leading-tight md:mb-4 lg:text-4xl dark:text-light-50">
						<Link as={`/posts/${slug}`} href="/posts/[slug]">
							<span className="hover:underline">{title}</span>
						</Link>
					</h3>
					<div className="flex items-center mb-4 text-lg md:mb-0">
						<DateFormatter dateString={date} />
						<div className="flex items-center ml-5 space-x-4">
							{tags?.map((t) => (
								<Tag key={t} name={t} />
							))}
						</div>
					</div>
				</div>
				<div>
					<p className="mb-4 text-base leading-relaxed md:text-lg dark:text-light-300">
						{excerpt}
					</p>
					<Avatar name={author.name} picture={author.picture} />
				</div>
			</div>
		</section>
	);
};

export default HeroPost;
