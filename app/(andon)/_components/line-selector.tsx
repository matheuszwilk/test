'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_components/ui/select"

interface LineSelectorProps {
  initialLine: string
}

const LineSelector: React.FC<LineSelectorProps> = ({ initialLine }) => {
  const [selectedLine, setSelectedLine] = useState(initialLine)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setSelectedLine(initialLine)
  }, [initialLine])

  const handleLineChange = (line: string) => {
    setSelectedLine(line)
    const params = new URLSearchParams(searchParams)
    params.set('line', line)
    router.push(`/andon?${params.toString()}`)
  }

  const lines = [
    { value: "All", label: "All Lines" },
    { value: "[AC1] AZ_CAC01", label: "[AC1] AZ_CAC01" },
    { value: "[AA1] AZ_RAC01", label: "[AA1] AZ_RAC01" },
  ]

  return (
    <Select onValueChange={handleLineChange} value={selectedLine}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a line" />
      </SelectTrigger>
      <SelectContent>
        {lines.map((line) => (
          <SelectItem key={line.value} value={line.value}>
            {line.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LineSelector
