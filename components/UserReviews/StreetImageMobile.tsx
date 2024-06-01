import React, { useRef } from "react"
import { StreetView } from "utils"
import Image from "next/image"

const StreetImageMobile = () => {
  const sliderRef = useRef(null)

  return (
    <div className="flex sm:hidden">
      <div className=" px-1">
        <div ref={sliderRef} className="slider-container">
          <div className="slider-item flex gap-2">
            <Image
              src="./street1.svg"
              width={160}
              height={110}
              alt="user"
              className="h-[228px] w-[175px] rounded-lg object-cover"
            />
            <div>
              <Image
                src="./street2.svg"
                width={160}
                height={110}
                alt="user"
                className="mb-2 h-[110px] w-[160px] rounded-lg object-cover"
              />
              <Image
                src="./street3.svg"
                width={160}
                height={110}
                alt="user"
                className="h-[110px] w-[160px] rounded-lg object-cover"
              />
            </div>
            <div>
              <Image
                src="/street4.jpeg"
                width={160}
                height={110}
                alt="user"
                className="mb-2 h-[110px] w-[160px] rounded-lg object-cover"
              />
              <Image
                src="/street4.jpeg"
                width={160}
                height={110}
                alt="user"
                className="h-[110px] w-[160px] rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreetImageMobile
