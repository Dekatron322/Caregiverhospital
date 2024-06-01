"use client"
import React, { useState } from "react"
import Search from "components/Search/Search"
import { Button } from "components/Button/Button"
import { Skeleton } from "@mui/material"

const Intro = () => {
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 3000)
  return (
    <div className=" w-[507px] content-center max-sm:mt-[50%] lg:mb-[40px]">
      {loading == false ? (
        <h1 className="text-[64px] font-bold  tracking-tight   max-sm:mb-4 max-sm:text-[40px] max-sm:leading-[48px] sm:mb-10 sm:mt-16 md:text-6xl xl:text-[64px] xl:leading-[77px]">
          Find a place you will love to live!
        </h1>
      ) : (
        <div>
          <Skeleton animation="wave" variant="text" sx={{ fontSize: "64px" }} />
          <Skeleton animation="wave" variant="text" sx={{ fontSize: "64px" }} />
        </div>
      )}
      {loading == false ? (
        <p className="mb-6 max-w-2xl font-normal max-sm:mb-4  md:text-base lg:mb-8 lg:text-[24px] lg:leading-7 ">
          See through the lenses of people who have lived or visited the neighbourhood you might have in mind.
        </p>
      ) : (
        <div className="mb-6">
          <Skeleton animation="wave" variant="text" sx={{ fontSize: "24px" }} />
          <Skeleton animation="wave" variant="text" sx={{ fontSize: "24px" }} />
          <Skeleton animation="wave" variant="text" sx={{ fontSize: "24px" }} />
        </div>
      )}
      <div className="">
        {loading == false ? <Search /> : <Skeleton animation="wave" variant="rounded" height={50} className="mb-4 " />}
        {loading == false ? (
          <Button href="/reviews" className="text-base ">
            SEARCH
          </Button>
        ) : (
          <Skeleton animation="wave" variant="rounded" height={50} width={146} className="mb-4" />
        )}
      </div>
    </div>
  )
}

export default Intro
