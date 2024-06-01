"use client"
import React, { useState } from "react"

import { Reviews } from "utils"
import Image from "next/image"
import { Skeleton } from "@mui/material"
import { FaStar } from "react-icons/fa"

export const UserReviews = () => {
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 3000)

  const renderRatingStars = (rating: any) => {
    const stars = []
    const yellowStars = rating > 0 ? rating : 0
    const grayStars = 5 - yellowStars

    for (let i = 0; i < yellowStars; i++) {
      stars.push(<FaStar key={i} className="text-[12px] text-[#FABB07]" />)
    }

    for (let i = 0; i < grayStars; i++) {
      stars.push(<FaStar key={i + yellowStars} className=" text-[12px] text-[#D1D1D1]" />)
    }

    return stars
  }

  const getTagStyle = (tag: any) => {
    switch (tag.toLowerCase()) {
      case "water":
        return {
          backgroundColor: "#D1E4FA",
          color: "#2863B8",
          borderColor: "#2863B8",
        }
      case "network":
        return {
          backgroundColor: "#FCDCEF",
          color: "#AD307B",
          borderColor: "#AD307B",
        }
      case "power":
        return {
          backgroundColor: "#F66A57",
          color: "#101012",
          borderColor: "#F66A57",
        }
      case "security":
        return {
          backgroundColor: "#E4CEFD",
          color: "#6A498E",
          borderColor: "#6A498E",
        }
      case "traffic":
        return {
          backgroundColor: "#F5E9CB",
          color: "#A07C22",
          borderColor: "#A07C22",
        }
      case "road":
        return {
          backgroundColor: "#F3DFCC",
          color: "#B26D22",
          borderColor: "#B26D22",
        }

      default:
        return {
          backgroundColor: "#ffffff",
          color: "#101012",
          borderColor: "#101012",
        }
    }
  }

  const shuffledReviews = [...Reviews].sort(() => Math.random() - 0.5)
  const shuffledSecondReviews = [...Reviews].sort(() => Math.random() - 0.5)

  return (
    <div className="linear flex h-[95%] flex-row gap-6 overflow-hidden">
      <div className="move-up-animation h-[95%] pl-1">
        {shuffledReviews.map((reviews) => (
          <>
            {loading == false ? (
              <div className="small-card" key={reviews.id}>
                <div className=" flex items-center justify-between">
                  <div className="item-center flex gap-2">
                    <Image src={reviews.image} width={25} height={25} alt="user" />

                    <div>
                      <h6 className="text-[12px] font-medium">{reviews.user}</h6>
                      <p className="text-[10px] font-light ">{reviews.time}</p>
                    </div>
                  </div>
                  <div className="my-2">
                    <h6 className="text-[12px] font-medium">{reviews.location}</h6>

                    <div className="flex items-center">{renderRatingStars(reviews.rating)}</div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-[14px] font-normal leading-5">{reviews.review}</p>
                </div>
                <div className="flex  justify-between">
                  <div className="flex content-center gap-3">
                    <div className="flex content-center items-center gap-1">
                      <Image src="/likes.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.likes}</p>
                    </div>
                    <div className="flex content-center items-center gap-1">
                      <Image src="/dislikes.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.dislikes}</p>
                    </div>
                    <div className="flex content-center items-center gap-1">
                      <Image src="/comments.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.comments}</p>
                    </div>
                  </div>
                  <div className="rounded-[8px] border-[0.5px] px-[8px] py-[2px]" style={getTagStyle(reviews.tag)}>
                    <p className="text-[9px] font-medium">{reviews.tag}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-xl p-[15px] shadow">
                <div className="mb-2 flex gap-1">
                  <Skeleton animation="wave" variant="circular" width={25} height={25} />
                  <Skeleton animation="wave" variant="rounded" width={178} height={25} sx={{ fontSize: "1rem" }} />
                </div>
                <div className="mb-3">
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                </div>
                <Skeleton animation="wave" variant="rounded" width={207} height={14} sx={{ fontSize: "1rem" }} />
              </div>
            )}
          </>
        ))}
      </div>

      <div className="move-down-animation h-[95%] pr-1">
        {shuffledSecondReviews.map((reviews) => (
          <>
            {loading == false ? (
              <div className="small-card" key={reviews.id}>
                <div className=" flex items-center justify-between">
                  <div className="item-center flex gap-2">
                    <Image src={reviews.image} width={25} height={25} alt="user" />

                    <div>
                      <h6 className="text-[12px] font-medium">{reviews.user}</h6>
                      <p className="text-[10px] font-light ">{reviews.time}</p>
                    </div>
                  </div>
                  <div className="my-2">
                    <h6 className="text-[12px] font-medium">{reviews.location}</h6>

                    <div className="flex items-center">{renderRatingStars(reviews.rating)}</div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-[14px] font-normal leading-5">{reviews.review}</p>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="flex content-center items-center gap-1">
                      <Image src="/likes.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.likes}</p>
                    </div>
                    <div className="flex content-center items-center gap-1">
                      <Image src="/dislikes.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.dislikes}</p>
                    </div>
                    <div className="flex content-center items-center gap-1">
                      <Image src="/comments.svg" width={16} height={16} alt="dekalo" />
                      <p className="text-[12px] font-light ">{reviews.comments}</p>
                    </div>
                  </div>
                  <div className="rounded-[8px] border-[0.5px] px-[8px] py-[2px]" style={getTagStyle(reviews.tag)}>
                    <p className="text-[9px] font-medium">{reviews.tag}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-xl p-[15px] shadow">
                <div className="mb-2 flex gap-1">
                  <Skeleton animation="wave" variant="circular" width={25} height={25} />
                  <Skeleton animation="wave" variant="rounded" width={178} height={25} sx={{ fontSize: "1rem" }} />
                </div>
                <div className="mb-3">
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                  <Skeleton animation="wave" variant="text" width={207} sx={{ fontSize: "1rem" }} />
                </div>
                <Skeleton animation="wave" variant="rounded" width={207} height={14} />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}
