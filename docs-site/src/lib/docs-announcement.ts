export type DocsAnnouncementConfig = {
  id: string;
  enabled: boolean;
  message: string;
  linkLabel?: string;
  linkHref?: string;
};

export const docsAnnouncement: DocsAnnouncementConfig = {
  id: 'sonarscanner-maven-version-reminder-2026-05-01',
  enabled: false,
  message:
    'Action needed: If you use SonarScanner for Maven, ensure you set the version in your configuration by May 1 to prevent failures.',
  linkLabel: 'Community post',
  linkHref:
    'https://community.sonarsource.com/t/action-needed-if-you-use-sonarscanner-for-maven-ensure-you-set-the-version-in-your-configuration-by-may-1-to-prevent-failures/138013',
};
