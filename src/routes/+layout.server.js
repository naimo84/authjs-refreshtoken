// @ts-nocheck
/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
  const session = await event.locals.getSession()
  if (session) {
    //console.log('session', session);
    if (session.sessioncookie) {
      const cookieValue = Buffer.from(session.sessioncookie, 'base64').toString()     
      event.cookies.set("authjs.session-token", cookieValue)
    }
  }
  return {
    session
  }
}