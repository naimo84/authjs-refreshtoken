
/** @type {import('./$types').LayoutServerLoad} */
export const load = async (event) => {
  const session = await event.locals.getSession()
  console.log('session', session);
  return {
    session
  }
}