"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Admissions, DashboardIcon, Patients } from "./Icons"
import { useState } from "react"

const links = [
  { name: "Dashboard", href: "/doctor-dashboard", icon: DashboardIcon },
  { name: "Admissions", href: "/doctor-admission", icon: Admissions },
  { name: "Patients", href: "/doctor-patients", icon: Patients },
]

interface LinksProps {
  isCollapsed: boolean
}

export function DoctorLinks({ isCollapsed }: LinksProps) {
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 5000)
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-row   border-black  lg:h-80 lg:flex-col">
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <>
            <Link
              key={link.name}
              href={link.href}
              className={clsx("dashboard-style", {
                "active-dashboard": pathname.startsWith(link.href),
              })}
            >
              <div className="flex items-center gap-2 pl-5">
                <LinkIcon />
                <p
                  className={clsx("text-sm font-semibold transition-opacity duration-500", {
                    hidden: isCollapsed,
                    "font-extrabold transition-opacity duration-500": pathname.startsWith(link.href),
                  })}
                >
                  {link.name}
                </p>
              </div>
            </Link>
          </>
        )
      })}
    </div>
  )
}
