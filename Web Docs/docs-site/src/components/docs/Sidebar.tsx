import type { NavSection } from '@/lib/docs';
import clsx from 'clsx';
import Link from 'next/link';

type SidebarProps = {
  navigation: NavSection[];
  currentSlugPath: string;
};

function SidebarList({
  navigation,
  currentSlugPath,
}: {
  navigation: NavSection[];
  currentSlugPath: string;
}) {
  return (
    <nav className="space-y-5">
      {navigation.map((section, sectionIndex) => (
        <div key={section.section} className={clsx('space-y-1.5', sectionIndex > 0 && 'pt-1')}>
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted/90">
            {section.section}
          </p>

          {section.pages.map((page) => {
            const isActive = page.slugPath === currentSlugPath;

            return (
              <Link
                key={page.slugPath}
                href={`/docs/${page.slugPath}`}
                className={clsx(
                  'block rounded-xl px-2 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-brand/12 font-medium text-brand'
                    : 'text-ink/80 hover:bg-ink/5 hover:text-ink'
                )}
              >
                {page.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar({ navigation, currentSlugPath }: SidebarProps) {
  return (
    <>
      <details className="surface-card mb-4 overflow-hidden lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
          Browse docs
        </summary>
        <div className="border-t border-line/80 px-2 pb-4 pt-3">
          <SidebarList navigation={navigation} currentSlugPath={currentSlugPath} />
        </div>
      </details>

      <aside className="surface-card sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-auto p-4 lg:block xl:p-5">
        <SidebarList navigation={navigation} currentSlugPath={currentSlugPath} />
      </aside>
    </>
  );
}
