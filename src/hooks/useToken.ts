import { useEffect, useRef, useState } from 'react';
import { useGetLoginUserInfo } from '@/api/user';
import { useAuthStore } from '@/store/AuthStore';

export const useToken = (callback: (val: boolean) => void) => {
  const savedCallback = useRef(callback);
  const [isChecking, setIsChecking] = useState(true);
  const { actions } = useAuthStore();

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
      actions.logout();
      callback(false);
    } else {
      // 인증 성공 - 이미 AuthStore에서 관리되고 있으므로 추가 설정 불필요
      callback(true);
    }
  }, [userInfo, isLoading, isError, callback, actions]);

  return { isChecking };
};