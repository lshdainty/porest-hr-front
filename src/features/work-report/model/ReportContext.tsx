import { WorkHistory } from '@/features/work-report/model/types';
import dayjs from 'dayjs';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export interface FilterState {
  startDate: Date | undefined;
  endDate: Date | undefined;
  filterName: string;
  sortOrder: 'latest' | 'oldest';
  selectedWorkGroup: string;
  selectedWorkPart: string;
  selectedWorkDivision: string;
}

interface ReportContextType {
  // Filter State
  filters: FilterState;
  activeFilters: FilterState;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  handleSearch: () => void;
  handleResetFilters: () => void;
  activeFiltersCount: number;

  // Table State
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  editingRow: number | null;
  setEditingRow: React.Dispatch<React.SetStateAction<number | null>>;
  editData: WorkHistory | null;
  setEditData: React.Dispatch<React.SetStateAction<WorkHistory | null>>;
  updateEditData: (field: keyof WorkHistory, value: any) => void;

  // Excel State
  isExcelImportOpen: boolean;
  setIsExcelImportOpen: (open: boolean) => void;
}

const ReportContext = createContext<ReportContextType | null>(null);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const initialFilters: FilterState = {
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
    filterName: '',
    sortOrder: 'latest',
    selectedWorkGroup: 'all',
    selectedWorkPart: 'all',
    selectedWorkDivision: 'all',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    setActiveFilters(filters);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (activeFilters.startDate) count++;
    if (activeFilters.endDate) count++;
    if (activeFilters.filterName) count++;
    if (activeFilters.sortOrder !== 'latest') count++;
    if (activeFilters.selectedWorkGroup !== 'all') count++;
    if (activeFilters.selectedWorkPart !== 'all') count++;
    if (activeFilters.selectedWorkDivision !== 'all') count++;
    return count;
  }, [activeFilters]);

  // Table State
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<WorkHistory | null>(null);

  const updateEditData = useCallback((field: keyof WorkHistory, value: any) => {
    setEditData((prev) => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Excel State
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);

  return (
    <ReportContext.Provider value={{
      filters,
      activeFilters,
      isFilterOpen,
      setIsFilterOpen,
      setFilters,
      handleFilterChange,
      handleSearch,
      handleResetFilters,
      activeFiltersCount: getActiveFiltersCount(),
      selectedRows,
      setSelectedRows,
      editingRow,
      setEditingRow,
      editData,
      setEditData,
      updateEditData,
      isExcelImportOpen,
      setIsExcelImportOpen,
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error('Cannot find ReportProvider');
  return context;
};
