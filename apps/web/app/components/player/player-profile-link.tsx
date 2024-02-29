import { Link } from '@remix-run/react';

interface Props {
	id: string;
	section?: string;
}

export const PlayerProfileLink = (props: Props) => {
	return (
		<Link
			to={`/player/${props.id}${props.section ?? ''}`}
			className='flex items-center justify-center bg-accent-3 hover:bg-accent-4 border-[0.5px] transition-colors border-accent-7 cursor-default hover:border-accent-8 text-accent-12 px-2.5 py-1.5 rounded-lg gap-2 text-sm outline outline-0 focus:outline-2 outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2'
		>
			{/* <div className="relative bg-accent-4 size-4 overflow-hidden rounded-[calc(8px-6px)] aspect-square">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={`https://ubisoft-avatars.akamaized.net/${props.id}/default_146_146.png`}
          alt={"user profile icon"}
          sizes="33vw"
        />
      </div> */}
			<span>Visit Full Profile</span>
		</Link>
	);
};
