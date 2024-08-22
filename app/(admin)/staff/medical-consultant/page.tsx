"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { MedicalConsultant, MedicalStatistics } from "utils"
import Image from "next/image"
import Link from "next/link"
import { PiDotsThree } from "react-icons/pi"
import { IoMdArrowBack } from "react-icons/io"
import { useRouter } from "next/navigation"
import { GoPlus } from "react-icons/go"

export default function Dashboard() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DashboardNav />

            <div className="mt-6 px-16 pb-4 max-md:px-3">
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize ">Go back</p>
              </button>
              <h4 className="mt-10 font-semibold">Medical Consultants</h4>
            </div>
            <div className="  flex gap-3 px-16 max-md:flex-col max-md:px-3">
              {MedicalConsultant.map((item, index) => (
                <div className="w-full rounded border p-4 shadow" key={item.id}>
                  <div className="mb-8 flex justify-between">
                    <h6 className="font-bold">{item.name}</h6>
                    <Image src="/staff-image.svg" height={20} width={60} alt="pharmacy" />
                  </div>
                  <div className="flex justify-between">
                    <h6 className="font-bold">{item.number}</h6>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 px-16 pt-16 max-md:px-3">
              <div className="w-full">
                <div className="mb-8 flex items-center justify-between">
                  <p className=" font-semibold">Medical Consultants</p>
                  <div>
                    <Link
                      href="/staff/add-staff"
                      className="flex content-center items-center gap-1 rounded-md bg-[#076fc6] px-2 py-2 text-[#ffffff]"
                    >
                      <p className="text-[12px]">Add Doctor</p>
                      <GoPlus />
                    </Link>
                  </div>
                </div>
                <>
                  <div className="mb-8 flex flex-col  gap-2">
                    {MedicalStatistics.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex w-full cursor-pointer  items-center justify-between rounded-lg border p-2 "
                      >
                        <div className="flex items-center gap-1 text-sm font-bold">
                          <Image src={item.doctor_image} height={40} width={40} alt="" />

                          <div>
                            <p>{item.name}</p>
                            <small className="text-xm ">Doctor&lsquo;s&lsquo; name</small>
                          </div>
                        </div>

                        <div className="">
                          <p className="text-sm font-bold">{item.gender}</p>
                          <small className="text-xm ">Gender</small>
                        </div>
                        <div className="max-md:hidden">
                          <div className="flex gap-1 text-sm font-bold">
                            <span>
                              <Image src={item.doctor_image} height={20} width={20} alt="" />
                            </span>
                            {item.qualification}
                          </div>
                          <small className="text-xm ">Qualification</small>
                        </div>
                        <div className="max-md:hidden">
                          <p className="text-sm font-bold">{item.email}</p>
                          <small className="text-xm ">Email</small>
                        </div>
                        <div className="max-md:hidden">
                          <p className="text-sm font-bold">{item.phone}</p>
                          <small className="text-xm ">Phone</small>
                        </div>
                        <div className="max-md:hidden">
                          <p className="text-sm font-bold">{item.address}</p>
                          <small className="text-xm ">Address</small>
                        </div>

                        <PiDotsThree />
                      </div>
                    ))}
                  </div>
                </>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
