import Image from "next/image"
import { signIn } from "@/auth"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">OptiJob</h1>
          <p className="text-slate-500">Connectez-vous pour sauvegarder vos CVs</p>
        </div>
        
        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <Button className="w-full flex items-center justify-center gap-2" size="lg">
            <Image 
              src="https://authjs.dev/img/providers/google.svg" 
              alt="Google" 
              width={20} 
              height={20} 
              className="w-5 h-5" 
            />
            Continuer avec Google
          </Button>
        </form>
      </div>
    </div>
  )
}
