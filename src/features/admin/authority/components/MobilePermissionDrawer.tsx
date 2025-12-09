import { Button } from "@/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn/sheet";
import { Spinner } from "@/components/shadcn/spinner";
import { PermissionMatrix } from "@/features/admin/authority/components/PermissionMatrix";
import { Authority } from "@/features/admin/authority/types";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface MobilePermissionDrawerProps {
  authorities: Authority[];
  selectedAuthorityIds: string[];
  onSave: (authorityIds: string[]) => Promise<void>;
  disabled?: boolean;
}

const MobilePermissionDrawer = ({
  authorities,
  selectedAuthorityIds,
  onSave,
  disabled = false,
}: MobilePermissionDrawerProps) => {
  const { t } = useTranslation('admin');
  const [open, setOpen] = useState(false);
  const [localSelectedAuthorityIds, setLocalSelectedAuthorityIds] = useState<string[]>(selectedAuthorityIds);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state when opening the sheet
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalSelectedAuthorityIds(selectedAuthorityIds);
    }
    setOpen(newOpen);
  };

  const handleToggleLocal = (authorityId: string, checked: boolean) => {
    setLocalSelectedAuthorityIds(prev => 
      checked 
        ? [...prev, authorityId]
        : prev.filter(id => id !== authorityId)
    );
  };

  const handleToggleGroupLocal = (authorityIds: string[], checked: boolean) => {
    setLocalSelectedAuthorityIds(prev => {
      if (checked) {
        // Add all ids that are not already present
        const newIds = authorityIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        // Remove all ids
        return prev.filter(id => !authorityIds.includes(id));
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(localSelectedAuthorityIds);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save permissions:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = selectedAuthorityIds.length;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled={disabled}>
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            {t('authority.managePermissions')}
          </span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
            {t('authority.selected', { count: selectedCount })}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0 rounded-t-[10px]">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t('authority.managePermissions')}</SheetTitle>
          <SheetDescription>
            {t('authority.managePermissionsDesc')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <PermissionMatrix
            authorities={authorities}
            selectedAuthorityIds={localSelectedAuthorityIds}
            onToggleAuthority={handleToggleLocal}
            onToggleGroup={handleToggleGroupLocal}
            disabled={disabled || isSaving}
          />
        </div>

        <div className="p-4 border-t bg-background">
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Spinner />}
            {isSaving ? t('authority.saving') : t('authority.done')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobilePermissionDrawer };
