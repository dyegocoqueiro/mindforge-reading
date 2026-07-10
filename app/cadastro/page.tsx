import type { Metadata } from "next";
import { AuthPage } from "../../src/components/auth-page";
export const metadata: Metadata = { title: "Criar conta" };
export default function SignupPage() { return <AuthPage mode="signup" title="Crie seu ponto de partida" description="Leva menos de dois minutos. Depois, você escolhe seus objetivos." />; }
