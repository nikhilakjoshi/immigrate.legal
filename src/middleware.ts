import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Add any additional logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cases/:path*",
    "/clients/:path*",
    "/documents/:path*",
    "/templates/:path*",
    "/calendar/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
