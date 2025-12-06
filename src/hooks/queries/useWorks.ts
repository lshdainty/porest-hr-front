'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import { fetchGetSystemTypes, type TypeResp } from '@/lib/api/type'
import {
  fetchDeleteWorkCode,
  fetchDeleteWorkHistory,
  fetchGetSystemCheckStatus,
  fetchGetTodayWorkStatus,
  fetchGetUnregisteredWorkDates,
  fetchGetUnregisteredWorkHistoryExcelDownload,
  fetchGetWorkDivision,
  fetchGetWorkGroups,
  fetchGetWorkHistories,
  fetchGetWorkHistoryExcelDownload,
  fetchGetWorkPartLabel,
  fetchGetWorkParts,
  fetchPostBulkCreateWorkHistories,
  fetchPostCreateWorkCode,
  fetchPostCreateWorkHistory,
  fetchPostToggleSystemCheck,
  fetchPutUpdateWorkCode,
  fetchPutUpdateWorkHistory,
  type BulkCreateWorkHistoryReq,
  type BulkCreateWorkHistoryResp,
  type CheckSystemStatusBatchResp,
  type CreateWorkCodeReq,
  type CreateWorkCodeResp,
  type CreateWorkHistoryReq,
  type CreateWorkHistoryResp,
  type SystemType,
  type TodayWorkStatusResp,
  type ToggleSystemCheckReq,
  type ToggleSystemCheckResp,
  type UnregisteredWorkDatesResp,
  type UnregisteredWorkHistoryDownloadReq,
  type UpdateWorkCodeReq,
  type UpdateWorkHistoryReq,
  type WorkCodeResp,
  type WorkGroupWithParts,
  type WorkHistoryResp,
  type WorkHistorySearchCondition
} from '@/lib/api/work'

// ... existing code ...

// 시스템 체크 상태 조회 훅
export const useSystemCheckStatusQuery = (systemCodes: SystemType[]) => {
  return useQuery<CheckSystemStatusBatchResp>({
    queryKey: workKeys.list({ type: 'systemCheck', systemCodes }),
    queryFn: () => fetchGetSystemCheckStatus(systemCodes),
    enabled: systemCodes.length > 0
  })
}

// 오늘 업무 시간 상태 조회 훅
export const useTodayWorkStatusQuery = () => {
  return useQuery<TodayWorkStatusResp>({
    queryKey: workKeys.list({ type: 'todayStatus' }),
    queryFn: () => fetchGetTodayWorkStatus()
  })
}

// 미작성 업무 날짜 조회 훅
export const useUnregisteredWorkDatesQuery = (year: number, month: number) => {
  return useQuery<UnregisteredWorkDatesResp>({
    queryKey: workKeys.list({ type: 'unregisteredDates', year, month }),
    queryFn: () => fetchGetUnregisteredWorkDates(year, month)
  })
}

const workKeys = createQueryKeys('works')

// 업무 그룹 조회 훅
export const useWorkGroupsQuery = () => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'groups' }),
    queryFn: () => fetchGetWorkGroups()
  })
}

// 업무 그룹 + Parts 포함 조회 훅 (모든 Label과 Part를 한번에 조회하여 병합)
export const useWorkGroupsWithPartsQuery = () => {
  return useQuery<WorkGroupWithParts[]>({
    queryKey: workKeys.list({ type: 'groupsWithParts' }),
    queryFn: async () => {
      // 1. 모든 업무 분류(Groups) 조회
      const workGroups = await fetchGetWorkGroups()

      if (!workGroups || workGroups.length === 0) return []

      // 2. 모든 업무 분류에 대한 Label 조회
      const labelsPromises = workGroups.map(group => fetchGetWorkPartLabel(group.work_code_id))
      const labelsResults = await Promise.all(labelsPromises)

      // 3. 모든 Label에 대한 Part 조회
      const allLabels = labelsResults.flat()
      const partsPromises = allLabels.map(label => fetchGetWorkParts(label.work_code_id))
      const partsResults = await Promise.all(partsPromises)
      const allParts = partsResults.flat()

      // 4. 데이터 병합 (Group -> Label -> Part)
      const mergedData: WorkGroupWithParts[] = workGroups.map(group => {
        // 해당 그룹의 라벨들 찾기
        const groupLabels = allLabels.filter(label => label.parent_work_code_id === group.work_code_id)
        const groupLabelIds = groupLabels.map(label => label.work_code_id)

        // 해당 라벨들의 파트들 찾기
        const groupParts = allParts.filter(part =>
          part.parent_work_code_id && groupLabelIds.includes(part.parent_work_code_id)
        )

        return {
          ...group,
          parts: groupParts
        }
      })

      return mergedData
    }
  })
}

// 업무 파트 라벨 조회 훅
export const useWorkPartLabelQuery = (parentWorkCodeId: number) => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'partLabel', parentWorkCodeId }),
    queryFn: () => fetchGetWorkPartLabel(parentWorkCodeId),
    enabled: !!parentWorkCodeId
  })
}

// 업무 파트 조회 훅
export const useWorkPartsQuery = (parentWorkCodeId: number) => {
  return useQuery<WorkCodeResp[]>({
    queryKey: workKeys.list({ type: 'parts', parentWorkCodeId }),
    queryFn: () => fetchGetWorkParts(parentWorkCodeId),
    enabled: !!parentWorkCodeId
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
export const useWorkHistoriesQuery = (condition?: WorkHistorySearchCondition) => {
  return useQuery<WorkHistoryResp[]>({
    queryKey: workKeys.list({ type: 'histories', ...condition }),
    queryFn: () => fetchGetWorkHistories(condition)
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
    mutationFn: (workHistoryId: number) => fetchDeleteWorkHistory(workHistoryId)
  })
}

// 업무 히스토리 일괄 생성 Mutation 훅
export const useBulkCreateWorkHistoriesMutation = () => {
  return useMutation<BulkCreateWorkHistoryResp, Error, BulkCreateWorkHistoryReq>({
    mutationFn: (data: BulkCreateWorkHistoryReq) => fetchPostBulkCreateWorkHistories(data)
  })
}

// 업무 히스토리 엑셀 다운로드 Mutation 훅
export const useWorkHistoryExcelDownloadMutation = () => {
  return useMutation<Blob, Error, WorkHistorySearchCondition | undefined>({
    mutationFn: (condition?: WorkHistorySearchCondition) => fetchGetWorkHistoryExcelDownload(condition)
  })
}

// 미등록 업무 시간 엑셀 다운로드 Mutation 훅
export const useUnregisteredWorkHistoryExcelDownloadMutation = () => {
  return useMutation<Blob, Error, UnregisteredWorkHistoryDownloadReq>({
    mutationFn: (params: UnregisteredWorkHistoryDownloadReq) => fetchGetUnregisteredWorkHistoryExcelDownload(params)
  })
}

// 시스템 체크 토글 Mutation 훅
export const useToggleSystemCheckMutation = () => {
  return useMutation<ToggleSystemCheckResp, Error, ToggleSystemCheckReq>({
    mutationFn: (data: ToggleSystemCheckReq) => fetchPostToggleSystemCheck(data)
  })
}

// 시스템 타입 목록 조회 훅
export const useSystemTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: ['system-types'],
    queryFn: () => fetchGetSystemTypes()
  });
};

// Work Code Mutations
export const usePostCreateWorkCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateWorkCodeResp, Error, CreateWorkCodeReq>({
    mutationFn: (data: CreateWorkCodeReq) => fetchPostCreateWorkCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all() });
    }
  });
};

export const usePutUpdateWorkCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateWorkCodeReq>({
    mutationFn: (data: UpdateWorkCodeReq) => fetchPutUpdateWorkCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all() });
    }
  });
};

export const useDeleteWorkCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (workCodeId: number) => fetchDeleteWorkCode(workCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workKeys.all() });
    }
  });
};
