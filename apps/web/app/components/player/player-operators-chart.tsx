import { ResponsiveRadar } from '@nivo/radar';

interface Props {
	data: any;
}

export const PlayerOperatorsRadarChart = ({ data }: Props) => {
	return (
		<ResponsiveRadar
			data={data}
			theme={{
				grid: {
					line: {
						stroke: '#62706b',
						strokeOpacity: 0.7,
						fill: '#62706b',
						fillOpacity: 0.1,
					},
				},
				axis: {
					ticks: {
						text: {
							fill: '#adb5b2',
							fontSize: '12px',
						},
					},
				},
			}}
			keys={['tally']}
			indexBy='role'
			margin={{ top: 65, right: 70, bottom: 65, left: 90 }}
			fillOpacity={0.8}
			gridShape='linear'
			gridLevels={2}
			gridLabelOffset={30}
			enableDots={false}
			colors={['#62706b']}
			blendMode='normal'
			motionConfig='wobbly'
			isInteractive={false}
			gridLabel={(props) => (
				<g transform={`translate(${props.x},${props.y})`}>
					<text className='text-xs' dominantBaseline={'central'} textAnchor={props.anchor} fill='#adb5b2'>
						{props.id} <tspan fill='#eceeed'>{data.find((d: any) => d.role === props.id).tally}</tspan>
					</text>
				</g>
			)}
		/>
	);
};
