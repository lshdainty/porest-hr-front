import { Badge } from '@/components/shadcn/badge'
import {
  Ban,
  CheckCircle,
  Clock,
  Timer,
  XCircle,
  type LucideIcon
} from 'lucide-react'

export type VacationStatusCode = 'PENDING' | 'PROGRESS' | 'ACTIVE' | 'APPROVED' | 'REJECTED' | 'CANCELED'

export interface VacationStatusConfig {
  color: string
  icon: LucideIcon
}

export const VACATION_STATUS_CONFIG: Record<VacationStatusCode, VacationStatusConfig> = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Timer
  },
  PROGRESS: {
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Clock
  },
  ACTIVE: {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle
  },
  APPROVED: {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle
  },
  CANCELED: {
    color: 'bg-muted text-foreground border-muted-foreground/30',
    icon: Ban
  }
}

export const getStatusConfig = (statusCode: string): VacationStatusConfig | null => {
  return VACATION_STATUS_CONFIG[statusCode as VacationStatusCode] || null
}

export const getStatusBadge = (statusCode: string, statusName: string) => {
  const config = getStatusConfig(statusCode)
  if (!config) return null
  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <IconComponent className='w-3 h-3' />
      {statusName}
    </Badge>
  )
}

export const getStatusIcon = (statusCode: string, className: string = 'w-8 h-8') => {
  const config = getStatusConfig(statusCode)
  if (!config) return null
  const IconComponent = config.icon

  // 색상 매핑
  const iconColorMap: Record<VacationStatusCode, string> = {
    PENDING: 'text-yellow-600',
    PROGRESS: 'text-blue-600',
    ACTIVE: 'text-green-600',
    APPROVED: 'text-green-600',
    REJECTED: 'text-red-600',
    CANCELED: 'text-foreground'
  }

  const colorClass = iconColorMap[statusCode as VacationStatusCode] || 'text-foreground'

  return <IconComponent className={`${className} ${colorClass}`} />
}
