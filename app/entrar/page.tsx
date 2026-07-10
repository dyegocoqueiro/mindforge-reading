import type { Metadata } from "next";
import { AuthPage } from "../../src/components/auth-page";
export const metadata: Metadata = { title: "Entrar" };
export default function LoginPage() { return <AuthPage mode="login" title="Boas-vindas de volta" description="Entre para continuar seu plano de leitura." />; }
