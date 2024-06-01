import React, { useEffect, useRef, useState } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { Property } from "utils"

const Properties: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollLeft, setShowScrollLeft] = useState<boolean>(false)
  const [showScrollRight, setShowScrollRight] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (container) {
        setShowScrollLeft(container.scrollLeft > 0)
        setShowScrollRight(container.scrollWidth > container.clientWidth + container.scrollLeft)
      }
    }
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      setShowScrollLeft(container.scrollLeft > 0)
      setShowScrollRight(container.scrollWidth > container.clientWidth + container.scrollLeft)
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 100
  }

  const scrollRight = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 100
  }
  return (
    <div className=" mt-4 flex items-center">
      {showScrollLeft && (
        <div className="flex items-center max-sm:hidden">
          <div className="slider">
            <IoIosArrowForward className="slider-icon rotate-180 transform" onClick={scrollLeft} />
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="property-container flex items-center gap-2 overflow-x-hidden max-sm:overflow-x-scroll"
      >
        {Property.map((property) => (
          <div key={property.id} className="properties">
            <p className="text-sm">{property.detail}</p>
          </div>
        ))}
      </div>
      {showScrollRight && (
        <div className=" flex items-center max-sm:hidden">
          <div className="slider">
            <IoIosArrowForward className="slider-icon" onClick={scrollRight} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Properties
