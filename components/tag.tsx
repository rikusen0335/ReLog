type Props = {
    name: string;
};

const Tag = ({ name }: Props) => {
    return (
        <div className="inline-flex items-center px-4 py-[4px] border border-gray-200 rounded-3xl">
            <p className="mr-[4px] text-base">#</p>
            <p className="text-lg font-bold">{name}</p>
        </div>
    );
};

export default Tag;