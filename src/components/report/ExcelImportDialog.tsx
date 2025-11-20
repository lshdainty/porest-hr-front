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
import { WorkCodeResp, WorkGroupWithParts } from '@/lib/api/work';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workGroups: WorkGroupWithParts[];
  workDivision: WorkCodeResp[];
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

export default function ExcelImportDialog({
  open,
  onOpenChange,
  workGroups,
  workDivision,
  onRegister,
  isRegistering,
}: ExcelImportDialogProps) {
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

  const parseAndValidate = () => {
    if (!inputText.trim()) {
      toast.error('데이터를 입력해주세요.');
      return;
    }

    const rows = inputText.trim().split('\n');
    const parsed: ParsedRow[] = [];
    let errorCount = 0;

    rows.forEach((row, index) => {
      // Use selected delimiter
      const cols = row.split(delimiter);
      
      const date = cols[0]?.trim() || '';
      const manager_id = cols[1]?.trim() || '';
      const work_group_name = cols[2]?.trim() || '';
      const work_part_name = cols[3]?.trim() || '';
      const work_division_name = cols[4]?.trim() || '';
      const hours = cols[5]?.trim() || '0';
      const content = cols[6]?.trim() || '';

      const errors: { [key: string]: string } = {};
      let isValid = true;

      // Validate Date (Simple regex YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.date = '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)';
        isValid = false;
      }

      // Validate ID
      if (!manager_id) {
        errors.manager_id = '사번을 입력해주세요';
        isValid = false;
      }

      // Validate Codes
      // Find Group Code
      const groupCode = workGroups.find(g => g.work_code_name === work_group_name);
      if (!groupCode) {
        errors.work_group_name = '존재하지 않는 업무 분류입니다';
        isValid = false;
      }

      // Find Part Code
      let partCode;
      if (groupCode) {
         // Check if the part exists in the group's parts list
         partCode = groupCode.parts.find(p => p.work_code_name === work_part_name);
      }
      
      if (!partCode) {
         errors.work_part_name = '존재하지 않는 업무 파트이거나 해당 분류에 속하지 않습니다';
         isValid = false;
      }

      // Find Division Code
      const divisionCode = workDivision.find(d => d.work_code_name === work_division_name);
      if (!divisionCode) {
        errors.work_division_name = '존재하지 않는 업무 구분입니다';
        isValid = false;
      }

      if (!isValid) errorCount++;

      parsed.push({
        id: index,
        date,
        manager_id,
        work_group_name,
        work_part_name,
        work_division_name,
        hours,
        content,
        isValid,
        errors,
        work_group_code: groupCode?.work_code,
        work_part_code: partCode?.work_code,
        work_division_code: divisionCode?.work_code,
      });
    });

    setParsedData(parsed);
    setValidationErrorCount(errorCount);
    setStep('preview');
  };

  const handleCellChange = (id: number, field: keyof ParsedRow, value: string) => {
    setParsedData(prev => prev.map(row => {
      if (row.id !== id) return row;
      
      // Update field
      const updatedRow = { ...row, [field]: value };
      
      // Re-validate this row
      const errors: { [key: string]: string } = {};
      let isValid = true;

      // Re-validate Date
      if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedRow.date)) {
        errors.date = '날짜 형식이 올바르지 않습니다';
        isValid = false;
      }
      if (!updatedRow.manager_id) {
        errors.manager_id = '사번 필수';
        isValid = false;
      }

      // Re-validate Codes
      const groupCode = workGroups.find(g => g.work_code_name === updatedRow.work_group_name);
      if (!groupCode) {
        errors.work_group_name = 'Invalid Group';
        isValid = false;
      }

      let partCode;
      if (groupCode) {
         partCode = groupCode.parts.find(p => p.work_code_name === updatedRow.work_part_name);
      }
      if (!partCode) {
         errors.work_part_name = 'Invalid Part';
         isValid = false;
      }

      const divisionCode = workDivision.find(d => d.work_code_name === updatedRow.work_division_name);
      if (!divisionCode) {
        errors.work_division_name = 'Invalid Division';
        isValid = false;
      }

      return {
        ...updatedRow,
        isValid,
        errors,
        work_group_code: groupCode?.work_code,
        work_part_code: partCode?.work_code,
        work_division_code: divisionCode?.work_code,
      };
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
      const errors: { [key: string]: string } = {};
      let isValid = true;

      if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedRow.date)) {
        errors.date = '날짜 형식이 올바르지 않습니다';
        isValid = false;
      }
      if (!updatedRow.manager_id) {
        errors.manager_id = '사번 필수';
        isValid = false;
      }

      const groupCode = workGroups.find(g => g.work_code === updatedRow.work_group_code);
      if (!groupCode) {
        errors.work_group_name = 'Invalid Group';
        isValid = false;
      }

      let partCode;
      if (groupCode) {
         partCode = groupCode.parts.find(p => p.work_code === updatedRow.work_part_code);
      }
      if (!partCode) {
         errors.work_part_name = 'Invalid Part';
         isValid = false;
      }

      const divisionCode = workDivision.find(d => d.work_code === updatedRow.work_division_code);
      if (!divisionCode) {
        errors.work_division_name = 'Invalid Division';
        isValid = false;
      }

      return {
        ...updatedRow,
        isValid,
        errors
      };
    }));
  };

  // Update error count when parsedData changes
  useEffect(() => {
    const count = parsedData.filter(row => !row.isValid).length;
    setValidationErrorCount(count);
  }, [parsedData]);

  const handleRegister = async () => {
    if (validationErrorCount > 0) {
      toast.error('오류가 있는 항목을 수정해주세요.');
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
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>엑셀 데이터 임포트</DialogTitle>
          <DialogDescription>
            {step === 'input' 
              ? '엑셀이나 CSV 데이터를 복사하여 아래에 붙여넣으세요. (형식: 날짜, 사번, 업무분류, 업무파트, 업무구분, 시간, 내용)' 
              : '데이터를 확인하고 오류가 있는 항목을 수정하세요.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-1">
          {step === 'input' ? (
            <div className="flex flex-col h-full gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">구분자 선택:</span>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'\t'}>Tab (엑셀)</SelectItem>
                    <SelectItem value={','}>Comma (,)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={`2024-01-01${delimiter}user123${delimiter}개발${delimiter}프론트엔드${delimiter}프로젝트${delimiter}8${delimiter}로그인 구현\n2024-01-01${delimiter}user123${delimiter}개발${delimiter}백엔드${delimiter}유지보수${delimiter}4${delimiter}버그 수정`}
                className="flex-1 font-mono text-sm resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          ) : (
            <div className="border rounded-md h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-[100px]">날짜</TableHead>
                    <TableHead className="w-[80px]">사번</TableHead>
                    <TableHead className="w-[140px]">업무분류</TableHead>
                    <TableHead className="w-[140px]">업무파트</TableHead>
                    <TableHead className="w-[140px]">업무구분</TableHead>
                    <TableHead className="w-[60px]">시간</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead className="w-[50px]">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row) => {
                    // Filter parts based on selected group
                    const currentGroup = workGroups.find(g => g.work_code === row.work_group_code);
                    const filteredParts = currentGroup ? currentGroup.parts : [];

                    return (
                      <TableRow key={row.id} className={cn(!row.isValid && "bg-red-50")}>
                        <TableCell className="p-1">
                          <input 
                            className={cn("w-full bg-transparent border-none focus:ring-1 px-1", row.errors.date && "text-red-600 font-bold")}
                            value={row.date}
                            onChange={e => handleCellChange(row.id, 'date', e.target.value)}
                            title={row.errors.date}
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <input 
                            className={cn("w-full bg-transparent border-none focus:ring-1 px-1", row.errors.manager_id && "text-red-600 font-bold")}
                            value={row.manager_id}
                            onChange={e => handleCellChange(row.id, 'manager_id', e.target.value)}
                            title={row.errors.manager_id}
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <Select
                            value={row.work_group_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'group', value)}
                          >
                            <SelectTrigger className={cn("h-8 w-full", row.errors.work_group_name && "border-red-500")}>
                              <SelectValue placeholder="선택" />
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
                        <TableCell className="p-1">
                          <Select
                            value={row.work_part_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'part', value)}
                            disabled={!row.work_group_code}
                          >
                            <SelectTrigger className={cn("h-8 w-full", row.errors.work_part_name && "border-red-500")}>
                              <SelectValue placeholder="선택" />
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
                        <TableCell className="p-1">
                           <Select
                            value={row.work_division_code}
                            onValueChange={(value) => handleCodeChange(row.id, 'division', value)}
                          >
                            <SelectTrigger className={cn("h-8 w-full", row.errors.work_division_name && "border-red-500")}>
                              <SelectValue placeholder="선택" />
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
                        <TableCell className="p-1">
                          <input 
                            className="w-full bg-transparent border-none focus:ring-1 px-1"
                            value={row.hours}
                            onChange={e => handleCellChange(row.id, 'hours', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <input 
                            className="w-full bg-transparent border-none focus:ring-1 px-1"
                            value={row.content}
                            onChange={e => handleCellChange(row.id, 'content', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          {row.isValid ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          {step === 'input' ? (
            <Button onClick={parseAndValidate}>
              확인 및 검증
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setStep('input')}>
                다시 입력
              </Button>
              <Button onClick={handleRegister} disabled={validationErrorCount > 0 || isRegistering}>
                {isRegistering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {validationErrorCount > 0 ? `${validationErrorCount}개 오류 수정 필요` : '일괄 등록'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
