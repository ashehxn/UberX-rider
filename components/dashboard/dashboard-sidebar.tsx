import { DashboardNav } from "./dashboard-nav"

export function DashboardSidebar() {
  return (
    <aside className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block md:w-64">
      <DashboardNav />
    </aside>
  )
}
