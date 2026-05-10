import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Create Account — FORMIQ 3D Print Studio',
  description: 'Create your FORMIQ account and start placing 3D printing orders.',
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
