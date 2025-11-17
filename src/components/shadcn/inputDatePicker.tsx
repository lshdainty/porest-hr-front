"use client"

import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import { Input } from "@/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

// yyyy-mm-dd 형식으로 변환
function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// yyyy-mm-dd 문자열을 Date로 변환
function parseDate(dateString: string | undefined): Date | undefined {
  if (!dateString) {
    return undefined
  }
  const date = new Date(dateString)
  return isValidDate(date) ? date : undefined
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface InputDatePickerProps {
  value?: string | Date // yyyy-mm-dd 형식 또는 Date 객체
  onValueChange?: (value: string) => void
  onSelect?: (value: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  'data-invalid'?: boolean
}

export function InputDatePicker({
  value,
  onValueChange,
  onSelect,
  placeholder = "yyyy-mm-dd",
  disabled = false,
  id,
  'data-invalid': dataInvalid
}: InputDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // value가 Date 객체인 경우와 문자열인 경우 모두 처리
  const date = value instanceof Date ? value : parseDate(value)
  const [month, setMonth] = React.useState<Date | undefined>(date || new Date())

  React.useEffect(() => {
    if (date) {
      setMonth(date)
    }
  }, [date])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (onValueChange) {
        onValueChange(formatDate(selectedDate))
      }
      if (onSelect) {
        onSelect(selectedDate)
      }
    }
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (onValueChange) {
      onValueChange(inputValue)
    }

    // 유효한 날짜인 경우 month 업데이트 및 onSelect 호출
    const parsedDate = parseDate(inputValue)
    if (parsedDate) {
      setMonth(parsedDate)
      if (onSelect) {
        onSelect(parsedDate)
      }
    }
  }

  return (
    <div className="relative flex gap-2">
      <Input
        id={id}
        value={value instanceof Date ? formatDate(value) : (value || "")}
        placeholder={placeholder}
        className="bg-background pr-10"
        disabled={disabled}
        data-invalid={dataInvalid}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}