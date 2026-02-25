import type { XNext, XRequest } from '@repo/router';

export default async function (
  request: XRequest,
  next: XNext
): Promise<Response | void> {
  const { pathname } = new URL(request.url);
  const authenticated = request.cookies.has('token');

  if (pathname.startsWith('/challenge') && !authenticated) {
    console.warn('Unauthenticated user attempted to access a protected route.');
    return Response.redirect('/', 302);
  }

  return next();
}
