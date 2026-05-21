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
  
  const [time, setTime] = useState({
    hour: '12',
    minute: '00',
    ampm: 'PM',
  })

  // Parse initial value if any
  useEffect(() => {
    setInputValue(value || '')
    if (value) {
      const parsedDate = new Date(value)
      if (isValid(parsedDate)) {
        setMonth(parsedDate)
        setTime({
          hour: format(parsedDate, 'hh'),
          minute: format(parsedDate, 'mm'),
          ampm: format(parsedDate, 'a'),
        })
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
      setTime({
        hour: format(parsedDate, 'hh'),
        minute: format(parsedDate, 'mm'),
        ampm: format(parsedDate, 'a'),
      })
    }
  }

  const getParsedDate = () => {
    const d = new Date(value)
    return isValid(d) ? d : undefined
  }

  const updateValueFromParts = (datePart: Date, timePart: typeof time) => {
    const newDate = new Date(datePart)
    let hours = parseInt(timePart.hour, 10)
    if (timePart.ampm === 'PM' && hours < 12) hours += 12
    if (timePart.ampm === 'AM' && hours === 12) hours = 0
    
    newDate.setHours(hours)
    newDate.setMinutes(parseInt(timePart.minute, 10))
    
    const formatted = format(newDate, 'MMM dd, yyyy, hh:mm a')
    onChange({ target: { name, value: formatted } })
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setMonth(selectedDate)
      updateValueFromParts(selectedDate, time)
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', val: string) => {
    const newTime = { ...time, [type]: val }
    setTime(newTime)
    
    const currentDate = getParsedDate() || new Date()
    updateValueFromParts(currentDate, newTime)
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder || 'dd/mm/yyyy, --:-- --'}
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
      <PopoverContent className="w-auto p-0 bg-white border border-zinc-200 rounded-xl shadow-xl flex flex-col md:flex-row" align="start"
      onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* Left: Calendar */}
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
          />
          <div className="flex justify-between items-center mt-4 px-2">
             <Button variant="ghost" size="sm" className="text-blue-600 font-medium text-xs hover:bg-blue-50" onClick={() => { onChange({ target: { name, value: '' } }); setIsOpen(false) }}>Clear</Button>
             <Button variant="ghost" size="sm" className="text-blue-600 font-medium text-xs hover:bg-blue-50" onClick={() => {
                const now = new Date()
                setMonth(now)
                setTime({
                  hour: format(now, 'hh'),
                  minute: format(now, 'mm'),
                  ampm: format(now, 'a'),
                })
                updateValueFromParts(now, {
                  hour: format(now, 'hh'),
                  minute: format(now, 'mm'),
                  ampm: format(now, 'a'),
                })
             }}>Today</Button>
          </div>
        </div>

        {/* Right: Time Picker */}
        <div className="md:border-l border-t md:border-t-0 border-zinc-200 p-3 flex gap-2 h-[250px] md:h-[350px]">
          <div className="flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {hours.map((h) => (
              <Button
                key={h}
                variant={time.hour === h ? 'default' : 'ghost'}
                className={cn("w-12 h-8 text-xs rounded-md", time.hour === h ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-zinc-100")}
                onClick={() => handleTimeChange('hour', h)}
              >
                {h}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {minutes.map((m) => (
              <Button
                key={m}
                variant={time.minute === m ? 'default' : 'ghost'}
                className={cn("w-12 h-8 text-xs rounded-md", time.minute === m ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-zinc-100")}
                onClick={() => handleTimeChange('minute', m)}
              >
                {m}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {['AM', 'PM'].map((a) => (
              <Button
                key={a}
                variant={time.ampm === a ? 'default' : 'ghost'}
                className={cn("w-12 h-8 text-xs rounded-md", time.ampm === a ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-zinc-100")}
                onClick={() => handleTimeChange('ampm', a as 'AM' | 'PM')}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
