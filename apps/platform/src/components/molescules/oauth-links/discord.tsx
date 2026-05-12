import { createSignal, Show } from 'solid-js';

import Spinner from '@/components/ui/spinner';
import env from '@/lib/env';

import styles from './index.module.css';

export default function DiscordOAuthLink() {
	const [submitting, setSubmitting] = createSignal(false);

	const handleClick = () => {
		setSubmitting(true);

		const oauthUrl = new URL(
			'/1/oauth/discord',
			env('API_BASE_URL', 'http://127.0.0.1:8080')
		);
		window.location.href = oauthUrl.toString();
	};

	return (
		<button
			class={styles.oauthButton}
			data-provider="discord"
			disabled={submitting()}
			on:click={handleClick}
		>
			<Show when={!submitting()} fallback={<Spinner />}>
				<div aria-label="Discord logo"></div>
				Continue with Discord
			</Show>
		</button>
	);
}
