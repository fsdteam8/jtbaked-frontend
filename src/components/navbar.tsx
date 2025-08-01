"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, LogIn, LogOut, Settings, User } from "lucide-react"
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import LogoutModal from "./LogoutModal"
import { useState } from "react"
import Image from "next/image"

export function Navbar() {
  const session = useSession()
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/Inventory", label: "Inventory" },
    { href: "/favorites", label: "All Favorites" },
    { href: "/about-us", label: "About Us" },
    { href: "/faq", label: "FAQs" },
    { href: "/contact-us", label: "Contact" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-primary text-white px-4 ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8 ">
        
          <Link href="/" className="">
            <Image src={'/logo1.png'} width={80} height={80} className="" alt="jtbacked" />

          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`pb-1 transition-colors ${isActive(href)
                  ? "border-b-2 border-white text-white"
                  : "hover:text-gray-200"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

        </div>

        <div className="flex items-center space-x-4">
          {session.status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-200 hover:bg-white/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Your Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account">
                    <Settings className="mr-2 h-4 w-4" /> My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-200 hover:bg-white/10"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}

          <Link href="/favorites">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-gray-200 hover:bg-white/10 ${isActive("/favorites") ? "text-yellow-300" : "text-white"
                }`}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <LogoutModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </nav>
  )
}
