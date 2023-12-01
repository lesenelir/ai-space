import { authMiddleware } from "@clerk/nextjs"

// The App is fully protected by Clerk.
// This example protects all routes including api/trpc routes.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware.
export default authMiddleware({
  publicRoutes: ['/'],
  async afterAuth(auth, req, res) {
    // if (!auth.userId && !auth.isPublicRoute) {
    //   return redirectToSignIn({ returnBackUrl: req.url })
    // }

    // console.log('🫣 auth.userId', auth.userId)
    // console.log('😏 auth', auth)

  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
