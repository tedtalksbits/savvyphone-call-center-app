import Dashboard from '@/components/dashboard';
import ProtectedPage from '@/components/layout/protected-page';

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <Dashboard />
    </ProtectedPage>
  );
}
