"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Menu, 
  X, 
  LogOut,
  User,
  DollarSign,
  BarChart
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Logo from "@/components/ui/logo"
import { 
  DashboardIcon,
  CourseIcon, 
  TeeTimeIcon, 
  RangeIcon,
  AdminIcon,
  MembersIcon,
  ScheduleIcon,
  LoadingGolfBall
} from "@/components/ui/golf-icons"

const navigation = [
  { name: "Dashboard", href: "/member/dashboard", icon: DashboardIcon },
  { name: "Courses", href: "/courses", icon: CourseIcon },
  { name: "Book Tee Time", href: "/booking", icon: TeeTimeIcon },
  { name: "Range", href: "/range", icon: RangeIcon },
]

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: AdminIcon },
  { name: "Manage Courses", href: "/admin/courses", icon: CourseIcon },
  { name: "Members", href: "/admin/members", icon: MembersIcon },
  { name: "Bookings", href: "/admin/bookings", icon: ScheduleIcon },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
]

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // const isAdmin = session?.user?.role === 'admin'
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'super_admin'
  const currentNavigation = isAdmin ? adminNavigation : navigation

  // Don't render navigation on landing page
  if (pathname === '/') {
    return null
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4 lg:py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
              <Logo size="md" variant="gradient" />
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="ml-10 hidden space-x-8 lg:block">
            {status === "authenticated" && (
              <>
                {currentNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center space-x-1 border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "border-golf-green text-golf-green"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* User menu */}
          <div className="ml-10 space-x-4">
            {status === "loading" ? (
              <LoadingGolfBall />
            ) : status === "authenticated" ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || "User"}
                    />
                  ) : (
                    <User className="h-8 w-8 rounded-full bg-gray-200 p-1 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name}
                  </span>
                  {isAdmin && (
                    <span className="rounded-full bg-golf-green px-2 py-1 text-xs font-medium text-white">
                      Admin
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/auth/signin')}
                variant="golf"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && status === "authenticated" && (
          <div className="space-y-1 pb-3 pt-2 lg:hidden">
            {currentNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "bg-golf-green text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </header>
  )
}
