export type NavItem = {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  defaultOpen?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const topNav: NavItem[] = [
  { title: "Home", href: "/", icon: "home" },
  {
    title: "Product",
    href: "/widgets",
    icon: "book",
    children: [
      { title: "Homepage", href: "/" },
      { title: "Book a demo", href: "/contributing" },
      { title: "Community", href: "/widgets" },
      { title: "Blog", href: "/changelog" },
    ],
  },
  { title: "Changelog", href: "/changelog", icon: "list" },
];

export const docSubNav: NavItem[] = [
  { title: "Overview", href: "/", icon: "home" },
  { title: "Installation", href: "/installation", icon: "download" },
  { title: "Usage", href: "/usage", icon: "sliders" },
  { title: "Widgets", href: "/widgets", icon: "grid" },
  { title: "Changelog", href: "/changelog", icon: "list" },
];

export const docsNav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Home", href: "/", icon: "home" },
      { title: "Installation", href: "/installation", icon: "download" },
      { title: "Usage", href: "/usage", icon: "sliders" },
    ],
  },
  {
    title: "Widgets",
    items: [
      {
        title: "All Widgets",
        href: "/widgets",
        icon: "grid",
        defaultOpen: true,
        children: [
          { title: "AQI + Temperature", href: "/widgets/aqi-widget" },
          { title: "Weather", href: "/widgets/weather-widget" },
          { title: "Countdown", href: "/widgets/countdown-widget" },
          { title: "Countdown v2", href: "/widgets/countdown-widget-v2" },
          { title: "Birthday", href: "/widgets/birthday-widget" },
          { title: "Time Progress", href: "/widgets/time-progress-widget" },
          { title: "Schedule", href: "/widgets/schedule-widget" },
          { title: "Quote", href: "/widgets/quote-widget" },
          { title: "GitHub Stats", href: "/widgets/github-stats-widget" },
          { title: "Hindu Color Wear", href: "/widgets/hindu-color-wear-widget" },
          { title: "Toyota", href: "/widgets/toyota-widget" },
        ],
      },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Changelog", href: "/changelog", icon: "list" },
      { title: "Contributing", href: "/contributing", icon: "book" },
    ],
  },
];
