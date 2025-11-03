'use client';

import {
  useGetGrantMethodTypes,
  useGetEffectiveTypes,
  useGetExpirationTypes,
  useGetRepeatUnitTypes,
  useGetVacationTypes,
  useGetVacationTimeTypes
} from '@/api/type';
import { useGetVacationPolicies, type GetVacationPoliciesResp } from '@/api/vacation';
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
import { VacationPolicyDeleteDialog } from '@/components/vacation/VacationPolicyDeleteDialog';
import { VacationPolicyFormDialog } from '@/components/vacation/VacationPolicyFormDialog';
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

export function VacationPolicyLists() {
  const { data: vacationPolicies, isLoading } = useGetVacationPolicies();
  const { data: grantMethodTypes } = useGetGrantMethodTypes();
  const { data: effectiveTypes } = useGetEffectiveTypes();
  const { data: expirationTypes } = useGetExpirationTypes();
  const { data: repeatUnitTypes } = useGetRepeatUnitTypes();
  const { data: vacationTypes } = useGetVacationTypes();
  const { data: vacationTimeTypes } = useGetVacationTimeTypes();

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
                        <div className="flex gap-3">
                          {policy.effective_type && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950/30 dark:border-blue-900 flex-1">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <span className="font-medium">발효 타입:</span> {getDisplayName(policy.effective_type, effectiveTypes)}
                              </p>
                            </div>
                          )}
                          {policy.expiration_type && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/30 dark:border-green-900 flex-1">
                              <p className="text-sm text-green-700 dark:text-green-300">
                                <span className="font-medium">만료 타입:</span> {getDisplayName(policy.expiration_type, expirationTypes)}
                              </p>
                            </div>
                          )}
                        </div>
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

      <VacationPolicyDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, policy: null })}
        policy={deleteDialog.policy}
      />

      <VacationPolicyFormDialog
        isOpen={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, policy: null })}
        onSave={handleFormSave}
        initialData={formDialog.policy as any}
        isEditing={!!formDialog.policy}
        grantMethodTypes={grantMethodTypes}
        vacationTypes={vacationTypes}
        effectiveTypes={effectiveTypes}
        expirationTypes={expirationTypes}
        repeatUnitTypes={repeatUnitTypes}
        vacationTimeTypes={vacationTimeTypes}
      />
    </div>
  );
}
