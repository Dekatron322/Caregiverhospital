"use client"
import Link from "next/link"
import React, { useState } from "react"
import { CollapsedLogoIcon, LogoIcon } from "./Icons"
import { NursesLink } from "./NursesLink"
import clsx from "clsx"

const NursesSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={clsx("sidebar flex h-full flex-col justify-between border-r  border-[#E6E9EE]", {
        "w-20": isCollapsed,
        "w-60": !isCollapsed,
      })}
    >
      <div className="h-full justify-between border-0 border-red-700 lg:mt-6 lg:h-auto lg:space-y-4">
        <div className="hidden border-0 border-white px-7 lg:block">
          <Link href="/">{isCollapsed ? <CollapsedLogoIcon /> : <LogoIcon />}</Link>
        </div>

        <div className="h-full border-0 border-primary-700 lg:h-auto lg:space-y-1">
          {/* <p className="hidden px-7 text-xs lg:block">Navigation</p> */}

          <NursesLink isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  )
}

export default NursesSideBar
