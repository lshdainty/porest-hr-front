import { GetUsersResp, type PutUserReq } from '@/lib/api/user';
import { usePostUploadProfileMutation } from '@/hooks/queries/useUsers';
import { Alert, AlertDescription } from '@/components/shadcn/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Separator } from '@/components/shadcn/separator';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Spinner } from '@/components/shadcn/spinner';
import config from '@/config/config';
import { companyOptions, departmentOptions } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {
  AlertCircle,
  Briefcase,
  Building2,
  Cake,
  Camera,
  Clock,
  Loader2,
  Mail,
  Moon,
  Shield,
  Trash2,
  Upload,
  User as UserIcon,
  UserRound,
  UserRoundCog
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  user_name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  user_id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  user_email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  user_birth: z.string().min(1, { message: '생년월일을 입력해주세요.' }),
  user_origin_company_type: z.string().min(1, { message: '회사를 선택해주세요.' }),
  user_department_type: z.string().min(1, { message: '부서를 선택해주세요.' }),
  lunar_yn: z.string().min(1, { message: '음력여부를 선택해주세요.' }),
  user_work_time: z.string().min(1, { message: '유연근무시간을 선택해주세요.' }),
  user_role_type: z.string().min(1, { message: '권한을 선택해주세요.' }),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: GetUsersResp;
  onSave: (updatedUser: PutUserReq) => void;
}

// 이미지 URL 변환 유틸리티 함수
const getFullImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // 이미 완전한 URL인 경우
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 상대 경로인 경우 baseUrl과 결합
  return `${config.baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

// 이미지 압축 유틸리티 함수
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export default function UserEditDialog({ open, onOpenChange, user, onSave }: UserEditDialogProps) {
  const { mutateAsync: uploadProfile, isPending: isUploading } = usePostUploadProfileMutation();
  
  // 이미지 업로드 관련 상태 관리 - 초기값부터 완전한 URL로 설정
  const [profileImage, setProfileImage] = useState<string>(getFullImageUrl(user.profile_url || ''));
  const [profileUUID, setProfileUUID] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      user_id: '',
      user_email: '',
      user_birth: dayjs().format('YYYY-MM-DD'),
      user_origin_company_type: companyOptions[0].company_type,
      user_department_type: departmentOptions[0].department_type,
      lunar_yn: 'N',
      user_work_time: '9 ~ 6',
      user_role_type: 'USER',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        ...user,
        user_origin_company_type: user.user_origin_company_type || companyOptions[0].company_type,
        user_department_type: user.user_department_type || departmentOptions[0].department_type,
        lunar_yn: user.lunar_yn || 'N',
      });
      setProfileImage(getFullImageUrl(user.profile_url || ''));
      setProfileUUID('');
      setUploadError('');
      setUploadSuccess(false);
    }
  }, [open, user, form]);

  // 이미지 파일 선택 핸들러
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러 - 이미지 업로드 및 압축 처리
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setUploadError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploadError('');
    setUploadSuccess(false);

    try {
      // 이미지 압축 처리
      const compressedFile = await compressImage(file);
      
      const data = await uploadProfile(compressedFile);

      console.log(data);

      // 성공 시 이미지 URL 업데이트 - 완전한 URL로 변환
      setProfileImage(getFullImageUrl(data.profile_url));
      setProfileUUID(data.profile_uuid);
      setUploadSuccess(true);
      
      // 성공 메시지를 3초 후 자동 숨김
      setTimeout(() => setUploadSuccess(false), 3000);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 프로필 이미지 삭제 핸들러
  const handleImageDelete = async () => {
    if (!profileImage) return;

    setProfileImage('');
    setProfileUUID('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const onSubmit = (values: UserFormValues) => {
    // 업데이트된 사용자 정보에 프로필 이미지 URL 포함
    // 저장할 때는 상대 경로만 저장 (서버에서 받은 원본 경로)
    const imagePathForSave = profileImage ? profileImage.replace(config.baseUrl, '') : '';
    
    onSave({ 
      ...user, 
      ...values, 
      profile_url: imagePathForSave, // 상대 경로로 저장
      profile_uuid: profileUUID
    });
    onOpenChange(false);
  };

  const workTimeOptions = [
    { value: '8 ~ 5', className: 'text-rose-500 dark:text-rose-400' },
    { value: '9 ~ 6', className: 'text-sky-500 dark:text-sky-400' },
    { value: '10 ~ 7', className: 'text-emerald-500 dark:text-emerald-400' }
  ];
  const roleOptions = [
    { value: 'ADMIN', className: 'text-rose-500 dark:text-rose-400' },
    { value: 'USER', className: 'text-sky-500 dark:text-sky-400' }
  ];

  const selectedWorkTime = workTimeOptions.find(option => option.value === form.watch('user_work_time'));
  const selectedRole = roleOptions.find(option => option.value === form.watch('user_role_type'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>사용자 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-6 p-6">
              <div className="w-1/3 flex flex-col items-center justify-center gap-4">
                <div className="relative group">
                  {isUploading ? (
                    <div className="relative">
                      <Skeleton className="w-40 h-40 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%] animate-pulse" 
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200px 100%',
                          animation: 'shimmer 1.5s infinite linear'
                        }} 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-xs text-muted-foreground font-medium">처리 중...</span>
                        </div>
                      </div>
                      <style jsx>{`
                        @keyframes shimmer {
                          0% { background-position: -200px 0; }
                          100% { background-position: calc(200px + 100%) 0; }
                        }
                      `}</style>
                    </div>
                  ) : (
                    <Avatar className="w-40 h-40">
                      <AvatarImage 
                        src={profileImage} 
                        alt={form.watch('user_name')}
                        onError={(e) => {
                          console.error('이미지 로드 오류:', profileImage);
                          // 이미지 로드 실패 시 기본 이미지로 fallback
                          (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
                        }}
                      />
                      <AvatarFallback>{form.watch('user_name').charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  {/* 개선된 호버 아이콘 효과 - 버튼 대신 아이콘 컨테이너 사용 */}
                  {!isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 rounded-full cursor-pointer">
                      <div className="flex gap-2">
                        {/* 업로드/변경 아이콘 */}
                        <div
                          className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full 
                                     hover:bg-primary/80 hover:scale-110 hover:shadow-lg hover:shadow-primary/30 
                                     transition-all duration-200 cursor-pointer group/upload"
                          onClick={handleImageSelect}
                          title={profileImage ? "이미지 변경" : "이미지 업로드"}
                        >
                          {profileImage ? (
                            <Camera className="h-5 w-5 text-white group-hover/upload:scale-110 transition-transform duration-200" />
                          ) : (
                            <Upload className="h-5 w-5 text-white group-hover/upload:scale-110 transition-transform duration-200" />
                          )}
                        </div>
                        
                        {/* 삭제 아이콘 */}
                        {profileImage && (
                          <div
                            className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full 
                                       hover:bg-destructive/80 hover:scale-110 hover:shadow-lg hover:shadow-destructive/30 
                                       transition-all duration-200 cursor-pointer group/delete"
                            onClick={handleImageDelete}
                            title="이미지 삭제"
                          >
                            <Trash2 className="h-5 w-5 text-white group-hover/delete:scale-110 transition-transform duration-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 숨겨진 파일 입력 요소 */}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* 디버깅을 위한 현재 이미지 URL 표시 (개발 중에만 사용) */}
                {import.meta.env.DEV && profileImage && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted rounded text-center break-all">
                    <p className="font-medium">현재 이미지 URL:</p>
                    <p>{profileImage}</p>
                  </div>
                )}

                {/* 업로드 상태 메시지 표시 */}
                {uploadError && (
                  <Alert className="w-full" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert className="w-full border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" variant="default">
                    <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      이미지가 성공적으로 처리되었습니다.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator orientation="vertical" className="h-auto" />

              <div className="w-2/3 space-y-4">
                <Controller
                  control={form.control}
                  name="user_name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>이름</FieldLabel>
                      <Input {...field} />
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="user_id"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><UserIcon className='h-4 w-4 text-muted-foreground inline-block' /> 아이디</FieldLabel>
                        <Input {...field} disabled={user.user_id !== ''} />
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="user_email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Mail className='h-4 w-4 text-muted-foreground inline-block' /> 이메일</FieldLabel>
                        <Input {...field} />
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="user_birth"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Cake className='h-4 w-4 text-muted-foreground inline-block' /> 생년월일</FieldLabel>
                        <InputDatePicker
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        />
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="lunar_yn"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Moon className='h-4 w-4 text-muted-foreground inline-block' /> 음력여부</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="음력여부 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="user_origin_company_type"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Building2 className='h-4 w-4 text-muted-foreground inline-block' /> 회사</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="회사 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="user_department_type"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Briefcase className='h-4 w-4 text-muted-foreground inline-block' /> 부서</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="부서 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentOptions.map(option => <SelectItem key={option.department_type} value={option.department_type}>{option.department_name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="user_work_time"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Clock className='h-4 w-4 text-muted-foreground inline-block' /> 유연근무시간</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                            <SelectValue placeholder="근무 시간 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="user_role_type"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel><Shield className='h-4 w-4 text-muted-foreground inline-block' /> 권한</FieldLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <div className={cn('flex items-center gap-2', selectedRole?.className)}>
                              {field.value === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}
                              {field.value}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className={cn('flex items-center gap-2', option.className)}>
                                  {option.value === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}
                                  {option.value}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                </div>
              </div>
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {isUploading && <Spinner />}
              {isUploading ? '처리 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
