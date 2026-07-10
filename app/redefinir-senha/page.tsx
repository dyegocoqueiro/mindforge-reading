import { AuthPage } from "../../src/components/auth-page";
import { ResetPasswordForm } from "../../src/components/reset-password-form";

export default function ResetPasswordPage() {
  return <AuthPage title="Defina uma nova senha" description="Escolha uma senha segura para recuperar o acesso."><ResetPasswordForm /></AuthPage>;
}
