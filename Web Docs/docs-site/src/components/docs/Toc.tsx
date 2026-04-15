import type { TocItem } from '@/lib/docs';
import clsx from 'clsx';

type TocProps = {
  items: TocItem[];
};

export function DocsToc({ items }: TocProps) {
  return (
    <aside className="surface-card sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-auto p-4 xl:block">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Headings will appear here as you add sections.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {items.map((item) => (
            <li key={`${item.id}-${item.depth}`}>
              <a
                href={`#${item.id}`}
                className={clsx(
                  'block rounded-lg py-1 text-sm text-ink/75 transition-colors hover:text-brand',
                  item.depth === 3 ? 'pl-4' : 'pl-0'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
