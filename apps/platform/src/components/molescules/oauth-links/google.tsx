import { createSignal, Show } from 'solid-js';

import Spinner from '@/components/ui/spinner';

import styles from './index.module.css';
import env from '@/lib/env';

export default function GoogleOAuthLink() {
  const [submitting, setSubmitting] = createSignal(false);

  const handleClick = () => {
    setSubmitting(true);

    const oauthUrl = new URL(
      '/1/oauth/github',
      env('API_BASE_URL', 'http://127.0.0.1:8080')
    );
    window.location.href = oauthUrl.toString();
  };

  return (
    <button
      class={styles.oauthButton}
      data-provider="google"
      disabled={submitting()}
      on:click={handleClick}
    >
      <Show when={!submitting()} fallback={<Spinner />}>
        <div aria-label="Google logo"></div>
        Continue with Google
      </Show>
    </button>
  );
}
