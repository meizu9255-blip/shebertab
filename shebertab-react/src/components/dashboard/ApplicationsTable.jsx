import { MoreHorizontal, ExternalLink, ArrowUpDown } from 'lucide-react'

const applications = [
  {
    id: 1,
    company: 'Stripe',
    position: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    salary: '$180k - $220k',
    status: 'Interview',
    appliedDate: '2024-01-15',
    lastActivity: '2 days ago',
  },
  {
    id: 2,
    company: 'Vercel',
    position: 'Full Stack Developer',
    location: 'Remote',
    salary: '$150k - $190k',
    status: 'Applied',
    appliedDate: '2024-01-14',
    lastActivity: '3 days ago',
  },
  {
    id: 3,
    company: 'Linear',
    position: 'Product Engineer',
    location: 'Remote',
    salary: '$160k - $200k',
    status: 'Phone Screen',
    appliedDate: '2024-01-12',
    lastActivity: '5 days ago',
  },
  {
    id: 4,
    company: 'Notion',
    position: 'Software Engineer',
    location: 'New York, NY',
    salary: '$170k - $210k',
    status: 'Offer',
    appliedDate: '2024-01-10',
    lastActivity: '1 day ago',
  },
  {
    id: 5,
    company: 'Figma',
    position: 'Frontend Developer',
    location: 'San Francisco, CA',
    salary: '$165k - $195k',
    status: 'Rejected',
    appliedDate: '2024-01-08',
    lastActivity: '1 week ago',
  },
  {
    id: 6,
    company: 'GitHub',
    position: 'Senior Software Engineer',
    location: 'Remote',
    salary: '$175k - $215k',
    status: 'Applied',
    appliedDate: '2024-01-18',
    lastActivity: '1 day ago',
  },
  {
    id: 7,
    company: 'Atlassian',
    position: 'Staff Engineer',
    location: 'Sydney, Australia',
    salary: '$190k - $230k',
    status: 'Phone Screen',
    appliedDate: '2024-01-16',
    lastActivity: '2 days ago',
  },
]

const statusStyles = {
  Applied: 'bg-muted text-muted-foreground',
  'Phone Screen': 'bg-primary-muted text-primary',
  Interview: 'bg-warning-muted text-warning',
  Offer: 'bg-success-muted text-success',
  Rejected: 'bg-destructive-muted text-destructive',
}

export default function ApplicationsTable() {
  return (
    <div className="rounded-sm border border-border bg-card">
      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Track and manage your job applications</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-8 rounded-sm border border-border bg-background px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option>All Status</option>
            <option>Applied</option>
            <option>Phone Screen</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <button className="h-8 rounded-sm border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  Company
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Position</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Salary</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
                  Applied
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-muted text-xs font-semibold text-muted-foreground">
                      {app.company.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{app.company}</p>
                      <p className="text-xs text-muted-foreground">{app.lastActivity}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{app.position}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{app.location}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-foreground">{app.salary}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${statusStyles[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{app.appliedDate}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-sm hover:bg-muted transition-colors">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-sm hover:bg-muted transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">7</span> of <span className="font-medium text-foreground">47</span> results
        </p>
        <div className="flex items-center gap-1">
          <button className="flex h-8 items-center justify-center rounded-sm border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 transition-colors" disabled>
            Previous
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-xs font-medium text-primary-foreground">
            1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            3
          </button>
          <button className="flex h-8 items-center justify-center rounded-sm border border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
