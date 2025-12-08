import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import React from 'react'

// 위젯용 스켈레톤 (Card 없이)
export const UserBirthDuesSkeleton = () => {
  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <div className="grid grid-cols-13 gap-x-2 gap-y-2 text-center text-sm items-center min-w-[780px]">
        {/* 헤더 행 */}
        <div></div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="font-semibold">
            <Skeleton className="h-5 w-10 mx-auto" />
          </div>
        ))}

        {/* 사용자 행 (5명 가정) */}
        {Array.from({ length: 5 }).map((_, userIndex) => (
          <React.Fragment key={userIndex}>
            <div className="font-semibold text-left py-1">
              <Skeleton className="h-5 w-16" />
            </div>
            {Array.from({ length: 12 }).map((_, monthIndex) => (
              <div key={monthIndex} className="flex justify-center items-center">
                <Skeleton className="w-12 h-10 rounded-md" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// 페이지용 스켈레톤 (Card 포함)
export const UserBirthDuesPageSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-13 gap-x-2 gap-y-2 text-center text-sm items-center min-w-[780px]">
            <div className="font-semibold"></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="font-semibold">
                <Skeleton className="h-5 w-10 mx-auto" />
              </div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="font-semibold text-left py-1">
                  <Skeleton className="h-5 w-16" />
                </div>
                {Array.from({ length: 12 }).map((_, j) => (
                  <div key={j} className="flex justify-center items-center">
                    <Skeleton className="w-12 h-10 rounded-md" />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
