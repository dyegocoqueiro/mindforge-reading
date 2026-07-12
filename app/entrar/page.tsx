import type { Metadata } from "next";
import { AuthPage } from "../../src/components/auth-page";
export const metadata: Metadata = { title: "Entrar" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const { next } = await searchParams; return <AuthPage mode="login" redirectTo={next} title="Boas-vindas de volta" description="Entre para continuar seu plano de leitura." />; }
