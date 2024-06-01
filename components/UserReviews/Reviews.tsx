import React, { useState } from "react"
import { AllReviews } from "utils"
import Image from "next/image"
import { FaStar } from "react-icons/fa"

const Reviews = () => {
  const [loading, setLoading] = useState(true)
  const [commentForms, setCommentForms] = useState<{ [key: number]: boolean }>({})

  setTimeout(() => setLoading(false), 3000)

  const toggleCommentForm = (reviewId: number) => {
    setCommentForms((prevState) => {
      const updatedForms: { [key: number]: boolean } = {}
      updatedForms[reviewId] = !prevState[reviewId]
      if (updatedForms[reviewId]) {
        Object.keys(prevState).forEach((id) => {
          if (parseInt(id) !== reviewId) {
            updatedForms[parseInt(id)] = false
          }
        })
      }
      return updatedForms
    })
  }

  return (
    <div className="w-[50%] content-center max-sm:w-full lg:mb-[40px]">
      {AllReviews.map((review, index) => (
        <div key={review.id} className={`py-3 ${index === AllReviews.length - 1 ? "" : "border-b"}`}>
          <div className="flex content-center justify-between">
            <div className="flex items-center gap-1">
              <Image src={review.image} width={24} height={24} alt="user" />
              <h6 className="text-sm font-normal">{review.user}</h6>
              {review.isAdmin && <p className=" text-xs font-bold">(Admin)</p>}
              <p className="text-sm font-normal opacity-60">{review.time}</p>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-center text-[12px] text-[#FABB07]" />
              <div className="decoration-none text-center text-sm font-normal">{review.rating}</div>
            </div>
          </div>
          <p className="text-base font-normal">{review.review}</p>
          <div className="mt-2 flex content-center gap-8">
            <div className="flex cursor-pointer items-center">
              <Image className="icon-style" src="/like_icon.svg" width={18} height={16} alt="like" />
              <Image className="dark-icon-style" src="/like_dark.svg" width={18} height={16} alt="like" />
              <p className="icon-text text-sm font-normal">{review.likes}</p>
            </div>
            <div className="flex cursor-pointer items-center">
              <Image className="icon-style" src="/dislike.svg" width={18} height={16} alt="dislike" />
              <Image className="dark-icon-style" src="/unlike_dark.svg" width={18} height={16} alt="dislike" />
              <p className="icon-text text-sm font-normal">{review.dislikes}</p>
            </div>
            <div className="flex cursor-pointer items-center" onClick={() => toggleCommentForm(review.id)}>
              <Image className="icon-style" src="/comment.svg" width={18} height={16} alt="comment" />
              <Image className="dark-icon-style" src="/comment-dark.svg" width={18} height={16} alt="comment" />
              <p className="icon-text text-sm font-normal">{review.comments}</p>
            </div>
          </div>
          <div
            className={`w-full overflow-hidden ${
              commentForms[review.id]
                ? "max-h-[500px] opacity-100 transition-all duration-300 ease-in-out"
                : "max-h-0 opacity-0 transition-all duration-300 ease-out"
            }`}
          >
            {commentForms[review.id] && (
              <form className="mt-3 flex items-center border-t">
                <input
                  className="mt-3 w-full content-center border-0 bg-transparent focus:outline-none"
                  placeholder="Add a comment"
                />
                <button
                  type="submit"
                  className="mt-3 h-[30px] rounded-md border bg-[#3366FF] px-3 text-[#FFFFFF] transition-colors hover:bg-[#2952CC] focus:bg-[#2952CC] active:bg-[#061E66]"
                >
                  POST
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Reviews
