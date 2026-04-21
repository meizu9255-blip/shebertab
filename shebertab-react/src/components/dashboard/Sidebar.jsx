import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Building2, 
  Calendar, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '#', current: true },
  { name: 'Applications', icon: FileText, href: '#', current: false, count: 24 },
  { name: 'Jobs', icon: Briefcase, href: '#', current: false },
  { name: 'Companies', icon: Building2, href: '#', current: false },
  { name: 'Calendar', icon: Calendar, href: '#', current: false },
]

const secondaryNav = [
  { name: 'Settings', icon: Settings, href: '#' },
  { name: 'Help', icon: HelpCircle, href: '#' },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">JobTracker</span>
      </div>
      
      {/* User Menu */}
      <div className="border-b border-white/10 px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left hover:bg-sidebar-hover transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-xs font-medium text-white">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-sidebar-foreground truncate">john@company.com</p>
          </div>
          <ChevronDown className="h-4 w-4 text-sidebar-foreground" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.count && (
                  <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${
                    item.current 
                      ? 'bg-white/20 text-white' 
                      : 'bg-sidebar-hover text-sidebar-foreground'
                  }`}>
                    {item.count}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-white/10 px-3 py-4">
        <ul className="space-y-1">
          {secondaryNav.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
          <li>
            <button className="group flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover hover:text-white transition-colors">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Sign out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
