import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { VacationPolicyDeleteDialog } from '@/features/admin/vacation/policy/components/VacationPolicyDeleteDialog';
import {
  useEffectiveTypesQuery,
  useExpirationTypesQuery,
  useGrantMethodTypesQuery,
  useVacationTypesQuery
} from '@/hooks/queries/useTypes';
import { Calendar, CalendarClock, Repeat, Trash2 } from 'lucide-react';

interface VacationPolicyListsProps {
  policies: any[]; // Replace 'any' with proper type if available, e.g., IVacationPolicy
  searchQuery?: string;
}

const VacationPolicyLists = ({ policies, searchQuery }: VacationPolicyListsProps) => {
  const { data: grantMethodTypes } = useGrantMethodTypesQuery();
  const { data: effectiveTypes } = useEffectiveTypesQuery();
  const { data: expirationTypes } = useExpirationTypesQuery();
  const { data: vacationTypes } = useVacationTypesQuery();

  // Helper 함수: code로 displayName 찾기
  const getDisplayName = (code: string | null | undefined, types: Array<{ code: string; name: string }> | undefined) => {
    if (!code || !types) return code || '-';
    const type = types.find(t => t.code === code);
    return type ? type.name : code;
  };

  return (
    <div className="flex flex-col gap-4">
      {policies.map(policy => (
        <Card key={policy.vacation_policy_id} className="transition-all hover:shadow-md">
          <CardContent className="p-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
                  <div className="self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {policies.length === 0 && (
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
  )
}

export { VacationPolicyLists };

