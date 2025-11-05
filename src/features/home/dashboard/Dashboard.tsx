'use client'

import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/field";
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [test, setTest] = useState('2025-11-05');
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className='flex w-full h-full p-[10px]'>
      <h1>dashboard page</h1>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
          >
            <EllipsisVertical className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem onSelect={() => setShowDialog(true)}>
            <span>버튼 클릭</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>test dialog</DialogTitle>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">test</FieldLabel>
              <InputDatePicker
                value={test}
                onValueChange={setTest}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">취소</Button>
            </DialogClose>
            <Button>전송</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}