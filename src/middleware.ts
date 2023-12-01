import { authMiddleware } from "@clerk/nextjs"

/**
 *  This file will be run before every pages router and api routes.
 *
 *  middleware -> pages tsx
 *  middleware -> pages api
 *
 *  when I use Postman to send request to api, it will run this file first.
 */

// This example protects all routes including api/trpc routes.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware.
export default authMiddleware({
  publicRoutes: ['/'],
  // async afterAuth(auth, req, res) {
  //   // When you are in Postman to debug api, it will run this code. So you should comment on it.
  //   if (!auth.userId && !auth.isPublicRoute) {
  //     return redirectToSignIn({ returnBackUrl: req.url })
  //   }
  //   console.log('11', auth.userId, auth.user)
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userId: auth.userId })
  //   }
  //   const response = await fetch('http:localhost:3000/api/auth', options)
  //   const data = await response.json()
  //   // get user data
  //   // data.status & data.user
  //   console.log(data)
  // }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
