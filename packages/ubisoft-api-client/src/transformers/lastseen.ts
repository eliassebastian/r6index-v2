export const transform = (data: any) => {
	return (
		data.seasons_player_skill_records[0].regions_player_skill_records[0].boards_player_skill_records[0]
			.players_skill_records[0].update_time ?? null
	);
};
