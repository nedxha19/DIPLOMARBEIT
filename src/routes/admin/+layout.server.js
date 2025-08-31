import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  const path = url.pathname;
  const isLogin = path === '/admin/login';
  const isRegister = path === '/admin/register';

  if (isLogin || isRegister) {
    if (isRegister && (!locals.user || locals.user.email !== 'nedxha19@htl-shkoder.com')) throw redirect(302, '/admin/login');
    if (locals.user && isLogin) throw redirect(302, '/admin/propertySystem');
    return {};
  }

  if (!locals.user) throw redirect(302, '/admin/login');
  return { user: locals.user };
}