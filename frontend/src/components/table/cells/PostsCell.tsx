import { useEffect, useRef, useState } from 'react';

type Post = {
  id: number;
  title?: string | null;
  content?: string | null;
  createdAt?: string | null;
  userId?: number | null;
};

type Props = {
  posts: Post[];
  countOnly?: boolean;
};

export default function PostsCell({ posts, countOnly = false }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const openedByClick = useRef(false);
  const count = posts.length;

    const openNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (!open) setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) return;
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 200); // small delay to bridge hover gaps and allow moving into the popover
  };

  // Toggle on click
  const toggle = () => {
    if (count === 0) return;
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
     setOpen(o => {
      const next = !o;
      openedByClick.current = next; // mark that it's open due to click/touch
      return next;
    });
  };
   const close = () => {
    openedByClick.current = false; // reset when closing programmatically
    setOpen(false);
  };

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;

    const onDocPointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onDocPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);
  
  if (countOnly) return <span>{count}</span>;

  return (
    <div ref={containerRef} 
    className="relative inline-block"
    onPointerEnter={(e) => {
      if (e.pointerType === 'mouse') openNow(); // hover to open for mouse only
    }}
    onPointerLeave={(e) => {
      if (e.pointerType === 'mouse') {
        if (!openedByClick.current) scheduleClose(); // don't auto-close if opened by click/touch
      }
    }}
    >
      <button 
      type="button" 
      className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-sm"
      aria-expanded={open}
      onClick={toggle}
      >
        {count}
      </button>

      {open && count > 0 && (
        <div 
        className="absolute z-20 mt-2 right-0
                     w-96 max-w-[min(24rem,calc(100vw-1rem))]
                     rounded-md border border-gray-200 bg-white p-3 shadow-lg"
        role="dialog"
        aria-label="User posts">
          <div className="mb-2 text-sm font-semibold text-gray-700">Posts ({count})</div>
          <ul className="flex max-h-64 flex-col gap-3 overflow-auto pr-1">
            {posts.map(p => (
              <li key={p.id}>
                <div className="text-sm font-medium text-gray-900">{p.title}</div>
                <div className="text-xs text-gray-500">
                  {p.createdAt ? new Date(p.createdAt).toLocaleString() : null}
                </div>
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {p.content}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}