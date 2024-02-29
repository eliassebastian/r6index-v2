import { ResponsiveSunburst } from '@nivo/sunburst';
import { normaliseMapTitle } from '~/lib/maps';

function generateSunburstData(rawData: any) {
	// Collect all parent and respective child nodes
	const maps = [];

	for (const mapData of rawData) {
		// Construct the children nodes for each map
		const roundsPlayedNode = {
			id: `${mapData.name}:won:${((mapData.roundsWon / mapData.roundsPlayed) * 100).toFixed(2)}`,
			color: '#63706b',
			value: mapData.roundsWon,
		};

		const roundsLostNode = {
			id: `${mapData.name}:lost:${((mapData.roundsLost / mapData.roundsPlayed) * 100).toFixed(2)}`,
			color: '#ad7f58',
			value: mapData.roundsLost,
		};

		const mapNode = {
			id: mapData.name,
			children: [roundsPlayedNode, roundsLostNode],
		};

		maps.push(mapNode);
	}

	return {
		id: 'maps',
		children: maps,
	};
}

interface Props {
	rawData: any;
}

export const PlayerMapsSunburstChart = ({ rawData }: Props) => {
	const data = generateSunburstData(rawData);

	return (
		<ResponsiveSunburst
			data={data}
			margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
			borderColor='#4f5a57'
			colors={[
				'hsl(159, 0%, 21%)',
				'hsl(159, 0%, 31%)',
				'hsl(159, 7%, 41%)',
				'hsl(159, 17%, 51%)',
				'hsl(159, 27%, 61%)',
			]}
			childColor={(parent, child) => {
				// @ts-ignore
				return child.data.color;
			}}
			tooltip={(props) => {
				if (props.depth === 1) {
					return (
						<div className='bg-accent-6 p-2 rounded-lg text-xs text-accent-12'>
							{normaliseMapTitle(props.id.toString())} - {props.value} Rounds Played
						</div>
					);
				}

				const split = props.id.toString().split(':');
				const mapName = normaliseMapTitle(split[0]);
				const type = split[1] === 'won' ? 'Rounds Won' : 'Rounds Lost';
				const percent = split[2];

				return (
					<div className='bg-accent-6 p-2 rounded-lg text-xs text-accent-12'>
						{mapName} - {percent}% {type}
					</div>
				);
			}}
			enableArcLabels={false}
			animate={false}
			arcLabelsSkipAngle={27}
			arcLabelsTextColor={{
				from: 'color',
				modifiers: [['darker', 1.4]],
			}}
		/>
	);
};
