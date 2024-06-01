"use client"
import Link from "next/link"
import React from "react"
import { Links } from "./Links"
import { LogoIcon } from "./Icons"

const SideBar = () => {
  return (
    <div className="sidebar flex h-full flex-col justify-between border-0 border-[#424343] ">
      <div className="h-full justify-between border-0 border-red-700 lg:mt-6 lg:h-auto lg:space-y-4">
        <div className="hidden border-0 border-white px-7 lg:block">
          <Link href="/">
            <LogoIcon />
          </Link>
        </div>

        <div className="h-full border-0 border-primary-700 lg:h-auto lg:space-y-1">
          <p className="hidden px-7 text-xs lg:block">Navigation</p>

          <Links />
        </div>
      </div>
    </div>
  )
}

export default SideBar
