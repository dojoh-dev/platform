import type { XNext, XRequest } from '@repo/router';

export default async function (
  request: XRequest,
  next: XNext
): Promise<Response | void> {
  // const { pathname } = new URL(request.url);
  // const authenticated = request.cookies.has('token');
  // console.log(`Middleware: ${pathname}, authenticated: ${authenticated}`);
  //
  // if (pathname.startsWith('/challenge') && !authenticated) {
  //   console.log('User is not authenticated, redirecting to home page');
  //   return Response.redirect('/', 302);
  // }
  // return next();
}
