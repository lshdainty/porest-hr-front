'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/ui/shadcn/themeProvider';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/ui/shadcn/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 테마 상태를 표시 (hydration 이슈 방지)
  useEffect(() => {
    setMounted(true);
  }, [])

  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark');
  }

  // 마운트되기 전에는 기본 아이콘만 표시
  if (!mounted) {
    return (
      <Button variant='outline' size='icon'>
        <Sun className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant='outline' size='icon' onClick={toggleTheme}>
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
