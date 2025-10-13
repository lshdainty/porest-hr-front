import { useMemo } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart';
import { Building2, Plus, Users } from 'lucide-react';
import { Card } from '@/components/shadcn/card'
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
    <div className='flex justify-center items-center'>
      <Card className='p-3 min-w-20 max-w-24 text-center'>
        {children}
      </Card>
    </div>
  );

  const renderNode = (node: GetCompanyWithDepartment) => (
    <TreeNode 
      key={node.department_id}
      label={
        <StyledNode>
          <div className="font-medium text-sm text-foreground">{node.department_name_kr}</div>
        </StyledNode>
      }
    >
      {node.children?.map(renderNode)}
    </TreeNode>
  );

  const renderChart = (dept: GetCompanyWithDepartment) => {
    if (!dept) return null;

    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <Tree
          lineWidth="2px"
          lineColor={lineColor}
          lineBorderRadius="5px"
          nodePadding="10px"
          label={
            <StyledNode isRoot={true}>
              <div className="font-bold text-base text-foreground">{dept.department_name_kr}</div>
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">조직도</h2>
        <div className="flex items-center space-x-2 h-8">
          <Users size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            전체 부서: {getTotalDeptCount(departments)}개
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex justify-center items-center h-full">
          {departments.length > 0 ? (
            <div className="org-chart-container">
              {renderChart(departments[0])}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">부서가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
