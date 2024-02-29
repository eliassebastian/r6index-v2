import { pgClient } from '@r6index/db/client';
import type { UbisoftCredentials } from '@r6index/shared-types/ubisoft';
import { array, minLength, object, parse, string, uuid } from 'valibot';
import { indexBatch } from './lib/player';
import type { Env } from './types';

const MessageSchema = object({
	id: string([uuid()]),
	similar: array(string([uuid()]), [minLength(1)]),
});

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		if (env.ENVIRONMENT === 'prod') {
			return new Response('invalid request', { status: 405 });
		}

		try {
			// read the request body
			const body = await req.json();

			// validate the request body
			const validatedMessage = parse(MessageSchema, body);
			await env.QUEUE.send(validatedMessage);

			return new Response('Sent message to the queue', { status: 200 });
		} catch (error) {
			console.error('Error parsing request body:', error);
			return new Response('Invalid request body', { status: 400 });
		}
	},

	// the queue handler is invoked when a message is received from the queue.
	async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
		// get rotating Ubisoft credentials from KV
		const kv = await env.KV.get('credentials:ubisoft');
		if (!kv) {
			console.error('Failed to get Ubisoft credentials');
			return;
		}

		const credentials = JSON.parse(kv) as UbisoftCredentials;
		const dbClient = await pgClient(env.SUPABASE_URL);

		// process each message in the batch
		for (const message of batch.messages) {
			try {
				const body = message.body;
				const parsedBody = parse(MessageSchema, body);

				await indexBatch(parsedBody.id, parsedBody.similar, credentials, env, dbClient);
			} catch (error) {
				console.error('Error processing message:', error);
			}
		}
	},
};
