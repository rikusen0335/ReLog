import { NextPage } from "next";
import Container from "../../components/container";
import Header from "../../components/header";
import Layout from "../../components/layout";
import { WorkCard } from "../../components/work-card";
import { getAllWorks } from "../../lib/api";
import Work from "../../types/work";

type Props = {
	allWorks: Work[];
};

const WorkIndex: NextPage<Props> = ({ allWorks }) => {
	return (
		<Layout>
			<Container>
				<Header continuedText=" The Works" />
			</Container>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				{allWorks.map((work, idx) => (
					<WorkCard key={idx} work={work} />
				))}
			</div>
		</Layout>
	);
};

export const getStaticProps = async () => {
	const allWorks = getAllWorks();

	return {
		props: { allWorks },
	};
};

export default WorkIndex;
