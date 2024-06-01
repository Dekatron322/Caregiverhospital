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

        <div className="border-0 border-primary-700 lg:h-auto lg:space-y-1">
          <p className="hidden px-7 text-sm lg:block">Navigation</p>

          <DoctorLinks />
        </div>

        <div className="hidden h-full border-0 border-purple-700  lg:block lg:h-auto lg:space-y-1">
          <p className="px-7 text-sm">Staff Members</p>

          <Balances />

          <div className=" px-7">
            <div className="flex flex-row items-center space-x-2">
              <IoIosArrowDown />

              <p className="text-sm font-semibold">See more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 hidden h-auto border-0 border-yellow-700 px-7 lg:block">
        <Link href="/settings" className="flex h-10 items-center space-x-2 border-0 border-black hover:bg-blue-100">
          <Image width={20} height={20} src="Icon2.svg" alt="" />
          <p className="hidden text-sm font-semibold lg:block">Mr. obafemi Martins</p>
        </Link>
      </div>
    </div>
  )
}

const balances = [
  { amount: "Dr. Ahmed Singh", currency: "USD", icon: UsdIcon },
  {
    amount: "Pharm. Yusuf sani",
    currency: "EUR",
    icon: EurIcon,
  },
  { amount: "Mr. obafemi Martins", currency: "GBP", icon: GbpIcon },
]

const Balances = () => {
  return (
    <div className="flex h-full w-full flex-row border-0 border-black lg:h-32 lg:flex-col">
      {balances.map((balance) => {
        const BalanceIcon = balance.icon
        return (
          <div
            key={balance.currency}
            className="flex grow items-center justify-center border-0 border-black lg:justify-normal lg:space-x-2"
          >
            <div className="flex grow items-center justify-center border-0 border-black px-7 lg:justify-normal lg:space-x-2">
              <BalanceIcon />
              <p className="text-sm font-semibold">{`${balance.amount} ${balance.currency}`}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DoctorSideBar
