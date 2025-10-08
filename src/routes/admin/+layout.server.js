import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  const { pathname } = url;
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

 
  if (isAuthPage) {

   /* if (pathname === '/admin/register' && (!locals.user || locals.user.email !== 'nedxha19@htl-shkoder.com')) {
      throw redirect(302, '/admin/login');
    } 
    */
 
    if (pathname === '/admin/login' && locals.user) {
      throw redirect(302, '/admin/propertySystem');
    }
    return {};
  }

  // All other admin pages require authentication
  if (!locals.user) throw redirect(302, '/admin/login');
  return { user: locals.user };
}