"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Admissions, Appointments, DashboardIcon, Departments, Patients, Staff } from "./Icons"
import { useState } from "react"

const links = [
  { name: "Dashboard", href: "/pharmacy-dashboard", icon: DashboardIcon },
  {
    name: "List of Medicines",
    href: "/medicines",
    icon: Departments,
  },
  { name: "Medicine Categories", href: "/medicine-categories", icon: Appointments },
  { name: "Issue Request", href: "/issue-request", icon: Staff },
  { name: "Patients", href: "/pharmacy-patients", icon: Patients },
  { name: "Admissions", href: "/pharmacy-admission", icon: Admissions },
]

interface LinksProps {
  isCollapsed: boolean
}

export function PharmacyLinks({ isCollapsed }: LinksProps) {
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
