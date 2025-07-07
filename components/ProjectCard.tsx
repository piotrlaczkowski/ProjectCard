import React from 'react';
import type { ProjectData, GradientColor } from '../types.ts';
import { ShadowStyle, MeteoStatus } from '../types.ts';
import { LINK_ICONS, SHADOW_CLASSES, METEO_DATA, FONT_CLASSES, BORDER_RADIUS_CLASSES } from '../constants.tsx';

interface ProjectCardProps {
  project: ProjectData;
}

const MeteoIndicator: React.FC<{ status: MeteoStatus }> = ({ status }) => {
    const meteo = METEO_DATA[status];
    if (!meteo) return null;

    return (
        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm border border-white/20 backdrop-blur-sm ${meteo.bgColor}`}>
            <div className={`w-4 h-4 ${meteo.color}`}>
                {meteo.icon}
            </div>
            <span className={meteo.color}>{meteo.label}</span>
        </div>
    );
};

const getColorStyle = (color: GradientColor) => {
    if (color.type === 'gradient' && color.color2) {
        return { backgroundImage: `linear-gradient(to right, ${color.color1}, ${color.color2})` };
    }
    return { backgroundColor: color.color1 };
};

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(({ project }, ref) => {
  const { 
    name, tag, description, progress, warnings, links, progressBarColor, tagColor, shadowStyle,
    showMeteo, meteoStatus, cardWidth, cardHeight, borderRadius, fontFamily, imageUrl,
  } = project;

  const shadowClass = SHADOW_CLASSES[shadowStyle] || SHADOW_CLASSES[ShadowStyle.LG];
  const fontClass = FONT_CLASSES[fontFamily] || FONT_CLASSES['Inter'];
  const radiusClass = BORDER_RADIUS_CLASSES[borderRadius] || BORDER_RADIUS_CLASSES[6];

  const validLinks = links.filter(link => link.url && link.url.trim() !== '');
  const hasImage = imageUrl && imageUrl.trim() !== '';

  const tagStyle = getColorStyle(tagColor);

  return (
    // This new root div has padding to ensure shadows and the tag are captured during export.
    // The ref is attached here.
    <div ref={ref} className="p-8">
        <div 
            className={`relative ${fontClass}`} 
            style={{ width: `${cardWidth}rem`, maxWidth: '90vw' }}
        >
            {/* Tag is positioned relative to this container to avoid being clipped by the inner card */}
            {tag && (
                <div 
                    className={`absolute z-10 text-sm font-bold uppercase px-4 py-1.5 text-white -top-4 right-4 ${BORDER_RADIUS_CLASSES[8]}`}
                    style={tagStyle}
                >
                    {tag}
                </div>
            )}

            <div 
                className={`w-full flex flex-col transition-all duration-300 ease-in-out ${shadowClass} bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:-translate-y-1 ${radiusClass} overflow-hidden`}
                style={{ minHeight: `${cardHeight}rem` }}
            >
                {/* Image Banner */}
                {hasImage && (
                    <div className="relative h-48">
                        <img src={imageUrl} alt={`${name} banner`} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'}/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`flex flex-col flex-grow p-6 ${hasImage ? 'pt-4' : ''}`}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 gap-4">
                        <h2 className={`text-3xl font-bold tracking-tight`}>{name}</h2>
                        {showMeteo && (
                            <div className="flex-shrink-0">
                                <MeteoIndicator status={meteoStatus} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-grow">
                        {/* Description */}
                        <div className="flex-grow mb-6">
                            <p className="text-base opacity-80 dark:opacity-70">{description}</p>
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium opacity-80 dark:opacity-70">Progress</span>
                                <span className="text-sm font-bold">{progress}%</span>
                            </div>
                            <div className={`w-full bg-slate-200 dark:bg-slate-600/50 ${BORDER_RADIUS_CLASSES[8]} h-5`}>
                                <div 
                                    className={`h-5 ${BORDER_RADIUS_CLASSES[8]} transition-all duration-500 ease-out`}
                                    style={{ width: `${progress}%`, ...getColorStyle(progressBarColor) }}
                                ></div>
                            </div>
                        </div>

                        {/* Warnings */}
                        {warnings && (
                            <div className="mb-6 p-4 bg-yellow-400/10 border-l-4 border-yellow-400 rounded-r-lg">
                                <h4 className="font-bold text-yellow-500 dark:text-yellow-400 mb-1">Warnings & Risks</h4>
                                <p className="text-sm text-yellow-600/80 dark:text-yellow-300/80 whitespace-pre-wrap">{warnings}</p>
                            </div>
                        )}

                        {/* Footer with Links */}
                        {validLinks.length > 0 && (
                            <div className="flex items-center pt-4 border-t border-slate-200 dark:border-white/10 mt-auto">
                                <span className="text-sm font-medium mr-4 opacity-80 dark:opacity-70">Links:</span>
                                <div className="flex items-center space-x-4">
                                    {validLinks.map((link) => (
                                        <a 
                                            key={link.id} 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                            title={`${link.type}: ${link.url}`}
                                        >
                                            {LINK_ICONS[link.type]}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
});

export default ProjectCard;