"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Departments, Appointments, DashboardIcon, Staff, Patients, Admissions } from "./Icons"
import { useState } from "react"
import { Box, Skeleton } from "@mui/material"

const links = [
  { name: "Dashboard", href: "/doctor-dashboard", icon: DashboardIcon },

  { name: "Patients", href: "/doctor-patients", icon: Patients },
  { name: "Admissions", href: "/doctor-admission", icon: Patients },
]

export function DoctorLinks() {
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 5000)
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-row border-black pl-5 lg:h-80 lg:flex-col">
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <>
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "mx-2 flex items-center justify-center rounded border-0 border-black px-2 py-6 transition duration-300 hover:bg-[#424343] lg:justify-normal lg:space-x-2",
                {
                  "font-extrabold text-[#46FFA6] max-md:my-2 max-md:rounded-md max-md:text-white  lg:bg-inherit":
                    pathname.startsWith(link.href),
                }
              )}
            >
              <LinkIcon />
              <p
                className={clsx("hidden text-sm font-semibold lg:block", {
                  "font-extrabold": pathname.startsWith(link.href),
                })}
              >
                {link.name}
              </p>
            </Link>
          </>
        )
      })}
    </div>
  )
}
