import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Sign In — FORMIQ 3D Print Studio',
  description: 'Sign in to your FORMIQ account to manage your 3D printing orders.',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
