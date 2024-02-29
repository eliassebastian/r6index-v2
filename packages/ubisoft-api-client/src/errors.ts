type ErrorName = 'UbisoftServiceError';

export class UbisoftServiceError extends Error {
	name: ErrorName;
	message: string;
	cause: any;

	constructor({ name, message, cause }: { name: ErrorName; message: string; cause?: any }) {
		super();
		this.message = message;
		this.name = name;
		this.cause = cause;
	}
}
