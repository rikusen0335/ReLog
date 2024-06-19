import Author from "./author";
import { BundleMDXReturn } from "./bundleMDX";

type PostType = {
	slug: string;
	title: string;
	date: string;
	coverImage: string;
	author: Author;
	excerpt: string;
	ogImage: {
		url: string;
	};
	tags?: string[];
	content: BundleMDXReturn; // TODO: とりあえず
	rawContent: string;
	public: boolean;
};

export default PostType;
