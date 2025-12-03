import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Label } from '@/components/shadcn/label';
import { Loader2 } from 'lucide-react';
import { useSignUpContext } from '@/features/auth/contexts/SignUpContext';
import { useTranslation } from 'react-i18next';

const SignUpForm = () => {
  const { t } = useTranslation('auth');
  const { formData, setFormData, connectedOAuth, isPending, handleSubmit } = useSignUpContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birth">{t('signup.birthDate')}</Label>
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
          {t('signup.useLunarBirth')}
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
            {t('signup.processing')}
          </>
        ) : (
          t('signup.completeBtn')
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
