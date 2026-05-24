'use client'

import React, { useState, useEffect } from 'react'
import { format, isValid } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateTimePickerProps {
  name: string
  value: string
  onChange: (e: { target: { name: string; value: string } }) => void
  placeholder?: string
  className?: string
}

export function DateTimePicker({ name, value, onChange, placeholder, className }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const [month, setMonth] = useState<Date>(new Date())

  // Parse initial value if any
  useEffect(() => {
    setInputValue(value || '')
    if (value) {
      const parsedDate = new Date(value)
      if (isValid(parsedDate)) {
        setMonth(parsedDate)
      }
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setInputValue(newVal)
    onChange({ target: { name, value: newVal } })
    
    // Attempt to parse to update calendar if valid
    const parsedDate = new Date(newVal)
    if (isValid(parsedDate)) {
      setMonth(parsedDate)
    }
  }

  const getParsedDate = () => {
    const d = new Date(value)
    return isValid(d) ? d : undefined
  }

  const updateValueFromDate = (datePart: Date) => {
    const formatted = format(datePart, 'MMM dd, yyyy')
    onChange({ target: { name, value: formatted } })
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setMonth(selectedDate)
      updateValueFromDate(selectedDate)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder || 'dd/mm/yyyy'}
            value={inputValue}
            onChange={handleInputChange}
            className={cn(
              "flex w-full bg-white border border-zinc-300 text-zinc-900 rounded-xl px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black pr-10",
              className
            )}
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-zinc-200 rounded-xl shadow-xl" align="start"
      onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="p-3">
          <Calendar
            mode="single"
            selected={getParsedDate()}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            modifiersClassNames={{
              today: "bg-blue-50 text-blue-600 font-bold border border-blue-200"
            }}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <div className="flex justify-between items-center mt-4 px-2">
             <Button variant="ghost" size="sm" className="text-blue-600 font-medium text-xs hover:bg-blue-50" onClick={() => { onChange({ target: { name, value: '' } }); setIsOpen(false) }}>Clear</Button>
             <Button variant="ghost" size="sm" className="text-blue-600 font-medium text-xs hover:bg-blue-50" onClick={() => {
                const now = new Date()
                setMonth(now)
                updateValueFromDate(now)
                setIsOpen(false)
             }}>Today</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
