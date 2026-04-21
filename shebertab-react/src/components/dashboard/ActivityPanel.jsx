import { Calendar, Mail, Phone, FileText, CheckCircle } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'interview',
    icon: Calendar,
    title: 'Interview with Stripe',
    description: 'Technical round scheduled',
    time: 'Tomorrow, 2:00 PM',
    highlight: true,
  },
  {
    id: 2,
    type: 'email',
    icon: Mail,
    title: 'Email from Notion',
    description: 'Offer letter received',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'call',
    icon: Phone,
    title: 'Call with Linear recruiter',
    description: 'Initial screening completed',
    time: 'Yesterday',
  },
  {
    id: 4,
    type: 'application',
    icon: FileText,
    title: 'Applied to GitHub',
    description: 'Senior Software Engineer',
    time: '2 days ago',
  },
  {
    id: 5,
    type: 'status',
    icon: CheckCircle,
    title: 'Atlassian status update',
    description: 'Moved to phone screen',
    time: '3 days ago',
  },
]

const upcomingEvents = [
  {
    id: 1,
    company: 'Stripe',
    type: 'Technical Interview',
    date: 'Jan 22',
    time: '2:00 PM',
  },
  {
    id: 2,
    company: 'Linear',
    type: 'System Design',
    date: 'Jan 24',
    time: '10:00 AM',
  },
  {
    id: 3,
    company: 'Notion',
    type: 'Final Round',
    date: 'Jan 26',
    time: '3:00 PM',
  },
]

export default function ActivityPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Recent Activity */}
      <div className="rounded-sm border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest updates on your applications</p>
        </div>
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div key={activity.id} className={`flex gap-3 px-5 py-3 ${activity.highlight ? 'bg-primary-muted/50' : ''}`}>
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm ${activity.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-5 py-3">
          <button className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
            View all activity
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-sm border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Upcoming Events</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Scheduled interviews and calls</p>
        </div>
        <div className="divide-y divide-border">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-sm bg-muted">
                <span className="text-xs font-medium text-muted-foreground">{event.date.split(' ')[0]}</span>
                <span className="text-sm font-semibold text-foreground">{event.date.split(' ')[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{event.company}</p>
                <p className="text-xs text-muted-foreground">{event.type}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center rounded-sm bg-primary-muted px-2 py-1 text-xs font-medium text-primary">
                  {event.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-5 py-3">
          <button className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
            View calendar
          </button>
        </div>
      </div>
    </div>
  )
}
