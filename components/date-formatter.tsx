import { parseISO, format } from "date-fns";

type Props = {
	dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
	const date = parseISO(dateString);
	return (
		<time className="text-base dark:text-light-200" dateTime={dateString}>
			{format(date, "yyyy.MM.dd")}に公開
		</time>
	);
};

export default DateFormatter;
