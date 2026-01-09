/**
 * 개발 환경 워터마크 컴포넌트
 * production 환경이 아닐 때 화면 중앙에 "DEV" 워터마크를 표시합니다.
 */
export const EnvWatermark = () => {
  // production 환경에서는 표시하지 않음
  if (import.meta.env.PROD) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]">
      <span className="text-7xl font-bold text-gray-500/10 select-none tracking-widest">
        DEVELOPMENT
      </span>
    </div>
  )
}
