export enum LinkType {
  GitHub = 'GITHUB',
  Docs = 'DOCS',
  Jira = 'JIRA',
  Figma = 'FIGMA',
  Slack = 'SLACK',
  Website = 'WEBSITE',
}

export interface ProjectLink {
  id: string;
  type: LinkType;
  url: string;
}

export enum ShadowStyle {
  NONE = 'None',
  SM = 'Small',
  MD = 'Medium',
  LG = 'Large',
  XL = 'Extra Large',
  INNER = 'Inner',
  GLOW_BLUE = 'Glow (Blue)',
  GLOW_PURPLE = 'Glow (Purple)',
  GLOW_GREEN = 'Glow (Green)',
  GLOW_RED = 'Glow (Red)',
  GLOW_GOLD = 'Glow (Gold)',
}

export type Theme = 'light' | 'dark';

export enum MeteoStatus {
  EXCELLENT = 'Excellent',
  ON_TRACK = 'On Track',
  MINOR_ISSUES = 'Minor Issues',
  AT_RISK = 'At Risk',
  CRITICAL = 'Critical',
}

export interface GradientColor {
  type: 'solid' | 'gradient';
  color1: string;
  color2?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  tag: string;
  description: string;
  progress: number;
  warnings: string;
  links: ProjectLink[];
  progressBarColor: GradientColor;
  tagColor: GradientColor;
  shadowStyle: ShadowStyle;
  showMeteo: boolean;
  meteoStatus: MeteoStatus;
  cardWidth: number; // in rem
  cardHeight: number; // in rem
  borderRadius: number; // 0 to 8
  fontFamily: string;
  imageUrl?: string;
}