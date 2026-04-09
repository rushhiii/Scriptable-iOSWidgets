export type NavItem = {
  title: string;
  href: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const docsNav: NavSection[] = [
  {
    title: "Start Here",
    items: [
      { title: "Overview", href: "/" },
      { title: "Installation", href: "/installation" },
      { title: "Usage", href: "/usage" },
    ],
  },
  {
    title: "Widgets",
    items: [
      { title: "All Widgets", href: "/widgets" },
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
  {
    title: "Reference",
    items: [
      { title: "Contributing", href: "/contributing" },
    ],
  },
];
