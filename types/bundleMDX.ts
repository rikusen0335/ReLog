import { Message } from "esbuild";
import matter from "gray-matter";

export type BundleMDXReturn = {
	code: string;
	frontmatter: {
		[key: string]: any;
	};
	errors: Message[];
	matter: matter.GrayMatterFile<any>;
};
