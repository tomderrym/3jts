import React, {  useCallback, useEffect, useRef, useState  } from 'https://esm.sh/react@18';

export interface BlockItem {
  id: string;
  title: string;
  description?: string;
}

interface BlockDragAndDropBoardProps {
  initialBlocks?: BlockItem[];
  onChange?: (blocks: BlockItem[]) => void;
}

/**
 * Mobile-first drag & drop board for arbitrary blocks.
 * - Pointer-based drag & drop
 * - Keyboard reordering via arrow keys with Alt+ArrowUp/Alt+ArrowDown
 * - Scrollable, safe-area-aware
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
export default function BlockDragAndDropBoard: React.FC<BlockDragAndDropBoardProps> = ({
  initialBlocks,
  onChange,
}) => {
  const [blocks, setBlocks] = useState<BlockItem[]>(
    initialBlocks ?? [
      { id: 'b1', title: 'Prompt Block', description: 'System / user prompts' },
      { id: 'b2', title: 'Tools Block', description: 'Tool definitions and wiring' },
      { id: 'b3', title: 'UI Block', description: 'Rendered UI layout and state' },
      { id: 'b4', title: 'Actions Block', description: 'Server actions & side effects' },
    ],
  );

  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onChange?.(blocks);
  }, [blocks, onChange]);

  const moveBlock = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      setBlocks((prev) => {
        const fromIndex = prev.findIndex((b) => b.id === fromId);
        const toIndex = prev.findIndex((b) => b.id === toId);
        if (fromIndex === -1 || toIndex === -1) return prev;
        const clone = [...prev];
        const [item] = clone.splice(fromIndex, 1);
        clone.splice(toIndex, 0, item);
        return clone;
      });
    },
    [setBlocks],
  );

  const moveByDelta = useCallback(
    (id: string, delta: number) => {
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index === -1) return prev;
        const target = index + delta;
        if (target < 0 || target >= prev.length) return prev;
        const clone = [...prev];
        const [item] = clone.splice(index, 1);
        clone.splice(target, 0, item);
        return clone;
      });
    },
    [setBlocks],
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const currentId = (e.currentTarget as HTMLDivElement).dataset.blockId as string;
    if (!currentId) return;

    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      moveByDelta(currentId, e.key === 'ArrowUp' ? -1 : 1);
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === currentId);
        if (index === -1) return prev;
        const nextIndex = e.key === 'ArrowUp' ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= prev.length) return prev;
        const nextId = prev[nextIndex]?.id;
        if (!nextId) return prev;
        const el = containerRef.current?.querySelector<HTMLDivElement>(
          `[data-block-id="${nextId}"]`,
        );
        el?.focus();
        return prev;
      });
    }
  };

  const onDragStart = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragId && dragId !== id) {
      setDragOverId(id);
    }
  };

  const onDrop = (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceId = dragId ?? e.dataTransfer.getData('text/plain');
    if (sourceId) {
      moveBlock(sourceId, id);
    }
    setDragId(null);
    setDragOverId(null);
  };

  const onDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">Blocks layout</span>
          <span className="text-[11px] text-slate-500">
            Drag with pointer or use Alt+↑/Alt+↓ to reorder focused block.
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
          DnD
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {blocks.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No blocks yet.</div>
        ) : (
          blocks.map((block) => {
            const isDragging = dragId === block.id;
            const isOver = dragOverId === block.id && dragId !== block.id;
            return (
              <div
                key={block.id}
                data-block-id={block.id}
                role="listitem"
                draggable
                tabIndex={0}
                onDragStart={onDragStart(block.id)}
                onDragOver={onDragOver(block.id)}
                onDrop={onDrop(block.id)}
                onDragEnd={onDragEnd}
                onKeyDown={handleKeyDown}
                className={[
                  'group rounded-md border px-3 py-2 text-sm bg-slate-900/80 flex items-start gap-2 cursor-move outline-none transition-transform',
                  'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                  isDragging ? 'opacity-60 border-indigo-400/70' : 'border-slate-700',
                  isOver ? 'ring-1 ring-indigo-400' : '',
                ].join(' ')}
              >
                <div className="mt-0.5 text-slate-500 cursor-grab group-active:cursor-grabbing select-none">
                  
                  <span className="block w-1 h-1 bg-slate-500 rounded-sm mb-0.5" />
                  <span className="block w-1 h-1 bg-slate-500 rounded-sm mb-0.5" />
                  <span className="block w-1 h-1 bg-slate-500 rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-100 truncate">{block.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">{block.id}</span>
                  </div>
                  {block.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{block.description}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
