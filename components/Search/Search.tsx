import React from "react"
import Image from "next/image"
import { IoMdSearch } from "react-icons/io"

const Search = () => {
  return (
    <div className="search-bg flex h-8 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 lg:w-[500px]">
      <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
      <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
      <input
        type="text"
        id="search"
        placeholder="Search"
        className="w-full bg-transparent text-xs outline-none focus:outline-none"
        style={{ width: "100%" }}
      />
    </div>
  )
}

export default Search
