"use client"

import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { Clock } from "lucide-react"
import * as React from "react"

// HH:mm 형식으로 변환
function formatTime(hour: number, minute: number) {
  const h = String(hour).padStart(2, '0')
  const m = String(minute).padStart(2, '0')
  return `${h}:${m}`
}

// HH:mm 문자열을 시간/분으로 파싱
function parseTime(timeString: string | undefined): { hour: number; minute: number } | undefined {
  if (!timeString) {
    return undefined
  }
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) {
    return undefined
  }
  const hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return undefined
  }
  return { hour, minute }
}

interface InputTimePickerProps {
  value?: string // HH:mm 형식
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function InputTimePicker({
  value,
  onValueChange,
  placeholder = "HH:mm",
  disabled = false
}: InputTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const time = parseTime(value)
  const [selectedHour, setSelectedHour] = React.useState<number>(time?.hour ?? 9)
  const [selectedMinute, setSelectedMinute] = React.useState<number>(time?.minute ?? 0)

  React.useEffect(() => {
    if (time) {
      setSelectedHour(time.hour)
      setSelectedMinute(time.minute)
    }
  }, [time])

  const handleTimeSelect = () => {
    if (onValueChange) {
      onValueChange(formatTime(selectedHour, selectedMinute))
    }
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (onValueChange) {
      onValueChange(inputValue)
    }

    // 유효한 시간인 경우 선택값 업데이트
    const parsedTime = parseTime(inputValue)
    if (parsedTime) {
      setSelectedHour(parsedTime.hour)
      setSelectedMinute(parsedTime.minute)
    }
  }

  // 시간 옵션 생성 (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // 분 옵션 생성 (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="relative flex gap-2">
      <Input
        value={value || ""}
        placeholder={placeholder}
        className="bg-background pr-10"
        disabled={disabled}
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
            <Clock className="size-3.5" />
            <span className="sr-only">Select time</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">시간</label>
                <Select
                  value={selectedHour.toString()}
                  onValueChange={(value) => setSelectedHour(parseInt(value, 10))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {String(hour).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-xl font-bold mt-5">:</span>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">분</label>
                <Select
                  value={selectedMinute.toString()}
                  onValueChange={(value) => setSelectedMinute(parseInt(value, 10))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute.toString()}>
                        {String(minute).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleTimeSelect} className="w-full">
              확인
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
