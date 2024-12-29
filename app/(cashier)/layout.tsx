import CashierSideBar from "components/Sidebar/CashierSideBar"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cashier's Dashboard | Caregivers Hospital",
  description: "We are a family with a major focus in both primary and secondary healthcare service.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://Caregivers.com/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Dekatron322/Caregiverhospital/main/public/img.png",
      },
    ],
  },
}

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col-reverse border-0 border-blue-700 lg:flex-row">
      <div className="">
        <CashierSideBar />
      </div>
      <div className="grow overflow-y-auto border-0 border-black ">{children}</div>
    </div>
  )
}
