import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <ul>
            <li><a href="/dashboard/">Home</a></li>
            <li><a href="/dashboard/settings">Settings</a></li>
            <li><a href="/dashboard/network">Network</a></li>
          </ul>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
