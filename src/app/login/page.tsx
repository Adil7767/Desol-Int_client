import { LoginForm } from "@/components/login/LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Car Selling Service - Login",
  description: "Login to submit your car listing",
}

export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <LoginForm />
    </main>
  )
}

