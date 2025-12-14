import { useMemo } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/shadcn/card'
import { EmptyDepartment } from '@/features/admin/company/components/EmptyDepartment';
import { GetCompanyWithDepartment } from '@/lib/api/company';

interface DepartmentChartPanelProps {
  departments: GetCompanyWithDepartment[];
  showHeader?: boolean;
}

interface StyledNodeProps {
  name: string;
  description?: string;
  colorCode: string;
}

const DepartmentChartPanel = ({
  departments,
  showHeader = true
}: DepartmentChartPanelProps) => {
  const { t } = useTranslation('admin');
  const lineColor = useMemo(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
  }, [])

  const StyledNode = ({ name, description, colorCode }: StyledNodeProps) => {
    const backgroundColor = colorCode ? `var(--${colorCode})` : undefined;

    return (
      <div className='flex justify-center items-center'>
        <Card className={`
          relative
          min-w-[160px]
          max-w-[200px]
          border
          border-border
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          bg-card
          rounded-lg
          overflow-hidden
          py-0
          gap-0
        `}>
          {backgroundColor && (
            <div
              className='h-1 w-full rounded-t-lg'
              style={{ backgroundColor }}
            />
          )}
          <CardContent className='p-3'>
            <div className='space-y-1'>
              <h3 className='font-semibold text-sm text-foreground'>
                {name}
              </h3>
              {description && (
                <p className='text-xs text-muted-foreground line-clamp-2'>
                  {description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderNode = (node: GetCompanyWithDepartment) => (
    <TreeNode 
      key={node.department_id}
      label={
        <StyledNode
          name={node.department_name_kr}
          description={node.department_desc}
          colorCode={node.color_code}
        />
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
            <StyledNode
              name={dept.department_name_kr}
              description={dept.department_desc}
              colorCode={dept.color_code}
            />
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
      {showHeader && (
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>{t('department.chart')}</h2>
          <div className='flex items-center space-x-2 h-8'>
            <Users size={16} className='text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              {t('department.totalCount', { count: getTotalDeptCount(departments) })}
            </span>
          </div>
        </div>
      )}

      <div className='flex-1 overflow-auto'>
        <div className='min-w-max min-h-full p-8'>
          {departments.length > 0 ? (
            <div className='org-chart-container inline-block'>
              {renderChart(departments[0])}
            </div>
          ) : (
            <EmptyDepartment />
          )}
        </div>
      </div>
    </div>
  )
}

export { DepartmentChartPanel }
