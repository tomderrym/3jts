/**
 * BlocksBuilder Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';

interface Block {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'todo' | 'note';
}

const createInitialBlocks = (): Block[] => [
  {
    id: 'b-1',
    title: 'Welcome Block',
    description: 'Drag to reorder these building blocks. Use them to sketch flows or layouts before coding.',
    type: 'text',
  },
  {
    id: 'b-2',
    title: 'Checklist',
    description: 'Capture the steps for your next feature or experiment.',
    type: 'todo',
  },
  {
    id: 'b-3',
    title: 'Notes',
    description: 'Attach rough notes or ideas related to this screen.',
    type: 'note',
  },
];

const STORAGE_KEY = 'blocks_builder_blocks';

const BlocksBuilder: React.FC = () => {
  // Load blocks from localStorage on mount
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load blocks from localStorage:', e);
    }
    return createInitialBlocks();
  });
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Save blocks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (e) {
      console.error('Failed to save blocks to localStorage:', e);
    }
  }, [blocks]);

  const handleAddBlock: React.FormEventHandler = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    const description = newDescription.trim();
    if (!title) return;

    const next: Block = {
      id: `b-${Date.now()}`,
      title,
      description: description || 'New builder block',
      type: 'text',
    };
    setBlocks((prev) => [...prev, next]);
    setNewTitle('');
    setNewDescription('');
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const handleDragStart = (id: string) => (event: React.DragEvent<HTMLDivElement>) => {
    setDraggingId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (overId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!draggingId || draggingId === overId) return;

    const fromIndex = blocks.findIndex((b) => b.id === draggingId);
    const toIndex = blocks.findIndex((b) => b.id === overId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    moveBlock(fromIndex, toIndex);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleKeyboardMove = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    moveBlock(index, targetIndex);
  };

  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold text-slate-100 tracking-tight">Blocks Builder</h2>
          <p className="text-[11px] text-slate-400">
            Mine your ideas into ordered blocks. Drag to rearrange or add new ones below.
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
        <h3 className="text-[11px] font-medium text-slate-200 mb-1">Add Block</h3>
        <form onSubmit={handleAddBlock} className="space-y-2">
          <div className="space-y-1">
            <label
              htmlFor="block-title"
              className="block text-[11px] font-medium text-slate-300"
            >
              Title
            </label>
            <input
              id="block-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-12 rounded-lg border border-slate-700/80 bg-slate-950/70 px-2 text-xs text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              placeholder="e.g. Onboarding screen, Payment step"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="block-description"
              className="block text-[11px] font-medium text-slate-300"
            >
              Description (optional)
            </label>
            <textarea
              id="block-description"
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full min-h-16 rounded-lg border border-slate-700/80 bg-slate-950/70 px-2 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              placeholder="What does this block represent?"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex h-12 items-center rounded-lg bg-sky-500 px-3 text-[11px] font-semibold text-slate-950 shadow-sm hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newTitle.trim()}
            >
              Add block
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
        <header className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-[11px] font-medium text-slate-200">Blocks</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">{blocks.length} total</span>
            <span className="text-[9px] text-slate-600" title="Blocks are automatically saved to localStorage (key: blocks_builder_blocks)">💾</span>
          </div>
        </header>

        {blocks.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center border border-dashed border-slate-700 rounded-lg py-4">
            No blocks yet. Add a block above to start your builder.
          </p>
        ) : (
          <ol className="space-y-2" aria-label="Reorderable blocks list">
            {blocks.map((block, index) => {
              const isDragging = draggingId === block.id;
              return (
                <li key={block.id} className="group">
                  <div
                    className={`flex items-stretch gap-2 rounded-lg border px-2 py-2 bg-slate-950/70 transition-colors ${
                      isDragging
                        ? 'border-sky-500 bg-slate-900'
                        : 'border-slate-800 group-hover:border-slate-700'
                    }`}
                    draggable
                    onDragStart={handleDragStart(block.id)}
                    onDragOver={handleDragOver(block.id)}
                    onDragEnd={handleDragEnd}
                    role="listitem"
                    aria-label={block.title}
                  >
                    <button
                      type="button"
                      className="flex flex-col justify-between items-center w-10 min-w-[2.5rem] rounded-md bg-slate-900/80 border border-slate-800 text-slate-400 text-[9px] py-1 mr-1 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      aria-label={`Reorder block ${block.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          handleKeyboardMove(block.id, 'up');
                        }
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          handleKeyboardMove(block.id, 'down');
                        }
                      }}
                    >
                      <span className="text-[9px] font-semibold text-slate-300">{index + 1}</span>
                      <span className="flex flex-col gap-0.5">
                        <span className="h-0.5 w-3 rounded-full bg-slate-500" />
                        <span className="h-0.5 w-3 rounded-full bg-slate-500" />
                        <span className="h-0.5 w-3 rounded-full bg-slate-500" />
                      </span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-100 truncate">
                          {block.title}
                        </p>
                        <span className="text-[9px] px-2 h-6 inline-flex items-center rounded-full border border-slate-700/80 text-slate-300 bg-slate-900/80">
                          {block.type}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 leading-snug line-clamp-3">
                        {block.description}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-1 pl-2">
                      <button
                        type="button"
                        onClick={() => handleKeyboardMove(block.id, 'up')}
                        disabled={index === 0}
                        className="h-6 px-2 rounded-md text-[9px] text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeyboardMove(block.id, 'down')}
                        disabled={index === blocks.length - 1}
                        className="h-6 px-2 rounded-md text-[9px] text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        Down
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};

export default BlocksBuilder;
