export const cookies = {
	set(
		name: string,
		value: string,
		options: {
			days?: number;
			path?: string;
			domain?: string;
			expires?: Date | string;
			maxAge?: number;
			secure?: boolean;
			sameSite?: 'Strict' | 'Lax' | 'None';
			httpOnly?: boolean; // Note: httpOnly cannot be set via JS, but included for completeness
		}
	) {
		let cookieString = `${name}=${encodeURIComponent(value)}`;

		if (options) {
			if (options.expires) {
				const expires =
					options.expires instanceof Date
						? options.expires.toUTCString()
						: options.expires;
				cookieString += `; expires=${expires}`;
			} else if (options.days) {
				const expires = new Date(
					Date.now() + options.days * 864e5
				).toUTCString();
				cookieString += `; expires=${expires}`;
			}
			if (options.maxAge !== undefined) {
				cookieString += `; max-age=${options.maxAge}`;
			}
			if (options.domain) {
				cookieString += `; domain=${options.domain}`;
			}
			if (options.path) {
				cookieString += `; path=${options.path}`;
			} else {
				cookieString += `; path=/`;
			}
			if (options.secure) {
				cookieString += `; secure`;
			}
			if (options.sameSite) {
				cookieString += `; samesite=${options.sameSite}`;
			}
			// httpOnly cannot be set via JS, but included for completeness
		} else {
			cookieString += `; path=/`;
		}

		document.cookie = cookieString;
	},

	get(name: string) {
		const rawContent = document.cookie
			.split('; ')
			.find((cookie) => cookie.startsWith(`${name}=`))
			?.split('=')[1];
		return rawContent ? decodeURIComponent(rawContent) : undefined;
	},
	delete(name: string) {
		this.set(name, '', { expires: new Date(0) });
	},
};
