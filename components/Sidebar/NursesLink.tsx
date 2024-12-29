"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Admissions, Appointments, DashboardIcon, Diagnosis, ProcedureIcon } from "./Icons"

const links = [
  { name: "Dashboard", href: "/nurses-dashboard", icon: DashboardIcon },
  { name: "Appointments", href: "/all-appointments", icon: Appointments },
  { name: "Admissions", href: "/all-admissions", icon: Admissions },
  { name: "Diagnosis", href: "/all-diagnosis", icon: Diagnosis },
  { name: "Proceduces", href: "/all-procedure", icon: ProcedureIcon },
]

interface LinksProps {
  isCollapsed: boolean
}

export function NursesLink({ isCollapsed }: LinksProps) {
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
