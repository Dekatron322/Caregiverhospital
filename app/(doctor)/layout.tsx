import DoctorSideBar from "components/Sidebar/DoctorSidebar"

export const metadata = {
  title: "Doctors Dashboard | Caregivers Hospital",
  description: "Dashboard",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col-reverse border-0 border-blue-700 lg:flex-row">
      <div className="">
        <DoctorSideBar />
      </div>
      <div className="grow overflow-y-auto border-0 border-black ">{children}</div>
    </div>
  )
}
