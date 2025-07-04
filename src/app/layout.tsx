import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { Search, Bell, User, Home, PlayCircle, Store, Users, Menu } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Buy and Sell Items",
  description: "A marketplace platform for buying and selling items locally",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="px-4 h-14 flex items-center justify-between max-w-full">
            {/* Left Section - Logo and Navigation */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">f</span>
              </div>
              <div className="hidden md:flex items-center ml-2">
                <Link 
                  href="/"
                  className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Home"
                >
                  <Home className="h-6 w-6 text-gray-600" />
                </Link>
                <Link 
                  href="#"
                  className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Watch"
                >
                  <PlayCircle className="h-6 w-6 text-gray-600" />
                </Link>
                <Link 
                  href="/"
                  className="p-3 rounded-lg bg-blue-50 transition-colors border-b-2 border-blue-600"
                  aria-label="Marketplace"
                >
                  <Store className="h-6 w-6 text-blue-600" />
                </Link>
                <Link 
                  href="#"
                  className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Groups"
                >
                  <Users className="h-6 w-6 text-gray-600" />
                </Link>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Marketplace"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Section - Actions and Profile */}
            <div className="flex items-center gap-2">
              <Link 
                href="/create"
                className="hidden sm:flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm items-center gap-2"
              >
                <span className="text-lg leading-none">+</span>
                Create new listing
              </Link>
              
              {/* Mobile menu button */}
              <button className="sm:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Menu className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <User className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
