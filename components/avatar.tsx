import Image from "next/image";

type Props = {
	name: string;
	picture: string;
};

const Avatar = ({ name, picture }: Props) => {
	return (
		<div className="flex items-center">
			<div className="w-12 h-12 mr-4 rounded-full">
				<Image
					src={picture}
					width={48}
					height={48}
					className="rounded-full"
					alt={name}
				/>
			</div>
			<div className="text-base font-bold dark:text-light-200">{name}</div>
		</div>
	);
};

export default Avatar;
