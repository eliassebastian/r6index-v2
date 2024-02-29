import type { Player } from '@r6index/db/schema';

export type ExistingPlayer = Omit<Player, 'createdAt'> & {
	similar:
		| {
				id: string;
				name: string;
				platform: string;
				level: Player['level'];
		  }[]
		| null;
};

export type IndexedPlayer = ExistingPlayer & { indexed: boolean };
