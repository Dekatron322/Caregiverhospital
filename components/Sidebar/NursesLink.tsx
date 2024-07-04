"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Admissions, Appointments, DashboardIcon, Departments, Finance, Patients, Staff } from "./Icons"

const links = [
  { name: "Dashboard", href: "/nurses-dashboard", icon: DashboardIcon },

  //   { name: "Appointments", href: "/appointments", icon: Appointments },
  //   { name: "Staff", href: "/staff", icon: Staff },
  //   { name: "Patients", href: "/all-patients", icon: Patients },
  //   { name: "Finance", href: "/finance", icon: Finance },
  { name: "Admissions", href: "/all-admissions", icon: Admissions },
]

export function NursesLink() {
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
                  className={clsx("hidden text-sm font-semibold lg:block", {
                    "font-extrabold": pathname.startsWith(link.href),
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
