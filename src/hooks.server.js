import { building } from '$app/environment'; // <---- here
import dotenv from 'dotenv';
import { SvelteKitAuth } from "@auth/sveltekit"
import Authentik from "@auth/core/providers/authentik"

const runAllTheInitFunctions = async () => {
  console.log("init");
  dotenv.config();
}

if (!building) {                             // <---- here
  await runAllTheInitFunctions();
}

export const handle = SvelteKitAuth({
  providers: [Authentik({
    clientId: process.env.AUTHENTIK_CLIENT_ID,
    clientSecret: process.env.AUTHENTIK_CLIENT_SECRET,
    issuer: "https://auth.followthrough.cloud/application/o/followthroughapi/"
  })
  ],
  secret: process.env.SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {

      if (account) {
        const token = {
          access_token: account.access_token,
          // @ts-ignore
          expires_at: Math.floor(Date.now() / 1000 + account.expires_in) * 1000,
          // @ts-ignore
          expires_at_date: new Date(Math.floor(Date.now() / 1000 + account.expires_in) * 1000),

          refresh_token: account.refresh_token,
        }
        //console.log("account", account, token);
        return token
        //@ts-ignore
      } else if (Date.now() < token.expires_at) {
        console.log("not expired");       
        //@ts-ignore
      } else if (token && Date.now() >= token.expires_at) {
        console.log("refresh");
        //console.log("token", token);


        try {
          // @ts-ignore
          const body = new URLSearchParams({
            client_id: process.env.AUTHENTIK_CLIENT_ID,
            client_secret: process.env.AUTHENTIK_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          });

          const response = await fetch("https://auth.followthrough.cloud/application/o/token/", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            method: "POST",
          })

          const tokens = await response.json()
          //console.log("tokens", tokens);
          if (!response.ok) throw tokens
          const returntoken = {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in) * 1000,
            expires_at_date: new Date(Math.floor(Date.now()/1000 + tokens.expires_in) * 1000),
            refresh_token: tokens.refresh_token,
          }
          //console.log("returntoken", returntoken);
          return returntoken
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      if (session) {
        session = Object.assign({}, session, { access_token: token.access_token, refresh_token: token.refresh_token })
      }
      return session
    },
  },
})
