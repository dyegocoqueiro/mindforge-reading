import type { Metadata } from "next";
import { AuthPage } from "../../src/components/auth-page";
export const metadata: Metadata = { title: "Recuperar senha" };
export default function RecoverPage() { return <AuthPage mode="recover" title="Recupere seu acesso" description="Enviaremos um link seguro para redefinir sua senha." />; }
