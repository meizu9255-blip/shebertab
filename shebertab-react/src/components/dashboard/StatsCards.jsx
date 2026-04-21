import { FileText, Send, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Total Applications',
    value: '47',
    change: '+12%',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'Pending Review',
    value: '18',
    change: '-3%',
    changeType: 'negative',
    icon: Clock,
  },
  {
    name: 'Interviews Scheduled',
    value: '6',
    change: '+2',
    changeType: 'positive',
    icon: Send,
  },
  {
    name: 'Offers Received',
    value: '2',
    change: '+1',
    changeType: 'positive',
    icon: CheckCircle,
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-sm border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.name}
            </span>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </span>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                stat.changeType === 'positive'
                  ? 'text-success'
                  : 'text-destructive'
              }`}
            >
              <TrendingUp className={`h-3 w-3 ${stat.changeType === 'negative' ? 'rotate-180' : ''}`} />
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
