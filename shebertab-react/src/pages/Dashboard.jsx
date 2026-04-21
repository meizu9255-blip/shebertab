import Sidebar from '../components/dashboard/Sidebar'
import Header from '../components/dashboard/Header'
import StatsCards from '../components/dashboard/StatsCards'
import ApplicationsTable from '../components/dashboard/ApplicationsTable'
import ActivityPanel from '../components/dashboard/ActivityPanel'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        <Header />
        
        <main className="px-6 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track your job search progress and manage applications
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <StatsCards />
          </div>

          {/* Applications Table */}
          <div className="mb-6">
            <ApplicationsTable />
          </div>

          {/* Activity and Events */}
          <ActivityPanel />
        </main>
      </div>
    </div>
  )
}
