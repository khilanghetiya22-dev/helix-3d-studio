import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Sign In — HELIX 3D Studio',
  description: 'Sign in to your HELIX account to manage your 3D printing orders.',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
