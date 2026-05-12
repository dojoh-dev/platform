import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { CookieKeys } from '@/lib/constants';
import { cookies } from '@/lib/helpers/cookies';

import type { JSX } from 'solid-js';

export default (props: { children?: JSX.Element }) => {
	const navigate = useNavigate();

	const unauthorized = cookies.get(CookieKeys.Session) === undefined;

	if (unauthorized) {
		navigate('/', { replace: true });
		return <div>Redirecting...</div>;
	}

	return (
		<Show when={!unauthorized}>
			<section>
				<h1>Layout page!</h1>
				{props.children}
			</section>
		</Show>
	);
};
