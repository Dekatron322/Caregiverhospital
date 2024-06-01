import SideBar from "components/Sidebar/Sidebar"

export const metadata = {
  title: "Caregivers Hospital | Dashboard",
  description: "Dashboard",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col-reverse border-0 border-blue-700 lg:flex-row">
      <div className="">
        <SideBar />
      </div>
      <div className="grow overflow-y-auto border-0 border-black ">{children}</div>
    </div>
  )
}
