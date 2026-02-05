'use server'

import { signOut, signIn } from "@/auth"

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}

export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/dashboard" })
}
