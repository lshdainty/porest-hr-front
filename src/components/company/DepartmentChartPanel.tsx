import { useMemo } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart';
import { Building2, Plus, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/shadcn/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar';
import { GetCompanyWithDepartment } from '@/api/company';

interface DepartmentChartPanelProps {
  departments: GetCompanyWithDepartment[];
}

interface StyledNodeProps {
  children: React.ReactNode;
  isRoot?: boolean;
}

export default function DepartmentChartPanel({
  departments
}: DepartmentChartPanelProps) {
  const lineColor = useMemo(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
  }, [])
  const StyledNode = ({ children, isRoot = false }: StyledNodeProps) => (
    // <div className='flex justify-center items-center'>
    //   <Card className='p-3 min-w-20 max-w-24 text-center'>
    //     {children}
    //   </Card>
    // </div>


<div className='flex justify-center items-center'>
  <Card className='
    relative
    min-w-[180px]
    max-w-[220px]
    border-0
    shadow-lg
    hover:shadow-2xl
    transition-all
    duration-300
    hover:-translate-y-2
    hover:scale-105
    bg-white
    dark:bg-card
  '>
    {/* 왼쪽 컬러 바 */}
    <div 
      className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500'
    />
    
    <CardContent className='p-4 pl-5'>
      {/* 상단 영역: 번호와 아바타 */}
      <div className='flex items-start justify-between mb-3'>
        {/* 왼쪽 상단 숫자 */}
        <span className='text-xs font-medium text-muted-foreground'>
          10
        </span>
        
        {/* 오른쪽 상단 아바타 */}
        <Avatar className='h-12 w-12 border-2 border-white shadow-md'>
          <AvatarImage src='/api/placeholder/48/48' alt='Profile' />
          <AvatarFallback className='bg-blue-500 text-white font-semibold text-sm'>
            RG
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* 직원 정보 영역 */}
      <div className='space-y-0.5'>
        {/* 이름 */}
        <h3 className='font-semibold text-sm text-foreground leading-tight'>
          Ryan Griffin
        </h3>
        
        {/* 직책 */}
        <p className='text-xs text-muted-foreground'>
          CEO & Founder
        </p>
        
        {/* 위치 정보 */}
        <div className='flex items-center gap-1 text-xs text-muted-foreground pt-0.5'>
          <span>🇬🇧</span>
          <span>United Kingdom</span>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

  );

  const renderNode = (node: GetCompanyWithDepartment) => (
    <TreeNode 
      key={node.department_id}
      label={
        <StyledNode>
          <div className='font-medium text-sm text-foreground'>{node.department_name_kr}</div>
        </StyledNode>
      }
    >
      {node.children?.map(renderNode)}
    </TreeNode>
  );

  const renderChart = (dept: GetCompanyWithDepartment) => {
    if (!dept) return null;

    return (
      <div className='flex justify-center items-center min-h-[400px] p-4'>
        <Tree
          lineWidth='2px'
          lineColor={lineColor}
          lineBorderRadius='5px'
          nodePadding='10px'
          label={
            <StyledNode isRoot={true}>
              <div className='font-bold text-base text-foreground'>{dept.department_name_kr}</div>
            </StyledNode>
          }
        >
          {dept.children?.map(renderNode)}
        </Tree>
      </div>
    );
  };

  const getTotalDeptCount = (depts: GetCompanyWithDepartment[]): number => {
    let count = 0;
    const countDepts = (deptList: GetCompanyWithDepartment[]) => {
      deptList.forEach(dept => {
        count++;
        if (dept.children && dept.children.length > 0) {
          countDepts(dept.children);
        }
      });
    };
    countDepts(depts);
    return count;
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between p-4 border-b'>
        <h2 className='text-lg font-semibold'>조직도</h2>
        <div className='flex items-center space-x-2 h-8'>
          <Users size={16} className='text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>
            전체 부서: {getTotalDeptCount(departments)}개
          </span>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        <div className='min-w-max min-h-full p-8'>
          {departments.length > 0 ? (
            <div className='org-chart-container inline-block'>
              {renderChart(departments[0])}
            </div>
          ) : (
            <div className='text-center py-12'>
              <Building2 size={48} className='mx-auto text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>부서가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
