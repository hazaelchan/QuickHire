 "use client"

import React from 'react'


import { useState } from "react"
import { SearchFilter } from "./search-filter"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"


interface Item {
  id: string | number
  title: string
  description: string
}

interface FilterableListProps {
  items: Item[]
  title?: string
}

export function FilterableList({ items, title = "Items" }: FilterableListProps) {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredItems(items)
      return
    }

    const lowercasedQuery = query.toLowerCase()
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercasedQuery) || item.description.toLowerCase().includes(lowercasedQuery),
    )

    setFilteredItems(filtered)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <CardTitle>{title}</CardTitle>
        <SearchFilter onSearch={handleSearch} placeholder="Search items..." />
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No items found</p>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
