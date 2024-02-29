import type { UbisoftUrlEnv } from '@r6index/shared-types/ubisoft';

export type Env = UbisoftUrlEnv & {
	KV: KVNamespace;
	DO: DurableObjectNamespace;
	UBISOFT_CLIENT_ID_1: string;
	UBISOFT_CLIENT_PASSWORD_1: string;
	UBISOFT_CLIENT_ID_2: string;
	UBISOFT_CLIENT_PASSWORD_2: string;
	UBISOFT_CLIENT_ID_3: string;
	UBISOFT_CLIENT_PASSWORD_3: string;
	UBISOFT_CLIENT_ID_4: string;
	UBISOFT_CLIENT_PASSWORD_4: string;
};
