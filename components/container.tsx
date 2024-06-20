import type { ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

const Container = ({ children }: Props) => {
	return <div className="container px-4 mx-auto md:px-5">{children}</div>;
};

export default Container;
