import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Create Account — HELIX 3D Studio',
  description: 'Create your HELIX account and start placing 3D printing orders.',
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
