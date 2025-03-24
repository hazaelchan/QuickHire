"use client"

import { useState, useEffect } from "react"
import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface SearchFilterProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  debounceTime?: number
}

export function SearchFilter({
  onSearch,
  placeholder = "Search...",
  className = "",
  debounceTime = 300,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery)
    }, debounceTime)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, onSearch, debounceTime])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search filter"
      />
    </div>
  )
}
