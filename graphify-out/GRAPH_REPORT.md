# Graph Report - Scriptable-IOSWidgets  (2026-04-27)

## Corpus Check
- 47 files · ~172,744 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 332 nodes · 474 edges · 21 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `createWidget()` - 12 edges
2. `applyPageTranslation()` - 10 edges
3. `GET()` - 8 edges
4. `run()` - 8 edges
5. `isOnline()` - 8 edges
6. `createHeatmapWidget()` - 8 edges
7. `createHeatmapSmallWidget()` - 8 edges
8. `createWidget()` - 8 edges
9. `main()` - 7 edges
10. `buildWidget()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --calls--> `getAllDocSlugs()`  [INFERRED]
  docs-site\src\app\sitemap.ts → docs-site\src\lib\docs.ts
- `GET()` --calls--> `getDocsSearchIndex()`  [INFERRED]
  docs-site\src\app\api\docs-search\route.ts → docs-site\src\lib\docs.ts
- `renderAlarms()` --calls--> `createWidget()`  [INFERRED]
  Widgets\TimeProgress Widget\ModularTimeProgress.js → Widgets\Weather Widget\MinimalWeather.js
- `HomePage()` --calls--> `getFirstDoc()`  [INFERRED]
  docs-site\src\app\page.tsx → docs-site\src\lib\docs.ts
- `robots()` --calls--> `getSiteUrl()`  [INFERRED]
  docs-site\src\app\robots.ts → docs-site\src\lib\site-url.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (27): compactWhitespace(), createHeadingIdGenerator(), escapeHtml(), extractToc(), getAllDocSlugs(), getDocBySlug(), getDocsNavigation(), getDocsSearchIndex() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (22): buildDurationLabel(), buildSinceLabel(), calculateAgeData(), daysSince(), daysUntil(), fetchNotionEvents(), formatCountdown(), formatDate() (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.21
Nodes (19): CacheManager, createErrorWidget(), createGradientBackground(), createHeatmapSmallWidget(), createHeatmapWidget(), createWidget(), fetchGraphQLStats(), fetchHeatmapData() (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (19): applyPageTranslation(), bootTranslateElement(), clearTranslateHoverHighlights(), enforceTranslateUiCleanup(), ensureTranslateContainer(), ensureTranslateReady(), ensureTranslateUiCleanupWatcher(), getStoredTranslateLanguage() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (10): createGradientBackground(), createWidget(), determineFontSize(), estimateTextWidth(), fetchWeatherData(), getCurrentLocation(), isLeapYear(), renderAlarms() (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.26
Nodes (14): buildWidget(), ensureCacheFolder(), fetchScheduleFromSheet(), formatShortTimeRange(), getCacheFilePath(), getGradient(), getNowDay(), getNowTime() (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (5): buildWidgetGroup(), isActivePath(), isExactPath(), normalizePath(), toDocHref()

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (10): buildUrlWithParams(), calculateAgeData(), daysUntil(), formatCountdown(), formatDate(), loadEventData(), normalizeEventRow(), parseLocalDate() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (9): createWidget(), fetchQuotesFromNotion(), getColor(), getColorPairFromJSON(), getDataSourceId(), getNotionProp(), getQuoteFromNotion(), getRepeatableIndex() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (4): hasChildren(), isActivePath(), isSubnavItemActive(), normalizePath()

### Community 10 - "Community 10"
Cohesion: 0.35
Nodes (10): aqiFromPM(), calculateAQI(), calculateLevel(), createSymbol(), getAQIData(), getLatLon(), getTempTheme(), getThemedColor() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (5): calculateAgeData(), daysUntil(), formatCountdown(), formatDate(), parseLocalDate()

### Community 12 - "Community 12"
Cohesion: 0.42
Nodes (8): analyzeCodebase(), applyChanges(), ask(), buildSnapshot(), collectFiles(), implementSuggestion(), main(), printSuggestions()

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (4): robots(), getSiteUrl(), normalizeSiteUrl(), sitemap()

### Community 14 - "Community 14"
Cohesion: 0.36
Nodes (4): hasChildren(), isActivePath(), isTopItemActive(), normalizePath()

### Community 15 - "Community 15"
Cohesion: 0.43
Nodes (5): createWidget(), getColor(), getColorPairFromJSON(), getDailyIndex(), getQuoteFromSheet()

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (2): handleCopyPage(), writeToClipboard()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (2): onViewportModeChange(), queueUpdate()

### Community 20 - "Community 20"
Cohesion: 0.83
Nodes (3): createWidget(), getFontSize(), getRandomQuoteAndAuthor()

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (2): createWidget(), darkenColor()

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (2): addDetailsGrid(), buildLargeWidget()

## Knowledge Gaps
- **Thin community `Community 16`** (7 nodes): `handleCopyPage()`, `handleKeyDown()`, `handlePointerDown()`, `handleViewAsMarkdown()`, `joinClassNames()`, `writeToClipboard()`, `DocPageActions.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (7 nodes): `Toc.tsx`, `closeToc()`, `onKeyDown()`, `onTocToggle()`, `onViewportModeChange()`, `queueUpdate()`, `updateTocBounds()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (3 nodes): `createWidget()`, `darkenColor()`, `WearClrAccHindu.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (3 nodes): `addDetailsGrid()`, `buildLargeWidget()`, `MyToyota.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAllDocSlugs()` connect `Community 0` to `Community 13`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `sitemap()` connect `Community 13` to `Community 0`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `getFirstDoc()` and `getDocBySlug()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._