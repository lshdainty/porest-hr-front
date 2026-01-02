import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { Textarea } from '@/components/shadcn/textarea';
import { GetUsersResp } from '@/lib/api/user';
import { WorkCodeResp, WorkGroupWithParts } from '@/lib/api/work';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/shadcn/spinner';
import { AlertCircle, Check, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/components/shadcn/sonner';
import { useTranslation } from 'react-i18next';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workGroups: WorkGroupWithParts[];
  workDivision: WorkCodeResp[];
  users: GetUsersResp[];
  onRegister: (data: any[]) => Promise<void>;
  isRegistering: boolean;
}

interface ParsedRow {
  id: number;
  date: string;
  manager_id: string;
  work_group_name: string;
  work_part_name: string;
  work_division_name: string;
  hours: string;
  content: string;
  isValid: boolean;
  errors: { [key: string]: string };
  // Mapped codes
  work_group_code?: string;
  work_part_code?: string;
  work_division_code?: string;
}

const ExcelImportDialog = ({
  open,
  onOpenChange,
  workGroups,
  workDivision,
  users,
  onRegister,
  isRegistering,
}: ExcelImportDialogProps) => {
  const { t } = useTranslation('work');
  const { t: tc } = useTranslation('common');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [validationErrorCount, setValidationErrorCount] = useState(0);
  const [delimiter, setDelimiter] = useState<string>('\t');

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep('input');
      setInputText('');
      setParsedData([]);
      setValidationErrorCount(0);
      setDelimiter('\t');
    }
  }, [open]);

  const validateRow = (row: ParsedRow): ParsedRow => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Validate Date (Simple regex YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
      errors.date = t('excel.invalidDate');
      isValid = false;
    }

    // Validate User (Name -> ID mapping happens before validation, so we check manager_id)
    if (!row.manager_id) {
      errors.manager_id = t('excel.userNotFound');
      isValid = false;
    }

    // Validate Codes
    // Find Group Code
    // Note: We use the names for initial validation from text, but codes for re-validation
    let groupCode = workGroups.find(g => g.work_code === row.work_group_code);
    if (!groupCode) {
        // Fallback to name search if code is missing (initial parse)
        groupCode = workGroups.find(g => g.work_code_name === row.work_group_name);
    }

    if (!groupCode) {
      errors.work_group_name = t('excel.invalidWorkGroup');
      isValid = false;
    }

    // Find Part Code
    let partCode;
    if (groupCode) {
       // Check if the part exists in the group's parts list
       partCode = groupCode.parts.find(p => p.work_code === row.work_part_code);
       if (!partCode) {
           partCode = groupCode.parts.find(p => p.work_code_name === row.work_part_name);
       }
    }

    if (!partCode) {
       errors.work_part_name = t('excel.invalidWorkPart');
       isValid = false;
    }

    // Find Division Code
    let divisionCode = workDivision.find(d => d.work_code === row.work_division_code);
    if (!divisionCode) {
        divisionCode = workDivision.find(d => d.work_code_name === row.work_division_name);
    }

    if (!divisionCode) {
      errors.work_division_name = t('excel.invalidWorkDivision');
      isValid = false;
    }

    return {
        ...row,
        isValid,
        errors,
        work_group_code: groupCode?.work_code,
        work_group_name: groupCode?.work_code_name || row.work_group_name,
        work_part_code: partCode?.work_code,
        work_part_name: partCode?.work_code_name || row.work_part_name,
        work_division_code: divisionCode?.work_code,
        work_division_name: divisionCode?.work_code_name || row.work_division_name,
    };
  };

  const parseAndValidate = () => {
    if (!inputText.trim()) {
      toast.error(t('excel.enterData'));
      return;
    }

    const rows = inputText.trim().split('\n');
    const parsed: ParsedRow[] = [];
    let errorCount = 0;

    rows.forEach((row, index) => {
      // Use selected delimiter
      const columns = row.split(delimiter);
      
      const date = columns[0]?.trim() || '';
      const userName = columns[1]?.trim() || ''; // 2nd column is User Name now
      const groupName = columns[2]?.trim() || '';
      const partName = columns[3]?.trim() || '';
      const divisionName = columns[4]?.trim() || '';
      const hours = columns[5]?.trim() || '';
      const content = columns[6]?.trim() || '';

      // Find User ID by Name
      const user = users.find(u => u.user_name === userName);
      const managerId = user ? user.user_id : '';

      let parsedRow: ParsedRow = {
        id: index,
        date,
        manager_id: managerId, // Set ID if found
        work_group_name: groupName,
        work_part_name: partName,
        work_division_name: divisionName,
        hours,
        content,
        isValid: true,
        errors: {},
      };

      parsedRow = validateRow(parsedRow);

      if (!parsedRow.isValid) errorCount++;
      parsed.push(parsedRow);
    });

    setParsedData(parsed);
    setValidationErrorCount(errorCount);
    setStep('preview');
  };

  const handleRevalidate = () => {
      let errorCount = 0;
      const revalidatedData = parsedData.map(row => {
          const validated = validateRow(row);
          if (!validated.isValid) errorCount++;
          return validated;
      });
      setParsedData(revalidatedData);
      setValidationErrorCount(errorCount);
      toast.success(t('excel.validationComplete'));
  };

  const handleCellChange = (id: number, field: keyof ParsedRow, value: string) => {
    setParsedData(prev => prev.map(row => {
      if (row.id !== id) return row;
      
      // Update field
      const updatedRow = { ...row, [field]: value };
      
      // Re-validate this row
      return validateRow(updatedRow);
    }));
  };

  // Handle Select Change for Codes
  const handleCodeChange = (id: number, type: 'group' | 'part' | 'division', code: string) => {
    setParsedData(prev => prev.map(row => {
      if (row.id !== id) return row;

      let updatedRow = { ...row };

      if (type === 'group') {
        const group = workGroups.find(g => g.work_code === code);
        updatedRow.work_group_code = code;
        updatedRow.work_group_name = group?.work_code_name || '';
        // Reset part when group changes
        updatedRow.work_part_code = undefined;
        updatedRow.work_part_name = '';
      } else if (type === 'part') {
        // Find part in the current group's parts
        const currentGroup = workGroups.find(g => g.work_code === updatedRow.work_group_code);
        const part = currentGroup?.parts.find(p => p.work_code === code);
        updatedRow.work_part_code = code;
        updatedRow.work_part_name = part?.work_code_name || '';
      } else if (type === 'division') {
        const division = workDivision.find(d => d.work_code === code);
        updatedRow.work_division_code = code;
        updatedRow.work_division_name = division?.work_code_name || '';
      }

      // Re-validate
      return validateRow(updatedRow);
    }));
  };

  const handleDeleteRow = (id: number) => {
    setParsedData(prev => prev.filter(row => row.id !== id));
  };

  // Update error count when parsedData changes
  useEffect(() => {
    const count = parsedData.filter(row => !row.isValid).length;
    setValidationErrorCount(count);
  }, [parsedData]);

  const handleRegister = async () => {
    if (validationErrorCount > 0) {
      toast.error(t('excel.fixErrors'));
      return;
    }

    const payload = parsedData.map(row => ({
      work_date: row.date,
      work_user_id: row.manager_id,
      work_group_code: row.work_group_code!,
      work_part_code: row.work_part_code!,
      work_class_code: row.work_division_code!,
      work_hour: Number(row.hours) || 0,
      work_content: row.content,
    }));

    await onRegister(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-7xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>{t('excel.title')}</DialogTitle>
          <DialogDescription>
            {step === 'input'
              ? t('excel.inputDesc', { comma: ',' })
              : t('excel.previewDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-hidden p-1'>
          {step === 'input' ? (
            <div className='flex flex-col h-[60vh] gap-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{t('excel.delimiterLabel')}</span>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'\t'}>{t('excel.tabExcel')}</SelectItem>
                    <SelectItem value={','}>Comma (,)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={`2024-01-01${delimiter}user123${delimiter}개발${delimiter}프론트엔드${delimiter}프로젝트${delimiter}8${delimiter}로그인 구현\n2024-01-01${delimiter}user123${delimiter}개발${delimiter}백엔드${delimiter}유지보수${delimiter}4${delimiter}버그 수정`}
                className='flex-1 font-mono text-sm resize-none'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          ) : (
            <div className='border rounded-md [&>div]:h-[60vh]'>
              <Table>
                <TableHeader className='sticky top-0 bg-white z-10'>
                  <TableRow>
                    <TableHead className='w-[50px]'>{t('excel.status')}</TableHead>
                    <TableHead className='w-[100px]'>{t('excel.date')}</TableHead>
                    <TableHead className='w-[120px]'>{t('excel.user')}</TableHead>
                    <TableHead className='w-[140px]'>{t('excel.workGroup')}</TableHead>
                    <TableHead className='w-[140px]'>{t('excel.workPart')}</TableHead>
                    <TableHead className='w-[140px]'>{t('excel.workDivision')}</TableHead>
                    <TableHead className='w-[60px]'>{t('excel.time')}</TableHead>
                    <TableHead>{t('report.content')}</TableHead>
                    <TableHead className='w-[50px]'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row) => {
                    // Filter parts based on selected group
                    const currentGroup = workGroups.find(g => g.work_code === row.work_group_code);
                    const filteredParts = currentGroup ? currentGroup.parts : [];

                    return (
                      <TableRow key={row.id} className={cn(!row.isValid && 'bg-red-50')}>
                        <TableCell>
                          {row.isValid ? (
                            <Check className='w-4 h-4 text-green-500' />
                          ) : (
                            <AlertCircle className='w-4 h-4 text-red-500' />
                          )}
                        </TableCell>
                        <TableCell className='p-1'>
                          <input 
                            className={cn('w-full bg-transparent border-none focus:ring-1 px-1', row.errors.date && 'text-red-600 font-bold')}
                            value={row.date}
                            onChange={e => handleCellChange(row.id, 'date', e.target.value)}
                            title={row.errors.date}
                          />
                        </TableCell>
                        <TableCell className='p-1'>
                          <Select
                            value={row.manager_id}
                            onValueChange={(value) => handleCellChange(row.id, 'manager_id', value)}
                          >
                            <SelectTrigger className={cn('h-8 w-full', row.errors.manager_id && 'border-red-500')}>
                              <SelectValue placeholder={tc('select')} />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.user_id} value={user.user_id}>
                                  {user.user_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='p-1'>
                          <Select
                            value={row.work_group_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'group', value)}
                          >
                            <SelectTrigger className={cn('h-8 w-full', row.errors.work_group_name && 'border-red-500')}>
                              <SelectValue placeholder={tc('select')} />
                            </SelectTrigger>
                            <SelectContent>
                              {workGroups.map((group) => (
                                <SelectItem key={group.work_code} value={group.work_code}>
                                  {group.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='p-1'>
                          <Select
                            value={row.work_part_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'part', value)}
                            disabled={!row.work_group_code}
                          >
                            <SelectTrigger className={cn('h-8 w-full', row.errors.work_part_name && 'border-red-500')}>
                              <SelectValue placeholder={tc('select')} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredParts.map((part) => (
                                <SelectItem key={part.work_code} value={part.work_code}>
                                  {part.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='p-1'>
                           <Select
                            value={row.work_division_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'division', value)}
                          >
                            <SelectTrigger className={cn('h-8 w-full', row.errors.work_division_name && 'border-red-500')}>
                              <SelectValue placeholder={tc('select')} />
                            </SelectTrigger>
                            <SelectContent>
                              {workDivision.map((division) => (
                                <SelectItem key={division.work_code} value={division.work_code}>
                                  {division.work_code_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='p-1'>
                          <input 
                            className='w-full bg-transparent border-none focus:ring-1 px-1'
                            value={row.hours}
                            onChange={e => handleCellChange(row.id, 'hours', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className='p-1'>
                          <input 
                            className='w-full bg-transparent border-none focus:ring-1 px-1'
                            value={row.content}
                            onChange={e => handleCellChange(row.id, 'content', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className='p-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50'
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {tc('cancel')}
          </Button>
          {step === 'input' ? (
            <Button onClick={parseAndValidate}>
              {t('excel.verify')}
            </Button>
          ) : (
            <>
              <Button variant='secondary' onClick={() => setStep('input')}>
                {t('excel.reenter')}
              </Button>
              <Button variant='outline' onClick={handleRevalidate}>
                {t('excel.validate')}
              </Button>
              <Button onClick={handleRegister} disabled={validationErrorCount > 0 || isRegistering}>
                {isRegistering && <Spinner className='w-4 h-4 mr-2' />}
                {validationErrorCount > 0 ? t('excel.errorsNeedFix', { count: validationErrorCount }) : t('excel.batchRegister')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ExcelImportDialog }
