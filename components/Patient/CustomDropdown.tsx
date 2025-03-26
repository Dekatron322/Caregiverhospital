import React, { useEffect, useRef, useState } from "react"
import { MdKeyboardArrowDown } from "react-icons/md"
import styles from "./CustomDropdown.module.css"
import Image from "next/image"

interface CustomDropdownProps {
  options: { id: string; name: string }[]
  selectedOption: string
  onChange: (selected: string) => void
  placeholder: string
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selectedOption, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.dropdownToggle} onClick={handleToggle}>
        <span>{selectedOption ? options.find((option) => option.id === selectedOption)?.name : placeholder}</span>
        <MdKeyboardArrowDown />
      </div>
      {isOpen && (
        <div className="search-bg absolute left-0 top-full z-10 max-h-40 w-full overflow-hidden overflow-y-scroll rounded-md">
          <div className={styles.searchContainer}>
            <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
            <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={clearSearch} className={styles.clearButton}>
                <Image className="icon-style" src="/cancel.svg" width={16} height={16} alt="cancel" />
                <Image className="dark-icon-style" src="/dark_cancel.svg" width={16} height={16} alt="cancel" />
              </button>
            )}
          </div>
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="cursor-pointer overflow-hidden px-4 py-2 hover:bg-[#747A80]"
              onClick={() => handleOptionClick(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
