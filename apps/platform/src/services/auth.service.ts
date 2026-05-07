import { CookieKeys } from '@/lib/constants';
import env from '@/lib/env';
import { cookies } from '@/lib/helpers/cookies';

export default {
	async logIn(crendentials: {
		identifier: string;
		password: string;
		rememberMe: boolean;
	}) {
		const url = new URL(
			'/1/auth/local',
			env('API_BASE_URL', 'http://127.0.0.1:8080')
		);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(crendentials),
		});

		if (!response.ok) {
			throw new Error('Failed to log in');
		}

		const data = await response.json();

		cookies.set(CookieKeys.AccessToken, data.tokens.accessToken, {
			secure: true,
			sameSite: 'Strict',
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
		});
		cookies.set(CookieKeys.RefreshToken, data.tokens.refreshToken, {
			secure: true,
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		});
		cookies.set(CookieKeys.Session, JSON.stringify(data.data), {
			secure: true,
			sameSite: 'Strict',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		});

		if (crendentials.rememberMe) {
			// This usually means setting a longer expiration time for the tokens on the server side, but since we're just storing them in localStorage, we don't need to do anything special here.
		}

		return data;
	},

	async signUp(crendentials: {
		email: string;
		password: string;
		nickname: string;
	}) {
		const url = new URL(
			'/1/auth/signup',
			env('API_BASE_URL', 'http://127.0.0.1:8080')
		);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(crendentials),
		});

		if (!response.ok) {
			throw new Error('Failed to sign up');
		}

		const data = await response.json();

		return data;
	},
} as const;
