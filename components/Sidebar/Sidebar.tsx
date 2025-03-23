"use client"
import Link from "next/link"
import React, { useState } from "react"
import { Links } from "./Links"
import { CollapsedLogoIcon, LogoIcon } from "./Icons"

import clsx from "clsx"

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={clsx(
        "sidebar border- flex h-full  flex-col justify-between border-r  border-[#E6E9EE]  max-sm:hidden",
        {
          "w-20": isCollapsed,
          "w-60": !isCollapsed,
        }
      )}
    >
      <div className="h-full justify-between border-0 border-red-700 lg:mt-6 lg:h-auto lg:space-y-4">
        <div className="border-0 border-white px-7 transition-opacity lg:block">
          <Link href="/">{isCollapsed ? <CollapsedLogoIcon /> : <LogoIcon />}</Link>
        </div>

        <div className="h-full border-0 border-primary-700 lg:h-auto lg:space-y-1">
          <Links isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  )
}

export default SideBar
