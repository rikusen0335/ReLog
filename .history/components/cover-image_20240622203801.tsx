import cx from "classnames";
import Image from "next/image";
import Link from "next/link";

type Props = {
	title: string;
	src: string;
	slug?: string;
	className?: string;
	isTopHero?: boolean;
};

const CoverImage = ({ title, src, slug, isTopHero, className = "" }: Props) => {
	const image = (
		<div
			className={cx("shadow-small imageContainer", className, {
				"hover:shadow-medium transition-shadow duration-200": slug,
			})}
		>
			<Image
				src={src}
				alt={`Cover Image for ${title}`}
				layout="fill"
				className={isTopHero ? "heroImage" : "image"}
			/>
		</div>
	);
	return (
		<div className="sm:mx-0">
			{slug ? (
				<Link aria-label={title} as={`/posts/${slug}`} href="/posts/[slug]">
					{image}
				</Link>
			) : (
				image
			)}
		</div>
	);
};

export default CoverImage;
