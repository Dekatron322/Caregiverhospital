"use client"
import React, { useState } from "react"

import Image from "next/image"
import { PiWalletLight, PiDotsThree } from "react-icons/pi"
import { CiTrophy } from "react-icons/ci"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { MdOutlineDevices, MdCreditScore } from "react-icons/md"
import { useRouter } from "next/navigation"
import { Accounts, Credits, OpenDeposits } from "utils"

const UserAccount = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("payment") // State to manage active tab

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500"
      case "On Hold":
        return "text-yellow-500"
      case "Closed":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const handlePaymentClick = (accountId: number) => {
    router.push(`/accounts/details/${accountId}`)
  }

  const handleDepositClick = (accountId: number) => {
    router.push(`/accounts/deposit/${accountId}`)
  }

  interface PaymentAccount {
    id: number
    name: string
    number: string
    image: string
    balance: string
    blocked: string
    status: string
  }

  const renderPaymentAccounts = () => {
    return (
      <div className="flex w-full flex-wrap">
        {Accounts.map((account: PaymentAccount, index: number) => (
          <div key={account.id} className="w-full cursor-pointer p-2 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <div
              onClick={() => handlePaymentClick(account.id)}
              className={`small-card rounded-md p-2 transition duration-500 hover:border-none hover:shadow-xl md:border ${
                index === 0 ? "border-none shadow-2xl" : "" // Adding shadow to the first item
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="mb-4">
                  <h5 className="font-semibold">{account.name}</h5>
                  <small>{account.number}</small>
                </div>
                <Image src={account.image} width={30} height={30} alt="" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h5 className="text-xl font-bold">{account.balance}</h5>
                  <small>Blocked amount {account.blocked}</small>
                </div>

                <small className={`font-semibold capitalize ${getStatusColor(account.status)}`}>{account.status}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderOpenDeposits = () => {
    const renderIcon = (name: any) => {
      switch (name) {
        case "Cummulative":
          return <PiWalletLight />
        case "Cashbook":
          return <CiTrophy />
        case "creditCard":
          return <CiTrophy />
        default:
          return <CiTrophy />
      }
    }
    return (
      <>
        <div className="flex flex-col gap-2 max-md:hidden ">
          {OpenDeposits.map((deposit) => (
            <div
              key={deposit.id}
              onClick={() => handleDepositClick(deposit.id)}
              className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
            >
              {renderIcon(deposit.name)}
              <div className="">
                <p className="text-sm font-bold">{deposit.name}</p>
                <small className="text-xm ">Name</small>
              </div>
              <div>
                <p className="text-sm font-bold">{deposit.rate}</p>
                <small className="text-xm ">Rate</small>
              </div>
              <div>
                <p className="text-sm font-bold">{deposit.account_balance}</p>
                <small className="text-xm ">Account balance</small>
              </div>
              <div>
                <p className="text-sm font-bold">{deposit.interest}</p>
                <small className="text-xm ">Accrued interest</small>
              </div>
              <div className="tab-bg rounded-md px-4 py-1">
                <p className="text-xs">{deposit.date}</p>
              </div>

              <PiDotsThree />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 md:hidden ">
          {OpenDeposits.map((deposit) => (
            <div
              key={deposit.id}
              onClick={() => handleDepositClick(deposit.id)}
              className="small-card flex w-full  cursor-pointer items-center justify-between rounded-lg p-2 "
            >
              <div className="flex items-center gap-3">
                {renderIcon(deposit.name)}
                <div>
                  <p className="text-sm font-bold">{deposit.name}</p>
                  <p className="text-sm ">{deposit.rate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold">{deposit.account_balance}</p>
                <p className="text-sm ">{deposit.interest}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderYourCredit = () => {
    const renderIcon = (name: any) => {
      switch (name) {
        case "Mortgage loan":
          return <HiOutlineBuildingOffice2 />
        case "Consumer loan":
          return <MdOutlineDevices />

        default:
          return <MdCreditScore />
      }
    }
    return (
      <>
        <div className="flex flex-col gap-2 max-md:hidden">
          {Credits.map((credit) => (
            <div className="flex w-full  items-center justify-between rounded-lg border p-2">
              {renderIcon(credit.name)}
              <div>
                <p className="text-sm font-bold">{credit.name}</p>
                <small className="text-xm ">Name</small>
              </div>
              <div>
                <p className="text-sm font-bold">{credit.rate}</p>
                <small className="text-xm ">Rate</small>
              </div>
              <div>
                <p className="text-sm font-bold">{credit.account_balance}</p>
                <small className="text-xm ">Account balance</small>
              </div>
              <div>
                <p className="text-sm font-bold">{credit.interest}</p>
                <small className="text-xm ">Accrued interest</small>
              </div>
              <div className="tab-bg rounded-md px-4 py-1">
                <p className="text-xs">{credit.date}</p>
              </div>

              <PiDotsThree />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 md:hidden ">
          {Credits.map((credit) => (
            <div
              key={credit.id}
              className="small-card flex w-full  cursor-pointer items-center justify-between rounded-lg p-2 "
            >
              <div className="flex items-center gap-3">
                {renderIcon(credit.name)}
                <div>
                  <p className="text-sm font-bold">{credit.name}</p>
                  <p className="text-sm ">{credit.rate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold">{credit.account_balance}</p>
                <p className="text-sm ">{credit.interest}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="tab-bg mb-8 flex w-[345px] items-center gap-3 rounded-lg p-1 md:border">
        {/* Tabs */}
        <button
          className={`${activeTab === "payment" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("payment")}
        >
          Payment Accounts
        </button>
        <button
          className={`${activeTab === "deposit" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("deposit")}
        >
          Open Deposits
        </button>

        <button
          className={`${activeTab === "credit" ? "active-tab" : "inactive-tab"}`}
          onClick={() => setActiveTab("credit")}
        >
          Your Credits
        </button>
      </div>
      {/* Render content based on active tab */}
      {activeTab === "payment" ? renderPaymentAccounts() : null}
      {activeTab === "deposit" ? renderOpenDeposits() : null}
      {activeTab === "credit" ? renderYourCredit() : null}
    </div>
  )
}

export default UserAccount
