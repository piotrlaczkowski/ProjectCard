import React from 'react';
import type { ProjectData } from './types.ts';
import { LinkType, ShadowStyle, MeteoStatus } from './types.ts';

// Cross-browser UUID generation function
export const generateUUID = (): string => {
    // Try to use crypto.randomUUID if available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Fallback to manual UUID v4 generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const SHADOW_CLASSES: Record<ShadowStyle, string> = {
  [ShadowStyle.NONE]: 'shadow-none',
  [ShadowStyle.SM]: 'shadow-sm',
  [ShadowStyle.MD]: 'shadow-md',
  [ShadowStyle.LG]: 'shadow-lg',
  [ShadowStyle.XL]: 'shadow-xl',
  [ShadowStyle.INNER]: 'shadow-inner',
  [ShadowStyle.GLOW_BLUE]: 'shadow-2xl shadow-blue-500/70 drop-shadow-2xl',
  [ShadowStyle.GLOW_PURPLE]: 'shadow-2xl shadow-purple-500/70 drop-shadow-2xl',
  [ShadowStyle.GLOW_GREEN]: 'shadow-2xl shadow-green-500/70 drop-shadow-2xl',
  [ShadowStyle.GLOW_RED]: 'shadow-2xl shadow-red-500/70 drop-shadow-2xl',
  [ShadowStyle.GLOW_GOLD]: 'shadow-2xl shadow-amber-400/70 drop-shadow-2xl',
};

export const FONTS = {
  inter: 'Inter',
  robotoSlab: 'Roboto Slab',
  spaceMono: 'Space Mono',
};

export const FONT_CLASSES: Record<string, string> = {
  [FONTS.inter]: 'font-inter',
  [FONTS.robotoSlab]: 'font-roboto-slab',
  [FONTS.spaceMono]: 'font-space-mono',
};

// Maps slider value (0-8) to Tailwind CSS classes
export const BORDER_RADIUS_CLASSES = [
  'rounded-none',    // 0
  'rounded-sm',      // 1
  'rounded',         // 2
  'rounded-md',      // 3
  'rounded-lg',      // 4
  'rounded-xl',      // 5
  'rounded-2xl',     // 6
  'rounded-3xl',     // 7
  'rounded-full',    // 8
];

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const SunIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></IconWrapper>;
export const MoonIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></IconWrapper>;
export const StarIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></IconWrapper>;
export const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>;
export const CloudIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></IconWrapper>;
export const ZapIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></IconWrapper>;
export const AlertTriangleIcon: React.FC<{className?: string}> = ({className}) => <IconWrapper className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconWrapper>;

export const METEO_DATA: Record<MeteoStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string; }> = {
  [MeteoStatus.EXCELLENT]: { label: 'Excellent', icon: <StarIcon className="w-4 h-4" />, color: 'text-green-500 dark:text-green-400', bgColor: 'bg-green-400/10' },
  [MeteoStatus.ON_TRACK]: { label: 'On Track', icon: <CheckCircleIcon className="w-4 h-4" />, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-400/10' },
  [MeteoStatus.MINOR_ISSUES]: { label: 'Minor Issues', icon: <CloudIcon className="w-4 h-4" />, color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-amber-400/10' },
  [MeteoStatus.AT_RISK]: { label: 'At Risk', icon: <ZapIcon className="w-4 h-4" />, color: 'text-orange-500 dark:text-orange-400', bgColor: 'bg-orange-500/10' },
  [MeteoStatus.CRITICAL]: { label: 'Critical', icon: <AlertTriangleIcon className="w-4 h-4" />, color: 'text-red-600 dark:text-red-500', bgColor: 'bg-red-500/10' },
};


export const LINK_ICONS: Record<LinkType, React.ReactNode> = {
  [LinkType.GitHub]: <IconWrapper><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></IconWrapper>,
  [LinkType.Docs]: <IconWrapper><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></IconWrapper>,
  [LinkType.Jira]: <IconWrapper><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>,
  [LinkType.Figma]: <IconWrapper><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path></IconWrapper>,
  [LinkType.Slack]: <IconWrapper><path d="M14.5 10c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5h1a3.5 3.5 0 0 0 0-7h-1z"></path><path d="M8.5 14h-1a3.5 3.5 0 1 0 0 7h1a3.5 3.5 0 0 0 0-7z"></path><path d="M10 14.5c0-1.93-1.57-3.5-3.5-3.5s-3.5 1.57-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1z"></path><path d="M14 8.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 0 0 7 0z"></path></IconWrapper>,
  [LinkType.Website]: <IconWrapper><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></IconWrapper>,
};

export const createNewProject = (): ProjectData => ({
    id: generateUUID(),
    name: 'New Awesome Project',
    tag: 'PoC',
    description: 'A brief and exciting description of what this project aims to achieve. This section can grow to talk about goals, milestones, and expected outcomes.',
    progress: 25,
    warnings: '',
    links: [{id: generateUUID(), type: LinkType.GitHub, url: ''}],
    progressBarColor: { type: 'solid', color1: '#3b82f6' },
    tagColor: { type: 'solid', color1: '#8b5cf6' },
    shadowStyle: ShadowStyle.LG,
    showMeteo: true,
    meteoStatus: MeteoStatus.ON_TRACK,
    cardWidth: 28, // rem
    cardHeight: 28, // rem
    borderRadius: 6, // Corresponds to rounded-2xl
    fontFamily: FONTS.inter,
    imageUrl: '',
});