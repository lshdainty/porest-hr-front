import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import CompanyFormDialog from '@/features/admin/company/components/CompanyFormDialog';
import { PostCompanyReq } from '@/lib/api/company';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';

interface CompanyCreateCardProps {
  onCompanyCreate: (companyData: PostCompanyReq) => void;
}

const CompanyCreateCard = ({ onCompanyCreate }: CompanyCreateCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSaveCompany = (formData: PostCompanyReq | { companyId: string; data: any }): void => {
    // Since this is a create card, we assume the data is PostCompanyReq
    onCompanyCreate(formData as PostCompanyReq);
    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean): void => {
    setIsDialogOpen(open);
  };

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='text-center'>
        <CardTitle className='flex items-center justify-center space-x-2'>
          <Building2 className='text-blue-600' />
          <span>회사 정보 추가하기</span>
        </CardTitle>
        <CardDescription>회사 정보를 입력하여 시작하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className='w-full' 
          size='lg'
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className='mr-2' />
          회사 추가하기
        </Button>
        <CompanyFormDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSaveCompany}
          initialData={{}}
        />
      </CardContent>
    </Card>
  )
}

export default CompanyCreateCard
