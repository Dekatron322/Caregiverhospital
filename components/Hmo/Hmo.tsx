import React from "react"
import { IoIosArrowForward } from "react-icons/io"
import { HMOs } from "utils"
import { useRouter } from "next/navigation"

const Hmo = () => {
  const router = useRouter()
  const handleHmoClick = (hmoId: number) => {
    router.push(`/departments/hmos/hmo/${hmoId}`)
  }
  return (
    <>
      {HMOs.map((item) => (
        <div key={item.id} className=" mb-3 w-full  rounded border p-4 shadow-md">
          <div className=" flex items-center justify-between">
            <div>
              <h6 className="font-bold">{item.name}</h6>
              <p className="text-sm">{item.detail}</p>
            </div>
            <div
              className="search-bg cursor-pointer rounded-full border p-2 shadow"
              onClick={() => handleHmoClick(item.id)}
            >
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Hmo
