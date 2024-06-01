import React, { useState } from "react"
import styles from "./modal.module.css"
import { MdKeyboardArrowDown } from "react-icons/md"
import { HiMiniStar } from "react-icons/hi2"
import { Amenities } from "utils"
import Image from "next/image"

interface RateIconProps {
  filled: boolean
  onClick: () => void
}

const RateIcon: React.FC<RateIconProps> = ({ filled, onClick }) => {
  return (
    <span onClick={onClick} style={{ cursor: "pointer" }}>
      {filled ? (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066]" />
      ) : (
        <HiMiniStar className="h-5 w-5 text-[#FFC70066] opacity-40" />
      )}
    </span>
  )
}

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleRateClick = (index: number) => {
    setRating(index + 1)
  }

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  const toggleAmenity = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId))
    } else {
      setSelectedAmenities([...selectedAmenities, amenityId])
    }
  }

  if (!isOpen) return null

  const submitForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    onSubmitSuccess()
    onClose()
  }

  const isSubmitEnabled = comment.trim() !== "" || selectedAmenities.length > 0 || rating > 0

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <h6 className="text-center text-lg font-medium">Review Location</h6>
          <p className="text-xl font-medium">
            Bonny and Clyde Street, <span className="max-sm:hidden">Ajao Estate,</span> Lagos
          </p>

          <button
            onClick={toggleDropdown}
            className="search-bg mt-3 flex w-full content-center items-center rounded-md"
          >
            <div className="flex h-[50px] w-full items-center justify-between  px-2">
              <p>Select Amenities</p>
              <MdKeyboardArrowDown />
            </div>
          </button>

          {isDropdownOpen && (
            <div className="relative">
              <div className="absolute left-0 top-full z-50 max-h-[323px] w-full ">
                <div className="modal-dropdown flex-wrap overflow-auto rounded-md border  p-2 max-sm:h-[323px] sm:flex">
                  {Amenities.map((amenity, index) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3  py-1 max-md:overflow-hidden sm:w-1/5"
                      onClick={() => toggleAmenity(amenity.id)}
                    >
                      <Image
                        src={selectedAmenities.includes(amenity.id) ? "/checkbox1.svg" : "/checkbox.svg"}
                        width={16}
                        height={16}
                        alt="checkbox"
                      />
                      <p className="max-sm:text-sm">{amenity.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="my-4">
            <p className="text-sm">Rate location</p>
            <div className="mt-3 flex gap-1">
              {[...Array(5)].map((_, index) => (
                <RateIcon key={index} filled={index < rating} onClick={() => handleRateClick(index)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm">Write Review</p>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="mt-3 h-[173px] w-full rounded-md border bg-transparent p-2 outline-none"
              placeholder="Add your comment..."
            ></textarea>
          </div>

          <div className="my-4 flex content-center items-center gap-2" onClick={toggleAnonymous}>
            {isAnonymous ? (
              <Image src="/checkbox1.svg" width={14} height={14} alt="checkbox" />
            ) : (
              <Image src="/checkbox.svg" width={14} height={14} alt="checkbox" />
            )}
            <p className="text-sm">Post as Anonymous</p>
          </div>
          <div className="flex w-full gap-6">
            <button
              className={`h-[50px] w-full rounded-md max-sm:h-[45px] ${
                isSubmitEnabled ? "bg-[#5378F6]" : "bg-[#E4E9FB]"
              } text-[#FFFFFF]`}
              onClick={isSubmitEnabled ? submitForm : undefined}
            >
              SUBMIT
            </button>
            <button
              className=" w-full rounded-md border border-[#5378F6] text-[#5378F6] transition  duration-700 ease-out hover:border-[2px] hover:ease-in focus:border-[3px] active:bg-[#F1F5FF] max-sm:h-[45px]"
              onClick={onClose}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
