import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { ShoppingBag, LogOut, Menu, User, Mail } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet"
import { useAuth } from "@/hooks/useAuth.ts"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {ROUTE_CONSTANTS} from "@/constants/ROUTE_CONSTANTS.ts";

// Navigation items with display names
const navItems = [
  { path: ROUTE_CONSTANTS.products, label: "Products" },
  // { path: ROUTE_CONSTANTS.users, label: "Users" },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Get initials from user's full name
  const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
  }

  // Reusable NavLink renderer
  const renderNavLink = (item: { path: string; label: string }, isMobile = false, onClick?: () => void) => {
    const baseStyles = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "rounded-md text-sm font-medium text-blue-700 bg-blue-50"
            : "rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"

    const mobileStyles = ({ isActive }: { isActive: boolean }) =>
        `block px-3 py-2 text-base ${baseStyles({ isActive })}`

    const desktopStyles = ({ isActive }: { isActive: boolean }) => `px-3 py-2 ${baseStyles({ isActive })}`

    return (
        <NavLink key={item.path} to={item.path} className={isMobile ? mobileStyles : desktopStyles} onClick={onClick}>
          {item.label}
        </NavLink>
    )
  }

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">Fruit Market Admin</span>
              </div>

              {/* Desktop navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => renderNavLink(item))}
                <div className="ml-4 flex items-center">
                  {/* Admin Profile Sheet */}
                  <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-0 h-auto" aria-label="Profile">
                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
                          <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(user?.fullName || "User")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>User Profile</SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.fullName || "Admin"} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                              {getInitials(user?.fullName || "Admin")}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-xl font-semibold">{user?.fullName || "Admin"}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">User</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <span>{user?.username || "admin"}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span>{user?.email || "admin@example.com"}</span>
                          </div>
                        </div>

                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                              handleLogout()
                              setIsProfileOpen(false)
                            }}
                        >
                          <LogOut size={18} className="mr-2" />
                          Logout
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>


                </div>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                {/* Mobile Avatar */}
                <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-0 h-auto" aria-label="Profile">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.fullName || "Admin"} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(user?.fullName || "Admin")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full">
                    <SheetHeader>
                      <SheetTitle>Profile</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                            {getInitials(user?.fullName || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{user?.fullName || "User"}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <span>{user?.username || "user"}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                            setIsProfileOpen(false)
                          }}
                      >
                        <LogOut size={18} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu size={24} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full">
                    <div className="py-4 space-y-4">
                      {navItems.map((item) => renderNavLink(item, true, () => setIsMobileMenuOpen(false)))}
                      <Button
                          variant="ghost"
                          className="flex w-full items-center justify-start px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                      >
                        <LogOut size={18} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
  )
}
