import { CookieKeys } from '@/lib/constants';
import { cookies } from '@/lib/helpers/cookies';

export default () => {
	const session = cookies.get(CookieKeys.Session);
	const user = session ? JSON.parse(session) : null;

	return (
		<div style={{ color: 'var(--white-color)' }}>
			<h1>Home page!</h1>

			<div
				style={{
					display: 'flex',
					'align-items': 'center',
					gap: '1rem',
					margin: '1rem 0',
				}}
			>
				<img
					src={user?.avatar?.original_url}
					alt="User avatar"
					width="42"
					height="42"
					style={{
						'border-radius': '100%',
						'object-fit': 'cover',
						'object-position': 'center',
					}}
				/>
				<div>
					<strong>{user?.nickname}</strong>
					<br />
					<small>{user?.email}</small>
				</div>
			</div>

			<pre
				style={{
					background: 'var(--grey-800-color)',
					padding: '1rem',
					'border-radius': '0.5rem',
					'max-width': '400px',
					overflow: 'auto',
				}}
			>
				<code>{JSON.stringify(user, null, 2)}</code>
			</pre>
		</div>
	);
};
