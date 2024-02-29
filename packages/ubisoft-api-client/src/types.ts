export type UbisoftCredentials = {
	ticketV1: string | null;
	sessionV1: string | null;
	expirationV1: string | null;
	ticketV2: string | null;
	sessionV2: string | null;
	expirationV2: string | null;
};

export type Env = {
	UBISOFT_URL: string;
	UBISOFT_APPID: string;
	UBISOFT_NEWAPPID: string;
	UBISOFT_USERAGENT: string;
};
