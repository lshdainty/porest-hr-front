'use client';

import {
  useGetGrantMethodTypes,
  useGetEffectiveTypes,
  useGetExpirationTypes,
  useGetVacationTypes,
} from '@/api/type';
import { useGetVacationPolicies } from '@/api/vacation';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
} from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { VacationPolicyDeleteDialog } from '@/components/vacation/VacationPolicyDeleteDialog';
import {
  Calendar,
  CalendarClock,
  Loader2,
  Repeat,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

export function VacationPolicyLists() {
  const { data: vacationPolicies, isLoading } = useGetVacationPolicies();
  const { data: grantMethodTypes } = useGetGrantMethodTypes();
  const { data: effectiveTypes } = useGetEffectiveTypes();
  const { data: expirationTypes } = useGetExpirationTypes();
  const { data: vacationTypes } = useGetVacationTypes();

  const [searchQuery, setSearchQuery] = useState('');

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
        </div>

        {/* 정책 리스트 */}
        <div className="flex flex-col gap-4">
          {filteredPolicies.map(policy => (
            <Card key={policy.vacation_policy_id} className="transition-all hover:shadow-md">
              <CardContent className="px-6">
                <div className="flex items-start justify-between">
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
                          <span>부여 시간: {policy.grant_time_str === '0' || policy.grant_time_str === '0일' ? '제한없음' : policy.grant_time_str}</span>
                        </div>
                        {policy.repeat_grant_desc && (
                          <div className="flex items-center gap-1">
                            <Repeat className="h-4 w-4" />
                            <span>{policy.repeat_grant_desc}</span>
                          </div>
                        )}
                      </div>
                      {(policy.effective_type || policy.expiration_type) && (
                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-4 w-4" />
                            <span>
                              유효기간: {getDisplayName(policy.effective_type, effectiveTypes)} ~ {getDisplayName(policy.expiration_type, expirationTypes)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                  <VacationPolicyDeleteDialog
                    policy={policy}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                  />
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
    </div>
  );
}
