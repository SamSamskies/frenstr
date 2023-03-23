// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const isHostWhitelisted = () => {
    for (const host of ["frenstr.com", "www.frenstr.com", "localhost:3000"]) {
      if (
        req.headers.get("host") === host ||
        req.headers.get("host")?.endsWith("-samsamskies.vercel.app")
      ) {
        return true;
      }
    }

    return false;
  };

  // TODO: implement a better way to lock endpoints down
  if (!isHostWhitelisted()) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
