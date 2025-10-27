'use client';

import {
  useGetGrantMethodTypes,
  useGetGrantTimingTypes,
  useGetRepeatUnitTypes,
  useGetVacationTypes
} from '@/api/type';
import { useGetVacationPolicies, type GetVacationPoliciesResp } from '@/api/vacation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/shadcn/alertDialog';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
} from '@/components/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdownMenu';
import { Input } from '@/components/shadcn/input';
import {
  Calendar,
  Clock,
  Edit,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { VacationPolicyFormDialog } from '@/components/vacation/VacationPolicyFormDialog';

export function VacationPolicyLists() {
  const { data: vacationPolicies, isLoading } = useGetVacationPolicies();
  const { data: grantMethodTypes } = useGetGrantMethodTypes();
  const { data: grantTimingTypes } = useGetGrantTimingTypes();
  const { data: repeatUnitTypes } = useGetRepeatUnitTypes();
  const { data: vacationTypes } = useGetVacationTypes();

  const [searchQuery, setSearchQuery] = useState('');
  const [formDialog, setFormDialog] = useState<{ open: boolean; policy: GetVacationPoliciesResp | null }>({ open: false, policy: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; policy: GetVacationPoliciesResp | null }>({ open: false, policy: null });

  const filteredPolicies = (vacationPolicies || []).filter(
    policy =>
      policy.vacation_policy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (policy.vacation_policy_desc && policy.vacation_policy_desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper 함수: code로 displayName 찾기
  const getDisplayName = (code: string | null | undefined, types: Array<{ code: string; name: string }> | undefined) => {
    if (!code || !types) return code || '-';
    const type = types.find(t => t.code === code);
    return type ? type.name : code;
  };

  const openCreateForm = () => {
    setFormDialog({ open: true, policy: null });
  };

  const openEditForm = (policy: GetVacationPoliciesResp) => {
    setFormDialog({ open: true, policy });
  };

  const handleFormSave = (data: any) => {
    // TODO: API 호출하여 저장
    console.log('Form saved:', data);
    setFormDialog({ open: false, policy: null });
  };

  const deletePolicy = (policy: GetVacationPoliciesResp) => {
    setDeleteDialog({ open: true, policy });
  };

  const confirmDelete = () => {
    if (deleteDialog.policy) {
      // TODO: 삭제 API 구현 필요
      console.log('Delete policy:', deleteDialog.policy.vacation_policy_id);
      setDeleteDialog({ open: false, policy: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {/* 헤더 영역 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">휴가 정책 관리</h1>
        <p className="text-muted-foreground">회사의 휴가 정책을 관리할 수 있습니다.</p>
      </div>

      {/* 검색 및 리스트 영역 */}
      <div className="flex flex-col gap-4">
        {/* 검색 영역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="휴가 정책 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <div className="text-sm text-muted-foreground">총 {filteredPolicies.length}개 정책</div>
          </div>
          <Button onClick={openCreateForm} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 휴가 정책 추가
          </Button>
        </div>

        {/* 정책 리스트 */}
        <div className="flex flex-col gap-4">
          {filteredPolicies.map(policy => (
            <Card key={policy.vacation_policy_id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-start pt-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{policy.vacation_policy_name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getDisplayName(policy.grant_method, grantMethodTypes)}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            {getDisplayName(policy.vacation_type, vacationTypes)}
                          </Badge>
                        </div>
                      </div>
                      {policy.vacation_policy_desc && (
                        <p className="text-muted-foreground text-sm">{policy.vacation_policy_desc}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>부여 시간: {policy.grant_time_str}</span>
                        </div>
                        {policy.repeat_unit && policy.repeat_interval && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {policy.repeat_interval} {getDisplayName(policy.repeat_unit, repeatUnitTypes)} 마다 반복
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        {policy.grant_method === 'REPEAT_GRANT' && (
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-950/30 dark:border-purple-900">
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              <span className="font-medium">반복 부여:</span>{' '}
                              {policy.repeat_interval} {getDisplayName(policy.repeat_unit, repeatUnitTypes)} 마다
                              {policy.specific_months && ` (${policy.specific_months}월)`}
                              {policy.specific_days && ` (${policy.specific_days}일)`}
                            </p>
                          </div>
                        )}
                        {policy.grant_timing && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-900">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <span className="font-medium">부여 시점:</span> {getDisplayName(policy.grant_timing, grantTimingTypes)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditForm(policy)}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deletePolicy(policy)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPolicies.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery ? '검색 결과가 없습니다.' : '등록된 휴가 정책이 없습니다.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, policy: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>휴가 정책 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{deleteDialog.policy?.vacation_policy_name}' 휴가 정책을 삭제하시겠습니까?
              <br />
              기존에 부여된 휴가나 사용 내역은 삭제되지 않지만, 더 이상 새로운 휴가가 부여되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VacationPolicyFormDialog
        isOpen={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, policy: null })}
        onSave={handleFormSave}
        initialData={formDialog.policy as any}
        isEditing={!!formDialog.policy}
        grantMethodTypes={grantMethodTypes}
      />
    </div>
  );
}
