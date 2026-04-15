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
    <nav className="space-y-6">
      {navigation.map((section, sectionIndex) => (
        <div key={section.section} className={clsx('space-y-2', sectionIndex > 0 && 'pt-2')}>
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted/85">
            {section.section}
          </p>

          {section.pages.map((page) => {
            const isActive = page.slugPath === currentSlugPath;

            return (
              <Link
                key={page.slugPath}
                href={`/docs/${page.slugPath}`}
                className={clsx(
                  'block rounded-xl border px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'border-brand/70 bg-brand/20 font-semibold text-ink shadow-soft'
                    : 'border-transparent text-muted hover:border-line/45 hover:bg-panel/55 hover:text-ink'
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
      <details className="sidebar-mobile surface-card mb-4 overflow-hidden lg:hidden">
        <summary className="sidebar-mobile-summary cursor-pointer list-none px-4 py-3 text-sm font-medium text-ink">
          Browse docs
        </summary>
        <div className="sidebar-mobile-body border-t border-line/40 px-3 pb-4 pt-3">
          <SidebarList navigation={navigation} currentSlugPath={currentSlugPath} />
        </div>
      </details>

      <aside className="sidebar surface-card sticky top-[110px] hidden max-h-[calc(100vh-8rem)] overflow-auto p-4 lg:block xl:p-5">
        <SidebarList navigation={navigation} currentSlugPath={currentSlugPath} />
      </aside>
    </>
  );
}
