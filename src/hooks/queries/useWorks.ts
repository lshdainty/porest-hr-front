'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetWorkGroups,
  fetchGetWorkPartLabel,
  fetchGetWorkParts,
  fetchGetWorkDivision,
  fetchGetWorkHistories,
  fetchPostCreateWorkHistory,
  fetchPutUpdateWorkHistory,
  fetchDeleteWorkHistory,
  type WorkCodeResp,
  type WorkHistoryResp,
  type CreateWorkHistoryReq,
  type CreateWorkHistoryResp,
  type UpdateWorkHistoryReq
} from '@/lib/api/work'

const workKeys = createQueryKeys('works')

// 업무 그룹 조회 훅
export const useWorkGroupsQuery = () => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'groups' }),
    queryFn: () => fetchGetWorkGroups()
  })
}

// 업무 파트 라벨 조회 훅
export const useWorkPartLabelQuery = (parentWorkCodeSeq: number) => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'partLabel', parentWorkCodeSeq }),
    queryFn: () => fetchGetWorkPartLabel(parentWorkCodeSeq),
    enabled: !!parentWorkCodeSeq
  })
}

// 업무 파트 조회 훅
export const useWorkPartsQuery = (parentWorkCodeSeq: number) => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'parts', parentWorkCodeSeq }),
    queryFn: () => fetchGetWorkParts(parentWorkCodeSeq),
    enabled: !!parentWorkCodeSeq
  })
}

// 업무 구분 조회 훅
export const useWorkDivisionQuery = () => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'division' }),
    queryFn: () => fetchGetWorkDivision()
  })
}

// 업무 히스토리 조회 훅
export const useWorkHistoriesQuery = () => {
  return useQuery<WorkHistoryResp[]>({
    queryKey: workKeys.lists(),
    queryFn: () => fetchGetWorkHistories()
  })
}

// 업무 히스토리 생성 Mutation 훅
export const usePostCreateWorkHistoryMutation = () => {
  return useMutation<CreateWorkHistoryResp, Error, CreateWorkHistoryReq>({
    mutationFn: (data: CreateWorkHistoryReq) => fetchPostCreateWorkHistory(data)
  })
}

// 업무 히스토리 수정 Mutation 훅
export const usePutUpdateWorkHistoryMutation = () => {
  return useMutation<void, Error, UpdateWorkHistoryReq>({
    mutationFn: (data: UpdateWorkHistoryReq) => fetchPutUpdateWorkHistory(data)
  })
}

// 업무 히스토리 삭제 Mutation 훅
export const useDeleteWorkHistoryMutation = () => {
  return useMutation<void, Error, number>({
    mutationFn: (workHistorySeq: number) => fetchDeleteWorkHistory(workHistorySeq)
  })
}
