'use client';

import { Copy, Ellipsis, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type DocPageActionsProps = {
  slugPath: string;
};

type CopyStatus = 'idle' | 'copied' | 'error';

async function writeToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '-1000px';
  textarea.style.left = '-1000px';

  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('Clipboard copy failed');
  }
}

export function DocPageActions({ slugPath }: DocPageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rawContentHref = useMemo(() => `/api/docs/raw?slug=${encodeURIComponent(slugPath)}`, [slugPath]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (copyStatus === 'idle') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyStatus('idle');
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyStatus]);

  const handleCopyPage = async () => {
    try {
      const response = await fetch(rawContentHref, {
        method: 'GET',
        headers: {
          Accept: 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page markdown (${response.status})`);
      }

      const markdown = await response.text();
      await writeToClipboard(markdown);

      setCopyStatus('copied');
      setIsOpen(false);
    } catch {
      setCopyStatus('error');
      setIsOpen(false);
    }
  };

  const handleViewAsMarkdown = () => {
    setIsOpen(false);
    window.open(rawContentHref, '_blank', 'noopener,noreferrer');
  };

  const copySubtitle =
    copyStatus === 'copied'
      ? 'Copied markdown to clipboard'
      : copyStatus === 'error'
      ? 'Copy failed. Try View as Markdown.'
      : 'Copy page as Markdown for LLMs';

  return (
    <div className="doc-page-actions" ref={containerRef}>
      <button
        type="button"
        className="doc-page-actions-trigger"
        aria-label="Page actions"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Ellipsis size={16} aria-hidden="true" />
      </button>

      <div className="doc-page-actions-menu" data-open={isOpen} role="menu" aria-label="Page actions menu">
        <button
          type="button"
          className="doc-page-actions-item"
          role="menuitem"
          onClick={handleCopyPage}
        >
          <span className="doc-page-actions-item-row">
            <Copy size={15} aria-hidden="true" />
            <span className="doc-page-actions-item-title">Copy page</span>
          </span>
          <span className="doc-page-actions-item-note">{copySubtitle}</span>
        </button>

        <button
          type="button"
          className="doc-page-actions-item"
          role="menuitem"
          onClick={handleViewAsMarkdown}
        >
          <span className="doc-page-actions-item-row">
            <ExternalLink size={15} aria-hidden="true" />
            <span className="doc-page-actions-item-title">View as Markdown</span>
          </span>
          <span className="doc-page-actions-item-note">View this page as plain text</span>
        </button>
      </div>
    </div>
  );
}
