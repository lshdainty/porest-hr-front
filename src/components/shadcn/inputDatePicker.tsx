"use client"

import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Calendar } from "@/components/shadcn/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/shadcn/inputGroup"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"

interface InputDatePickerProps {
  value?: string; // Expects 'YYYY-MM-DD'
  onValueChange: (value: string | undefined) => void;
}

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

export function InputDatePicker({ value, onValueChange }: InputDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const date = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(value);
    return isValidDate(d) ? d : undefined;
  }, [value]);

  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setMonth(date);
  }, [date]);

  return (
    <InputGroup>
      <InputGroupInput
        id="date"
        value={value || ''}
        placeholder="YYYY-MM-DD"
        onChange={(e) => {
          onValueChange(e.target.value || undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <InputGroupButton
              id="date-picker"
              size="icon-xs"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
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
              onSelect={(selectedDate) => {
                onValueChange(formatDate(selectedDate));
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}