import { auth } from "@/lib/auth"

export const config = {
  matcher: ["/(dashboard|admin|profile|settings|my-pc|upgrade-planner|ai|history)/:path*"],
}

export default auth
