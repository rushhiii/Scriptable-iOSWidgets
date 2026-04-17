const SOURCE_LANGUAGE = 'en';
const TRANSLATE_STORAGE_KEY = 'docs.translate.targetLang';
const TRANSLATE_CONTAINER_ID = 'google_translate_element';
const TRANSLATE_SCRIPT_ID = 'docs-google-translate-script';
const INCLUDED_LANGUAGES = 'en,fr,zh-CN,ja';
const TRANSLATE_LANGUAGE_CHANGE_EVENT = 'docs-translate-language-change';
const TRANSLATE_UI_HIDE_SELECTORS = [
  'iframe.goog-te-banner-frame',
  'iframe.goog-te-balloon-frame',
  'iframe.skiptranslate',
  '.goog-te-banner-frame',
  '.goog-te-balloon-frame',
  '#goog-gt-tt',
  '.goog-tooltip',
  '.VIpgJd-ZVi9od-ORHb-OEVmcd',
  '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
  '.VIpgJd-ZVi9od-l4eHX-hSRGPd',
] as const;

const TRANSLATE_HOVER_HIGHLIGHT_SELECTORS = [
  '.goog-text-highlight',
  '[class*="VIpgJd-yAWNEb-VIpgJd-fmcmS"]',
] as const;

type TranslateLanguageChangeDetail = {
  targetLang: string;
};

type TranslateElementConstructor = new (
  options: Record<string, unknown>,
  containerId: string
) => unknown;

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: TranslateElementConstructor;
      };
    };
    googleTranslateElementInit?: () => void;
    __docsTranslateReadyPromise?: Promise<void>;
    __docsTranslateElementBooted?: boolean;
    __docsTranslateUiCleanupBooted?: boolean;
  }
}

function normalizeTranslateLayoutOffset(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.style.setProperty('margin-top', '0', 'important');

  if (document.body) {
    document.body.style.setProperty('top', '0', 'important');
    document.body.style.setProperty('margin-top', '0', 'important');
  }
}

function hideTranslateUiChrome(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const nodes = document.querySelectorAll<HTMLElement>(TRANSLATE_UI_HIDE_SELECTORS.join(','));

  nodes.forEach((node) => {
    node.style.setProperty('display', 'none', 'important');
    node.style.setProperty('visibility', 'hidden', 'important');
    node.style.setProperty('opacity', '0', 'important');
    node.style.setProperty('height', '0', 'important');
    node.style.setProperty('min-height', '0', 'important');
    node.style.setProperty('pointer-events', 'none', 'important');
  });
}

function clearTranslateHoverHighlights(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const highlightedNodes = document.querySelectorAll<HTMLElement>(
    TRANSLATE_HOVER_HIGHLIGHT_SELECTORS.join(',')
  );

  highlightedNodes.forEach((node) => {
    node.classList.remove('goog-text-highlight');

    // Google Translate can inject inline styles/classes that create a blue hover box.
    // Reset these aggressively while keeping translated text content intact.
    node.style.setProperty('background-color', 'transparent', 'important');
    node.style.setProperty('background', 'transparent', 'important');
    node.style.setProperty('box-shadow', 'none', 'important');
    node.style.setProperty('border', 'none', 'important');
    node.style.setProperty('outline', 'none', 'important');

    for (const className of Array.from(node.classList)) {
      if (className.includes('VIpgJd-fmcmS')) {
        node.classList.remove(className);
      }
    }
  });
}

function enforceTranslateUiCleanup(): void {
  hideTranslateUiChrome();
  clearTranslateHoverHighlights();
  normalizeTranslateLayoutOffset();
}

function ensureTranslateUiCleanupWatcher(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  enforceTranslateUiCleanup();

  if (window.__docsTranslateUiCleanupBooted) {
    return;
  }

  const observer = new MutationObserver(() => {
    enforceTranslateUiCleanup();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });

  window.__docsTranslateUiCleanupBooted = true;
}

function scheduleTranslateUiCleanup(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const delays = [0, 120, 320, 700, 1300];

  delays.forEach((delay) => {
    window.setTimeout(() => {
      enforceTranslateUiCleanup();
    }, delay);
  });
}

function ensureTranslateContainer(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(TRANSLATE_CONTAINER_ID)) {
    return;
  }

  const container = document.createElement('div');
  container.id = TRANSLATE_CONTAINER_ID;
  container.setAttribute('aria-hidden', 'true');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1px';
  container.style.height = '1px';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getTranslateCombo(): HTMLSelectElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.querySelector('select.goog-te-combo');
}

async function waitForTranslateCombo(timeoutMs = 4500): Promise<HTMLSelectElement | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const combo = getTranslateCombo();
    if (combo) {
      return combo;
    }
    await wait(120);
  }

  return null;
}

function bootTranslateElement(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const TranslateElement = window.google?.translate?.TranslateElement;

  if (!TranslateElement || window.__docsTranslateElementBooted) {
    return;
  }

  ensureTranslateContainer();

  new TranslateElement(
    {
      pageLanguage: SOURCE_LANGUAGE,
      autoDisplay: false,
      includedLanguages: INCLUDED_LANGUAGES,
      multilanguagePage: true,
    },
    TRANSLATE_CONTAINER_ID
  );

  window.__docsTranslateElementBooted = true;
}

function ensureTranslateReady(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  ensureTranslateUiCleanupWatcher();

  if (window.__docsTranslateReadyPromise) {
    return window.__docsTranslateReadyPromise;
  }

  window.__docsTranslateReadyPromise = new Promise<void>((resolve) => {
    const resolveReady = () => {
      bootTranslateElement();
      ensureTranslateUiCleanupWatcher();
      scheduleTranslateUiCleanup();
      resolve();
    };

    ensureTranslateContainer();

    if (window.google?.translate?.TranslateElement) {
      resolveReady();
      return;
    }

    window.googleTranslateElementInit = () => {
      resolveReady();
    };

    const existingScript = document.getElementById(TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', resolveReady, { once: true });
      existingScript.addEventListener('error', () => resolve(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TRANSLATE_SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.addEventListener('error', () => resolve(), { once: true });
    document.head.appendChild(script);
  });

  return window.__docsTranslateReadyPromise;
}

function setTranslateCookie(targetLang: string): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const value = `/${SOURCE_LANGUAGE}/${targetLang}`;
  document.cookie = `googtrans=${value}; path=/`;

  const parts = window.location.hostname.split('.');
  if (parts.length > 1) {
    const rootDomain = `.${parts.slice(-2).join('.')}`;
    document.cookie = `googtrans=${value}; path=/; domain=${rootDomain}`;
  }
}

function normalizeTargetLanguage(targetLang: string): string {
  const trimmed = targetLang.trim();
  return trimmed || SOURCE_LANGUAGE;
}

function notifyTranslateLanguageChange(targetLang: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<TranslateLanguageChangeDetail>(TRANSLATE_LANGUAGE_CHANGE_EVENT, {
      detail: { targetLang },
    })
  );
}

export function onTranslateLanguageChange(handler: (targetLang: string) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const wrapped = (event: Event) => {
    const customEvent = event as CustomEvent<TranslateLanguageChangeDetail>;
    const nextLanguage = normalizeTargetLanguage(customEvent.detail?.targetLang || SOURCE_LANGUAGE);
    handler(nextLanguage);
  };

  window.addEventListener(TRANSLATE_LANGUAGE_CHANGE_EVENT, wrapped as EventListener);

  return () => {
    window.removeEventListener(TRANSLATE_LANGUAGE_CHANGE_EVENT, wrapped as EventListener);
  };
}

export function getStoredTranslateLanguage(): string {
  if (typeof window === 'undefined') {
    return SOURCE_LANGUAGE;
  }

  const saved = window.localStorage.getItem(TRANSLATE_STORAGE_KEY);
  return normalizeTargetLanguage(saved || SOURCE_LANGUAGE);
}

async function applyPageTranslation(targetLang: string, persist: boolean): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const nextLanguage = normalizeTargetLanguage(targetLang);

  if (persist) {
    if (nextLanguage === SOURCE_LANGUAGE) {
      window.localStorage.removeItem(TRANSLATE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(TRANSLATE_STORAGE_KEY, nextLanguage);
    }
  }

  notifyTranslateLanguageChange(nextLanguage);

  setTranslateCookie(nextLanguage);
  await ensureTranslateReady();

  const combo = getTranslateCombo() || (await waitForTranslateCombo());

  if (!combo) {
    return;
  }

  if (combo.value === nextLanguage) {
    scheduleTranslateUiCleanup();
    return;
  }

  combo.value = nextLanguage;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  scheduleTranslateUiCleanup();
}

export function openTranslatedPage(targetLang: string): void {
  void applyPageTranslation(targetLang, true);
}

export function syncStoredTranslation(): void {
  const saved = getStoredTranslateLanguage();
  void applyPageTranslation(saved, false);
}