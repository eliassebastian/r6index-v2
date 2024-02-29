import { pgClient } from '@r6index/db/client';
import { ActionFunctionArgs, LoaderFunctionArgs, defer, json, redirect } from '@remix-run/cloudflare';
import { Await, useLoaderData, useSearchParams } from '@remix-run/react';
import { Suspense } from 'react';
import { minLength, object, parse, string, value } from 'valibot';
import { SearchLoadingSkeleton } from '~/components/search/search-loading-skeleton';
import { SearchMenuDialog } from '~/components/search/search-menu-dialog';
import { SearchResults } from '~/components/search/search-results';
import { Button } from '~/components/shared/Button';
import { getPlayerByName } from '~/lib/players/index.server';
import { getPlayersWithFullTextSearch } from '~/services/players/index.server';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const env = context.cloudflare.env;
	const url = new URL(request.url);
	const query = url.searchParams.get('q') ?? '';

	// validate query
	if (query.length < 3) {
		return redirect('/');
	}

	try {
		const dbClient = await pgClient(env.SUPABASE_URL);
		const players = getPlayersWithFullTextSearch(query, dbClient);

		return defer({ data: players });
	} catch {
		return json({ data: null, error: 'Something went wrong' });
	}
};

const actionFormDataSchema = object({
	intent: string([value('force-search')]),
	user: string([value('')]),
	query: string([minLength(3)]),
});

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const env = context.cloudflare.env;
	const url = new URL(request.url);
	const query = url.searchParams.get('q') ?? '';
	const formData = await request.formData();

	try {
		const validatedFormData = parse(actionFormDataSchema, {
			query,
			intent: String(formData.get('intent')),
			user: String(formData.get('user')),
		});

		const player = await getPlayerByName(validatedFormData.query, env);
		if (!player) {
			return json({ ok: false, error: 'Player not found' });
		}

		return redirect(`/player/${player}`);
	} catch (error) {
		return json({ ok: false, error: 'Something went wrong' });
	}
};

export default function SearchRoute() {
	const { data } = useLoaderData<typeof loader>();
	const [searchParams] = useSearchParams();
	const query = searchParams.get('q') ?? '';

	return (
		<div className='min-h-dvh max-w-6xl mx-auto px-4'>
			<div className='sticky top-0 z-10 bg-accent-1 py-4 lg:pt-20 flex flex-col gap-4'>
				<div className=''>
					<h1 className='text-accent-12 text-xl'>Search Results for '{query}'</h1>
					<Suspense fallback={<p className='text-accent-11 text-sm animate-pulse'>Searching...</p>}>
						<Await resolve={data}>
							{(data) => (
								<p className='text-accent-11 text-sm'>
									{data?.length} {data?.length === 1 ? 'player' : 'players'} found
								</p>
							)}
						</Await>
					</Suspense>
				</div>
				<SearchMenuDialog defaultValue='query'>
					{(handleOpen) => (
						<Button
							className={
								'w-full lg:w-2/3 h-10 pl-3 pr-2 gap-2 flex bg-accent-2 items-center border border-accent-7 hover:border-accent-8 rounded-lg z-0'
							}
							onPress={() => handleOpen(true)}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								width='14'
								height='14'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='text-accent-11'
							>
								<title>Search Icon</title>
								<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
							</svg>
							<h2 className='text-accent-11 grow text-left'>{query}</h2>
							<kbd className='bg-transparent border border-accent-7 rounded-[calc(8px-4px)] px-1 hidden lg:flex items-center justify-center'>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='19' viewBox='0 0 25 24' fill='none'>
									<title>Command K Icon</title>
									<path
										d='M5.16667 13.8333H3.33333C2.32081 13.8333 1.5 14.6541 1.5 15.6667C1.5 16.6792 2.32081 17.5 3.33333 17.5C4.34585 17.5 5.16667 16.6792 5.16667 15.6667V13.8333ZM5.16667 13.8333H8.83333M5.16667 13.8333V10.1667M8.83333 13.8333H10.6667C11.6792 13.8333 12.5 14.6541 12.5 15.6667C12.5 16.6792 11.6792 17.5 10.6667 17.5C9.65415 17.5 8.83333 16.6792 8.83333 15.6667V13.8333ZM8.83333 13.8333V10.1667M8.83333 10.1667V8.33333C8.83333 7.32081 9.65415 6.5 10.6667 6.5C11.6792 6.5 12.5 7.32081 12.5 8.33333C12.5 9.34585 11.6792 10.1667 10.6667 10.1667H8.83333ZM8.83333 10.1667H5.16667M5.16667 10.1667H3.33333C2.32081 10.1667 1.5 9.34585 1.5 8.33333C1.5 7.32081 2.32081 6.5 3.33333 6.5C4.34585 6.5 5.16667 7.32081 5.16667 8.33333V10.1667ZM16.5 6.5V14M16.5 14V17.5M16.5 14L18.5413 11.9587M18.5413 11.9587L23.4222 6.5M18.5413 11.9587C20.8098 12.9412 22.5645 14.8271 23.3811 17.1604L23.5 17.5'
										stroke='currentcolor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</kbd>
						</Button>
					)}
				</SearchMenuDialog>
			</div>
			<Suspense fallback={<SearchLoadingSkeleton />}>
				<Await resolve={data}>{(data) => <SearchResults key={query} data={data} />}</Await>
			</Suspense>
		</div>
	);
}
