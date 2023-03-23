import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const sessionPassword = process.env.SESSION_PASSWORD;

  if (!sessionPassword) {
    throw new Error("SESSION_PASSWORD is not defined.");
  }

  const session = await getIronSession(req, res, {
    cookieName: "frenstr",
    password: sessionPassword,
  });

  // @ts-ignore
  let isTryingToAccessProtectedEndpoint = false;

  const isAuthorized = () => {
    for (const s in ["description", "noost"]) {
      if (req.nextUrl.pathname.includes(s)) {
        isTryingToAccessProtectedEndpoint = true;
        break;
      }
    }

    // @ts-ignore
    return isTryingToAccessProtectedEndpoint && session.authorized === true;
  };

  if (!isAuthorized()) {
    return new NextResponse(
      JSON.stringify({
        isTryingToAccessProtectedEndpoint,
        pathname: req.nextUrl.pathname,
      }),
      { status: 403 }
    );
  }

  // @ts-ignore
  session.authorized = true;
  await session.save();

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
