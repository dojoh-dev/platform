export class RequestError extends Error {
	status: number;
	statusText: string;
	body: Record<string, unknown>;
	url?: string;
	method?: string;
	response?: unknown;

	constructor({
		status,
		statusText,
		body,
		url,
		method,
		response,
		message,
	}: {
		status: number;
		statusText: string;
		body: Record<string, unknown>;
		url?: string;
		method?: string;
		response?: unknown;
		message?: string;
	}) {
		super(message || `Request failed with status ${status}: ${statusText}`);
		this.name = 'RequestError';

		this.status = status;
		this.statusText = statusText;
		this.body = body;
		this.url = url;
		this.method = method;
		this.response = response;
	}
}
