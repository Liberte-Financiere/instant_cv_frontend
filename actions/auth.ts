'use server'

import { signOut, signIn } from "@/auth"

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}

export async function handleGoogleSignIn(referralCode?: string) {
  // If referral code exists, append it to redirect URL so we can process it after login
  const redirectTo = referralCode 
    ? `/dashboard?ref=${referralCode}` 
    : "/dashboard"
  await signIn("google", { redirectTo })
}
