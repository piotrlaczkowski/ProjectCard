import React, { useState } from 'react';
import type { ProjectData, ProjectLink, Theme, GradientColor } from '../types.ts';
import { LinkType, ShadowStyle, MeteoStatus } from '../types.ts';
import { METEO_DATA, SunIcon, MoonIcon, FONTS, FONT_CLASSES, BORDER_RADIUS_CLASSES } from '../constants.tsx';
import SavedCards from './SavedCards.tsx';

// --- Helper components moved outside the main component to prevent re-rendering and focus loss ---

const Label: React.FC<{htmlFor?: string, children: React.ReactNode, className?: string}> = ({htmlFor, children, className}) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 ${className}`}>{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50 ${props.type === 'color' ? 'p-1 h-10' : ''} ${props.type === 'range' ? 'py-0 accent-blue-500' : ''} ${props.className}`} />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" rows={4} />
);

const Button = ({children, onClick, variant = 'primary', disabled = false}: {children: React.ReactNode, onClick: () => void, variant?: 'primary' | 'secondary' | 'special', disabled?: boolean}) => {
    const styles = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white',
        secondary: 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100',
        special: 'bg-purple-600 hover:bg-purple-500 text-white',
    }
    return <button onClick={onClick} disabled={disabled} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}>{children}</button>
}

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

const CollapsibleSection: React.FC<{title: string, children: React.ReactNode, defaultOpen?: boolean}> = ({title, children, defaultOpen = false}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="w-full flex justify-between items-center p-4 text-left"
            >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="px-4 pb-4 space-y-4">{children}</div>}
        </div>
    );
};

const GradientColorPicker: React.FC<{label: string, value: GradientColor, onChange: (value: GradientColor) => void}> = ({ label, value, onChange }) => {
    return (
        <div>
            <Label>{label}</Label>
            <div className="flex items-center space-x-2 mb-2">
                <input type="radio" id={`${label}-solid`} name={label} value="solid" checked={value.type === 'solid'} onChange={() => onChange({...value, type: 'solid'})} />
                <label htmlFor={`${label}-solid`}>Solid</label>
                <input type="radio" id={`${label}-gradient`} name={label} value="gradient" checked={value.type === 'gradient'} onChange={() => onChange({...value, type: 'gradient', color2: value.color2 || '#9333ea'})} />
                <label htmlFor={`${label}-gradient`}>Gradient</label>
            </div>
            <div className="flex items-center space-x-2">
                <Input type="color" value={value.color1} onChange={e => onChange({...value, color1: e.target.value})} className="w-full"/>
                {value.type === 'gradient' && (
                    <Input type="color" value={value.color2} onChange={e => onChange({...value, color2: e.target.value})} className="w-full"/>
                )}
            </div>
        </div>
    )
}

// --- Main Control Panel Component ---

interface ControlPanelProps {
    project: ProjectData;
    setProject: React.Dispatch<React.SetStateAction<ProjectData>>;
    onSave: () => void;
    onNew: () => void;
    onReset: () => void;
    onExport: () => void;
    onGenerate: (prompt: string) => void;
    isGeneratingAI: boolean;
    savedProjects: ProjectData[];
    onLoadProject: (id: string) => void;
    onDeleteProject: (id: string) => void;
    activeCardId: string | null;
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const { 
        project, setProject, onSave, onNew, onReset, onExport, onGenerate, isGeneratingAI,
        savedProjects, onLoadProject, onDeleteProject, activeCardId, theme, setTheme
    } = props;
    
    const [aiPrompt, setAiPrompt] = useState('A mobile app for dog walkers');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | number | boolean | undefined = value;
        if (type === 'range' || name === 'progress' || name === 'cardWidth' || name === 'cardHeight' || name === 'borderRadius') {
            finalValue = parseFloat(value);
        } else if (type === 'checkbox') {
            finalValue = (e.target as HTMLInputElement).checked;
        }
        setProject(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleLinkChange = (id: string, field: 'type' | 'url', value: string) => {
        setProject(prev => ({ ...prev, links: prev.links.map(link => link.id === id ? { ...link, [field]: value } : link) }));
    };

    const addLink = () => {
        setProject(prev => ({ ...prev, links: [...prev.links, { id: crypto.randomUUID(), type: LinkType.Website, url: '' }] }));
    };

    const removeLink = (id: string) => {
        setProject(prev => ({ ...prev, links: prev.links.filter(link => link.id !== id) }));
    };
    
    const ThemeToggle = () => (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
        </button>
    );
    
    return (
        <div className="p-6 bg-slate-100 dark:bg-slate-800 h-full overflow-y-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Controls</h2>
                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <Button onClick={onExport} variant="secondary">Export PNG</Button>
                </div>
            </div>
             <div className="grid grid-cols-3 gap-2">
                <Button onClick={onNew} variant="secondary">New</Button>
                <Button onClick={onReset} variant="secondary">Reset</Button>
                <Button onClick={onSave}>Save</Button>
            </div>

            <CollapsibleSection title="✨ Generate with AI">
                <div>
                    <Label htmlFor="ai-prompt">Project Idea</Label>
                    <TextArea id="ai-prompt" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g., A productivity app based on pomodoro technique" />
                </div>
                <Button onClick={() => onGenerate(aiPrompt)} variant="special" disabled={isGeneratingAI}>
                    {isGeneratingAI ? 'Generating...' : 'Generate Content'}
                </Button>
            </CollapsibleSection>

            <CollapsibleSection title="Content" defaultOpen={true}>
                <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" name="name" value={project.name} onChange={handleInputChange} />
                </div>
                <div>
                    <Label htmlFor="tag">Tag</Label>
                    <Input id="tag" name="tag" value={project.tag} onChange={handleInputChange} placeholder="e.g., V2.0, In Review" />
                </div>
                 <div>
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input id="imageUrl" name="imageUrl" value={project.imageUrl || ''} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <TextArea id="description" name="description" value={project.description} onChange={handleInputChange} />
                </div>
                <div>
                    <Label htmlFor="warnings">Warnings & Risks</Label>
                    <TextArea id="warnings" name="warnings" value={project.warnings} onChange={handleInputChange} placeholder="e.g., Potential delays due to API changes."/>
                </div>
                <div>
                    <Label htmlFor="progress" className="flex justify-between"><span>Progress</span> <span>{project.progress}%</span></Label>
                    <Input id="progress" name="progress" type="range" min="0" max="100" value={project.progress} onChange={handleInputChange} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Dimensions">
                <div>
                    <Label htmlFor="cardWidth" className="flex justify-between"><span>Width</span><span>{project.cardWidth}rem</span></Label>
                    <Input id="cardWidth" name="cardWidth" type="range" min="24" max="60" step="1" value={project.cardWidth} onChange={handleInputChange}/>
                </div>
                 <div>
                    <Label htmlFor="cardHeight" className="flex justify-between"><span>Min. Height</span><span>{project.cardHeight}rem</span></Label>
                    <Input id="cardHeight" name="cardHeight" type="range" min="20" max="40" step="1" value={project.cardHeight} onChange={handleInputChange}/>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Styling & Effects">
                <GradientColorPicker label="Progress Bar Color" value={project.progressBarColor} onChange={value => setProject(p => ({...p, progressBarColor: value}))} />
                <GradientColorPicker label="Tag Color" value={project.tagColor} onChange={value => setProject(p => ({...p, tagColor: value}))} />
                <div>
                    <Label htmlFor="shadowStyle">Shadow / Glow Effect</Label>
                    <Select id="shadowStyle" name="shadowStyle" value={project.shadowStyle} onChange={handleInputChange}>
                        {Object.values(ShadowStyle).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="borderRadius" className="flex justify-between"><span>Border Radius</span> <span>{BORDER_RADIUS_CLASSES[project.borderRadius]}</span></Label>
                    <Input id="borderRadius" name="borderRadius" type="range" min="0" max="8" step="1" value={project.borderRadius} onChange={handleInputChange}/>
                </div>
                 <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select id="fontFamily" name="fontFamily" value={project.fontFamily} onChange={handleInputChange}>
                        {Object.values(FONTS).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Meteo">
                <div className="flex items-center justify-between">
                  <Label>Show Meteo Indicator</Label>
                  <input type="checkbox" name="showMeteo" checked={project.showMeteo} onChange={handleInputChange} className="h-5 w-5 rounded accent-blue-500"/>
                </div>
                {project.showMeteo && (
                  <div>
                    <Label>Status</Label>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {(Object.keys(METEO_DATA) as (keyof typeof METEO_DATA)[]).map(status => {
                        const meteo = METEO_DATA[status];
                        return (
                          <button key={status} onClick={() => setProject(p => ({...p, meteoStatus: status}))} className={`flex-1 min-w-[100px] p-2 rounded-md flex items-center justify-center gap-2 border-2 transition-all ${project.meteoStatus === status ? 'border-blue-500 shadow' : 'border-transparent'} ${meteo.bgColor}`}>
                            <span className={meteo.color}>{meteo.icon}</span>
                            <span className={`font-semibold text-xs ${meteo.color}`}>{meteo.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
            </CollapsibleSection>
            
            <CollapsibleSection title="Links">
                <div className="space-y-3">
                {project.links.map(link => (
                    <div key={link.id} className="flex items-center space-x-2">
                        <Select value={link.type} onChange={e => handleLinkChange(link.id, 'type', e.target.value)} className="w-1/3">
                            {Object.values(LinkType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                        </Select>
                        <Input 
                            type="url" 
                            value={link.url}
                            onChange={e => handleLinkChange(link.id, 'url', e.target.value)}
                            placeholder="https://github.com/..."
                            className="flex-grow"
                        />
                        <button onClick={() => removeLink(link.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                        </button>
                    </div>
                ))}
                </div>
                <button onClick={addLink} className="mt-3 w-full text-sm font-semibold py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Add Link
                </button>
            </CollapsibleSection>
            
            <CollapsibleSection title="Saved Cards">
                <SavedCards 
                    projects={savedProjects}
                    onLoad={onLoadProject}
                    onDelete={onDeleteProject}
                    activeCardId={activeCardId}
                />
            </CollapsibleSection>

        </div>
    );
};

export default ControlPanel;