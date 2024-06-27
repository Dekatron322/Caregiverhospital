"use client"
import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { EurIcon, GbpIcon, LogoIcon, PlusIcon, SettingsIcon, UsdIcon } from "./Icons"
import { IoIosArrowDown } from "react-icons/io"
import { DoctorLinks } from "./DoctorLinks"

const DoctorSideBar = () => {
  return (
    <div className="sidebar flex h-full flex-col justify-between border-0 border-[#424343] ">
      <div className="h-full justify-between border-0 border-red-700 lg:mt-6 lg:h-auto lg:space-y-4">
        <div className="hidden border-0 border-white px-7 lg:block">
          <Link href="/">
            <LogoIcon />
          </Link>
        </div>

        <div className="h-full border-0 border-primary-700 lg:h-auto lg:space-y-1">
          <p className="hidden px-7 text-sm lg:block">Navigation</p>

          <DoctorLinks />
        </div>
      </div>

      <div className="my-4 hidden h-auto border-0 border-yellow-700 px-7 lg:block">
        <Link href="/settings" className="flex h-10 items-center space-x-2 border-0 border-black hover:bg-blue-100">
          <Image width={20} height={20} src="Icon2.svg" alt="" />
          <p className="hidden text-sm font-semibold lg:block">Dr. obafemi</p>
        </Link>
      </div>
    </div>
  )
}

export default DoctorSideBar
