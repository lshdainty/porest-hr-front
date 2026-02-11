import { useActiveNoticesQuery, useNoticeQuery } from '@/entities/notice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NoticePopup } from './NoticePopup';

const STORAGE_KEY = 'notice_popup_hidden_date';

/**
 * 오늘 공지사항 팝업을 숨겼는지 확인
 */
const isAllHiddenToday = (): boolean => {
  const hiddenDate = localStorage.getItem(STORAGE_KEY);
  if (!hiddenDate) return false;
  const today = new Date().toDateString();
  return hiddenDate === today;
};

/**
 * 오늘 날짜로 공지사항 팝업 숨김 설정
 */
const hideAllToday = (): void => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEY, today);
};

/**
 * 공지사항 팝업 컨테이너
 * 로그인 후 활성 공지사항을 팝업으로 보여주는 컴포넌트
 */
export const NoticePopupContainer = () => {
  const [hiddenToday, setHiddenToday] = useState(() => isAllHiddenToday());
  const { data: activeNotices, isLoading: isLoadingList } = useActiveNoticesQuery(0, 50);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 활성 공지사항 목록
  const notices = useMemo(() => {
    if (!activeNotices?.content) return [];
    return activeNotices.content;
  }, [activeNotices]);

  // 현재 표시할 공지사항 ID
  const currentNoticeId = useMemo(() => {
    if (notices.length === 0 || currentIndex >= notices.length) return null;
    return notices[currentIndex].notice_id;
  }, [notices, currentIndex]);

  // 현재 공지사항 상세 조회
  const { data: currentNotice, isLoading: isLoadingDetail } = useNoticeQuery(
    isOpen ? currentNoticeId : null
  );

  // 데이터 로드 완료 후 첫 팝업 열기
  useEffect(() => {
    if (!isLoadingList && notices.length > 0 && !initialized && !hiddenToday) {
      setCurrentIndex(0);
      setIsOpen(true);
      setInitialized(true);
    }
  }, [isLoadingList, notices.length, initialized, hiddenToday]);

  // 오늘 보지 않기 체크 시 호출
  const handleHideToday = useCallback(() => {
    hideAllToday();
    setHiddenToday(true);
    setIsOpen(false);
  }, []);

  // 다음 공지사항으로 이동
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // 다음 공지사항이 있으면 표시
    setTimeout(() => {
      if (currentIndex < notices.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsOpen(true);
      }
    }, 300); // 애니메이션을 위한 딜레이
  }, [currentIndex, notices.length]);

  // 오늘 숨김 처리되었으면 렌더링하지 않음
  if (hiddenToday) {
    return null;
  }

  // 표시할 공지사항이 없으면 렌더링하지 않음
  if (isLoadingList || notices.length === 0 || currentIndex >= notices.length) {
    return null;
  }

  // 상세 로딩 중이거나 데이터가 없으면 렌더링하지 않음
  if (!currentNotice || isLoadingDetail) {
    return null;
  }

  return (
    <NoticePopup
      isOpen={isOpen}
      onClose={handleClose}
      onHideToday={handleHideToday}
      title={currentNotice.title}
      content={currentNotice.content}
    />
  );
};
