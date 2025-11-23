import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Label } from '@/components/shadcn/label';
import { Loader2 } from 'lucide-react';
import { useSignUpContext } from '../contexts/SignUpContext';

const SignUpForm = () => {
  const { formData, setFormData, connectedOAuth, isPending, handleSubmit } = useSignUpContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birth">생년월일</Label>
        <InputDatePicker
          value={formData.birth}
          onValueChange={(value) => setFormData({...formData, birth: value || ''})}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="lunarYN"
          checked={formData.lunarYN === 'Y'}
          onCheckedChange={(checked) =>
            setFormData({...formData, lunarYN: checked ? 'Y' : 'N'})
          }
        />
        <Label htmlFor="lunarYN" className="text-sm font-normal cursor-pointer">
          음력 생일 사용
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={connectedOAuth.length === 0 || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            처리 중...
          </>
        ) : (
          '회원가입 완료'
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
