import { useNavigate } from '@solidjs/router';
import { type JSX, Show } from 'solid-js';

import { CookieKeys } from '@/lib/constants';
import { cookies } from '@/lib/helpers/cookies';

export default (props: { children?: JSX.Element }) => {
  const navigate = useNavigate();

  const unauthorized = cookies.get(CookieKeys.Session) === undefined;

  if (unauthorized) {
    return navigate('/', { replace: true });
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
