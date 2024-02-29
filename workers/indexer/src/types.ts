import { UbisoftUrlEnv } from '@r6index/shared-types/ubisoft';

export type Env = UbisoftUrlEnv & {
	KV: KVNamespace;
	QUEUE: Queue;
	SUPABASE_URL: string;
	ENVIRONMENT: string;
};
