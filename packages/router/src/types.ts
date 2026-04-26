export type CookieOptions = {
	expires?: Date;
	path?: string;
	sameSite?: 'strict' | 'lax' | 'none';
	maxAge?: number;
	httpOnly?: boolean;
	secure?: boolean;
	partitioned?: boolean;
};

export interface XRequest extends Request {
	cookies: {
		set(name: string, value: string, options?: CookieOptions): void;
		get(name: string): string | undefined;
		has(name: string): boolean;
	};
}

export type XNext = () => Promise<void>;

export type HeadElement = {
	tag: string;
	attributes?: { [key: string]: string };
	child?: string;
};

export type ComponentMetadata = {
	title: string;
	head?: HeadElement[];
};

export type XMiddleware = (
	request: XRequest,
	next: XNext
) => Promise<Response | void>;

export type XRoute = {
	path: string;
	component: () => Promise<{
		default: () => string;
		metadata?: ComponentMetadata;
	}>;
	children?: XRoute[];
};

export type HistoryMode = {
	type: 'web' | 'hash';
};

export interface RouterOptions {
	routes: XRoute[];
	history?: HistoryMode;
	middleware?: XMiddleware[];
}
