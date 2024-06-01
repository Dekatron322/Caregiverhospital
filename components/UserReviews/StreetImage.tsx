"use client"
import React, { useState } from "react"
import { StreetView } from "utils"
import Image from "next/image"

const StreetImage: React.FC = () => {
  const [showMore, setShowMore] = useState(false)

  const chunkedStreetView: Array<Array<{ image: string }>> = StreetView.reduce((acc: any, _: any, index: number) => {
    if (index % 2 === 0) {
      acc.push(StreetView.slice(index, index + 2))
    }
    return acc
  }, [])

  const firstFourImages = chunkedStreetView.slice(0, 2)

  return (
    <div className="flex flex-col gap-4 max-sm:hidden">
      {firstFourImages.map((chunk, index) => (
        <div key={index} className="flex gap-4">
          {chunk.map((street, idx) => (
            <div key={idx} className="relative rounded">
              <Image
                src={street.image}
                width={235}
                height={224}
                alt="user"
                className="h-[224px] w-[235px] rounded-lg object-cover"
              />
              {index === firstFourImages.length - 1 && idx === chunk.length - 1 && (
                <div>
                  {!showMore ? (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#1E1E1EBF] text-[#ffffff] opacity-75 hover:opacity-90">
                      <button onClick={() => setShowMore(true)}>VIEW MORE</button>
                    </div>
                  ) : (
                    <div className=" "></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {showMore &&
        chunkedStreetView.slice(2).map((chunk, index) => (
          <div key={index} className="flex gap-4 max-sm:hidden">
            {chunk.map((street, idx) => (
              <div key={idx} className="relative rounded ">
                <Image
                  src={street.image}
                  width={235}
                  height={224}
                  alt="user"
                  className="h-[224px] w-[235px] rounded-lg object-cover"
                />
                {index === chunkedStreetView.slice(2).length - 1 && idx === chunk.length - 1 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#1E1E1EBF] text-[#ffffff] opacity-75 hover:opacity-90">
                    <button onClick={() => setShowMore(false)}>VIEW LESS</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}

export default StreetImage
