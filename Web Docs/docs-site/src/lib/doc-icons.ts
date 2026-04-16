export type DocIconName =
  | 'home'
  | 'rocket'
  | 'download'
  | 'sliders'
  | 'grid'
  | 'list'
  | 'book'
  | 'blocks'
  | 'map'
  | 'file';

export function inferDocIconName(section: string, slugPath: string): DocIconName | null {
  if (slugPath === 'home') {
    return 'home';
  }

  if (slugPath === 'getting-started') {
    return 'rocket';
  }

  if (slugPath === 'installation') {
    return 'download';
  }

  if (slugPath === 'usage') {
    return 'sliders';
  }

  if (slugPath === 'widgets') {
    return 'grid';
  }

  if (slugPath === 'changelog') {
    return 'list';
  }

  if (slugPath === 'contributing') {
    return 'book';
  }

  if (slugPath.startsWith('components/')) {
    return 'blocks';
  }

  if (slugPath.startsWith('guides/')) {
    return 'map';
  }

  if (section.toLowerCase() === 'reference') {
    return 'book';
  }

  if (section.toLowerCase() === 'components') {
    return 'blocks';
  }

  if (section.toLowerCase() === 'guides') {
    return 'map';
  }

  if (section.toLowerCase() === 'resources') {
    return 'file';
  }

  if (section.toLowerCase() === 'get started') {
    return 'file';
  }

  return 'file';
}
