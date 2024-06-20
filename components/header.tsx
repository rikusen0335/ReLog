import Link from "next/link";
import type { VFC } from "react";
import { COOL_SITE_NAME } from "../lib/constants";

type Props = {
	continuedText?: string;
	href?: string;
};

const Header = ({ continuedText = "", href = "/" }: Props) => {
	return (
		<h2 className="mt-8 mb-20 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter dark:text-light-100">
			<Link href={href}>
				<span className="hover:underline">{COOL_SITE_NAME + continuedText}</span>
			</Link>
			.
		</h2>
	);
};

export default Header;
