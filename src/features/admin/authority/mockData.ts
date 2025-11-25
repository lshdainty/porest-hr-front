import { Authority, Role, User } from "@/features/admin/authority/types";

export const MOCK_AUTHORITIES: Authority[] = [
  // Dashboard
  { id: 'auth-1', code: 'dashboard:read', name: '대시보드 조회', group: 'Dashboard' },
  
  // Work
  { id: 'auth-2', code: 'work:read', name: '근태 현황 조회', group: 'Work' },
  { id: 'auth-3', code: 'work:write', name: '근태 신청/수정', group: 'Work' },
  { id: 'auth-4', code: 'work:approve', name: '근태 승인', group: 'Work' },
  
  // Culture
  { id: 'auth-5', code: 'culture:read', name: '문화/복지 조회', group: 'Culture' },
  { id: 'auth-6', code: 'culture:write', name: '문화/복지 신청', group: 'Culture' },
  
  // Admin - User
  { id: 'auth-7', code: 'admin:user:read', name: '사용자 조회', group: 'Admin' },
  { id: 'auth-8', code: 'admin:user:write', name: '사용자 관리', group: 'Admin' },
  
  // Admin - Company
  { id: 'auth-9', code: 'admin:company:read', name: '회사 정보 조회', group: 'Admin' },
  { id: 'auth-10', code: 'admin:company:write', name: '회사 정보 관리', group: 'Admin' },
  
  // Admin - Authority
  { id: 'auth-11', code: 'admin:authority:read', name: '권한 조회', group: 'Admin' },
  { id: 'auth-12', code: 'admin:authority:write', name: '권한 관리', group: 'Admin' },
];

export const MOCK_ROLES: Role[] = [
  { 
    id: 'role-1', 
    name: '슈퍼 관리자 (Super Admin)', 
    description: '모든 권한을 가진 최고 관리자입니다.', 
    authorityIds: MOCK_AUTHORITIES.map(a => a.id) 
  },
  { 
    id: 'role-2', 
    name: '인사 관리자 (HR Manager)', 
    description: '인사 및 근태 관리를 담당하는 관리자입니다.', 
    authorityIds: ['auth-1', 'auth-2', 'auth-3', 'auth-4', 'auth-7', 'auth-8'] 
  },
  { 
    id: 'role-3', 
    name: '일반 사용자 (User)', 
    description: '기본적인 조회 및 신청 권한을 가진 사용자입니다.', 
    authorityIds: ['auth-1', 'auth-2', 'auth-3', 'auth-5', 'auth-6'] 
  },
];

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: '김관리', email: 'admin@myhr.com', roleIds: ['role-1'], department: '경영지원팀', position: '팀장' },
  { id: 'user-2', name: '이인사', email: 'hr@myhr.com', roleIds: ['role-2'], department: '인사팀', position: '매니저' },
  { id: 'user-3', name: '박사원', email: 'park@myhr.com', roleIds: ['role-3'], department: '개발팀', position: '사원' },
  { id: 'user-4', name: '최대리', email: 'choi@myhr.com', roleIds: ['role-3'], department: '마케팅팀', position: '대리' },
  { id: 'user-5', name: '정인턴', email: 'jung@myhr.com', roleIds: [], department: '영업팀', position: '인턴' },
];
