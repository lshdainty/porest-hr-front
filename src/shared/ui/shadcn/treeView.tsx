'use client'

import { cn } from '@/shared/lib'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cva } from 'class-variance-authority'
import { ChevronRight } from 'lucide-react'
import React from 'react'

const treeVariants = cva(
  'group relative hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 transition-colors duration-200'
)

const selectedTreeVariants = cva(
  'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
)

const dragOverVariants = cva(
  'bg-primary/20 text-primary-foreground'
)

interface TreeDataItem {
  id: string
  name: string
  icon?: any
  selectedIcon?: any
  openIcon?: any
  children?: TreeDataItem[]
  actions?: React.ReactNode
  onClick?: () => void
  draggable?: boolean
  droppable?: boolean
  disabled?: boolean
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem
  initialSelectedItemId?: string
  onSelectChange?: (item: TreeDataItem | undefined) => void
  expandAll?: boolean
  defaultNodeIcon?: any
  defaultLeafIcon?: any
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  disableCollapse?: boolean
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      defaultLeafIcon,
      defaultNodeIcon,
      className,
      onDocumentDrag,
      disableCollapse,
      ...props
    },
    ref
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId)

    const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

    React.useEffect(() => {
      if (initialSelectedItemId !== selectedItemId) {
        setSelectedItemId(initialSelectedItemId)
      }
    }, [initialSelectedItemId])

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id)
        if (onSelectChange) {
          onSelectChange(item)
        }
      },
      [onSelectChange]
    )

    const handleDragStart = React.useCallback((item: TreeDataItem) => {
      setDraggedItem(item)
    }, [])

    const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
      if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
        onDocumentDrag(draggedItem, targetItem)
      }
      setDraggedItem(null)
    }, [draggedItem, onDocumentDrag])

    const expandedItemIds = React.useMemo(() => {
      // expandAll이 true이거나 disableCollapse가 true면 children이 있는 모든 노드를 확장
      if (expandAll || disableCollapse) {
        const ids: string[] = []

        function collectAllParentIds(items: TreeDataItem[] | TreeDataItem) {
          if (items instanceof Array) {
            items.forEach(item => {
              if (item.children && item.children.length > 0) {
                ids.push(item.id)
                collectAllParentIds(item.children)
              }
            })
          } else if (items.children && items.children.length > 0) {
            ids.push(items.id)
            collectAllParentIds(items.children)
          }
        }

        collectAllParentIds(data)
        return ids
      }

      if (!initialSelectedItemId) {
        return [] as string[]
      }

      const ids: string[] = []

      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string
      ) {
        if (items instanceof Array) {
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i]!.id)
            if (walkTreeItems(items[i]!, targetId) && !expandAll) {
              return true
            }
            if (!expandAll) ids.pop()
          }
        } else if (!expandAll && items.id === targetId) {
          return true
        } else if (items.children) {
          return walkTreeItems(items.children, targetId)
        }
      }

      walkTreeItems(data, initialSelectedItemId)
      return ids
    }, [data, expandAll, disableCollapse, initialSelectedItemId])

    return (
      <div className={cn('overflow-hidden relative', className)}>
        <TreeItem
          data={data}
          ref={ref}
          selectedItemId={selectedItemId}
          handleSelectChange={handleSelectChange}
          expandedItemIds={expandedItemIds}
          defaultLeafIcon={defaultLeafIcon}
          defaultNodeIcon={defaultNodeIcon}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          draggedItem={draggedItem}
          disableCollapse={disableCollapse}
          {...props}
        />
      </div>
    )
  }
)
TreeView.displayName = 'TreeView'

type TreeItemProps = TreeProps & {
  selectedItemId?: string
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  defaultNodeIcon?: any
  defaultLeafIcon?: any
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  disableCollapse?: boolean
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      defaultNodeIcon,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      disableCollapse,
      ...props
    },
    ref
  ) => {
    if (!(data instanceof Array)) {
      data = [data]
    }
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul className="flex w-full min-w-0 flex-col gap-1">
          {data.map((item) => (
            <li key={item.id} className="group/tree-item relative">
              {item.children ? (
                <TreeNode
                  item={item}
                  selectedItemId={selectedItemId}
                  expandedItemIds={expandedItemIds}
                  handleSelectChange={handleSelectChange}
                  defaultNodeIcon={defaultNodeIcon}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                  disableCollapse={disableCollapse}
                />
              ) : (
                <TreeLeaf
                  item={item}
                  selectedItemId={selectedItemId}
                  handleSelectChange={handleSelectChange}
                  defaultLeafIcon={defaultLeafIcon}
                  handleDragStart={handleDragStart}
                  handleDrop={handleDrop}
                  draggedItem={draggedItem}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  }
)
TreeItem.displayName = 'TreeItem'

const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  handleDragStart,
  handleDrop,
  draggedItem,
  disableCollapse,
}: {
  item: TreeDataItem
  handleSelectChange: (item: TreeDataItem | undefined) => void
  expandedItemIds: string[]
  selectedItemId?: string
  defaultNodeIcon?: any
  defaultLeafIcon?: any
  handleDragStart?: (item: TreeDataItem) => void
  handleDrop?: (item: TreeDataItem) => void
  draggedItem: TreeDataItem | null
  disableCollapse?: boolean
}) => {
  const [value, setValue] = React.useState(
    expandedItemIds.includes(item.id) ? [item.id] : []
  )
  const [isDragOver, setIsDragOver] = React.useState(false)
  const isSelected = selectedItemId === item.id

  // disableCollapse가 true면 항상 열린 상태 유지
  const accordionValue = disableCollapse ? [item.id] : value

  const onDragStart = (e: React.DragEvent) => {
    if (!item.draggable) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', item.id)
    handleDragStart?.(item)
  }

  const onDragOver = (e: React.DragEvent) => {
    if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
      e.preventDefault()
      setIsDragOver(true)
    }
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleDrop?.(item)
  }

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={accordionValue}
      onValueChange={(s) => {
        // disableCollapse가 true면 상태 변경 막기
        if (!disableCollapse) {
          setValue(s)
        }
      }}
    >
      <AccordionPrimitive.Item value={item.id}>
        <AccordionTrigger
          className={cn(
            'h-8 rounded-md justify-start text-left',
            treeVariants(),
            isSelected && selectedTreeVariants(),
            isDragOver && dragOverVariants(),
            disableCollapse && 'cursor-default'
          )}
          onClick={() => {
            handleSelectChange(item)
            item.onClick?.()
          }}
          draggable={!!item.draggable}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          disabled={disableCollapse}
        >
          <TreeIcon
            item={item}
            isSelected={isSelected}
            isOpen={accordionValue.includes(item.id)}
            default={defaultNodeIcon}
          />
          <span className="text-sm truncate flex-1 text-left">{item.name}</span>
          <TreeActions isSelected={isSelected}>
            {item.actions}
          </TreeActions>
        </AccordionTrigger>
        <AccordionContent className="border-sidebar-border ml-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l pl-2.5 py-0.5">
          <TreeItem
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            draggedItem={draggedItem}
            disableCollapse={disableCollapse}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

const TreeLeaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
  }
>(
  (
    {
      className,
      item,
      selectedItemId,
      handleSelectChange,
      defaultLeafIcon,
      handleDragStart,
      handleDrop,
      draggedItem,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const isSelected = selectedItemId === item.id

    const onDragStart = (e: React.DragEvent) => {
      if (!item.draggable || item.disabled) {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', item.id)
      handleDragStart?.(item)
    }

    const onDragOver = (e: React.DragEvent) => {
      if (item.droppable !== false && !item.disabled && draggedItem && draggedItem.id !== item.id) {
        e.preventDefault()
        setIsDragOver(true)
      }
    }

    const onDragLeave = () => {
      setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
      if (item.disabled) return
      e.preventDefault()
      setIsDragOver(false)
      handleDrop?.(item)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'h-8 flex text-left items-center cursor-pointer rounded-md',
          treeVariants(),
          className,
          isSelected && selectedTreeVariants(),
          isDragOver && dragOverVariants(),
          item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
        onClick={() => {
          if (item.disabled) return
          handleSelectChange(item)
          item.onClick?.()
        }}
        draggable={!!item.draggable && !item.disabled}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        {...props}
      >
        <TreeIcon
          item={item}
          isSelected={isSelected}
          default={defaultLeafIcon}
        />
        <span className="flex-grow text-sm truncate">{item.name}</span>
        <TreeActions isSelected={isSelected && !item.disabled}>
          {item.actions}
        </TreeActions>
      </div>
    )
  }
)
TreeLeaf.displayName = 'TreeLeaf'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, disabled, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 w-full items-center text-left transition-all',
        !disabled && 'first:[&[data-state=open]>svg]:first-of-type:rotate-90',
        className
      )}
      {...props}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-sidebar-foreground/50 mr-1",
          disabled && "rotate-90"
        )}
      />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-0 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

const TreeIcon = ({
  item,
  isOpen,
  isSelected,
  default: defaultIcon
}: {
  item: TreeDataItem
  isOpen?: boolean
  isSelected?: boolean
  default?: any
}) => {
  let Icon = defaultIcon
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon
  } else if (item.icon) {
    Icon = item.icon
  }
  return Icon ? (
    <Icon className="h-4 w-4 shrink-0 mr-2" />
  ) : (
    <></>
  )
}

const TreeActions = ({
  children,
  isSelected
}: {
  children: React.ReactNode
  isSelected: boolean
}) => {
  return (
    <div
      className={cn(
        isSelected ? 'block' : 'hidden',
        'absolute right-3 group-hover/tree-item:block'
      )}
    >
      {children}
    </div>
  )
}

export { TreeView, type TreeDataItem }
