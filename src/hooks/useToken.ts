import { useEffect, useRef, useState } from 'react';
import { useGetLoginUserInfo } from '@/api/user';

export const useToken = (callback: (val: boolean) => void) => {
  const savedCallback = useRef(callback);
  const [isChecking, setIsChecking] = useState(true);

  const { data: userInfo, isLoading, isError } = useGetLoginUserInfo();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (isLoading) {
      setIsChecking(true);
      return;
    }

    setIsChecking(false);

    if (isError || !userInfo) {
      // 인증 실패 또는 사용자 정보 없음
      localStorage.removeItem('token');
      localStorage.removeItem('key');
      callback(false);
    } else {
      // 인증 성공
      localStorage.setItem('key', 'authenticated');
      callback(true);
    }
  }, [userInfo, isLoading, isError, callback]);

  return { isChecking };
};