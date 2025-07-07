import React, { useState } from 'react';
import type { ProjectData, ProjectLink, Theme, GradientColor } from '../types.ts';
import { LinkType, ShadowStyle, MeteoStatus } from '../types.ts';
import { METEO_DATA, SunIcon, MoonIcon, FONTS, FONT_CLASSES, BORDER_RADIUS_CLASSES, generateUUID } from '../constants.tsx';
import SavedCards from './SavedCards.tsx';

// --- Modern UI Components ---

const Card: React.FC<{children: React.ReactNode, className?: string}> = ({children, className = ''}) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{children: React.ReactNode, className?: string}> = ({children, className = ''}) => (
    <div className={`px-6 py-4 border-b border-slate-200 dark:border-slate-700 ${className}`}>
        {children}
    </div>
);

const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({children, className = ''}) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

const Label: React.FC<{htmlFor?: string, children: React.ReactNode, className?: string, required?: boolean}> = ({htmlFor, children, className = '', required = false}) => (
    <label htmlFor={htmlFor} className={`block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ${className}`}>
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {variant?: 'default' | 'search'}> = ({variant = 'default', ...props}) => {
    const baseClasses = "w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500";
    const colorClasses = props.type === 'color' ? 'p-2 h-12 cursor-pointer' : '';
    const rangeClasses = props.type === 'range' ? 'py-0 accent-blue-500 cursor-pointer' : '';
    const searchClasses = variant === 'search' ? 'pl-10' : '';
    
    return (
        <input 
            {...props} 
            className={`${baseClasses} ${colorClasses} ${rangeClasses} ${searchClasses} ${props.className || ''}`} 
        />
    );
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select 
        {...props} 
        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer" 
    />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea 
        {...props} 
        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 resize-none" 
        rows={4} 
    />
);

const Button: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'special' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    icon
}) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
        secondary: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-500',
        special: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white focus:ring-purple-500 shadow-sm hover:shadow-md',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md'
    };
    
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass}`}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
};

const Toggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
}> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>
            {description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

const RangeSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    showValue?: boolean;
}> = ({ label, value, onChange, min, max, step = 1, unit = '', showValue = true }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <Label className="mb-0">{label}</Label>
            {showValue && (
                <span className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {value}{unit}
                </span>
            )}
        </div>
        <div className="relative">
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
            </div>
            <Input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                style={{ background: 'transparent' }}
            />
        </div>
    </div>
);

const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    presets?: string[];
}> = ({ label, value, onChange, presets = [] }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 p-1 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
                />
                <div
                    className="absolute inset-1 rounded-md border border-slate-200 dark:border-slate-600"
                    style={{ backgroundColor: value }}
                />
            </div>
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#000000"
            />
        </div>
        {presets.length > 0 && (
            <div className="flex gap-2 mt-2">
                {presets.map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange(color)}
                        className="w-8 h-8 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        )}
    </div>
);

const GradientColorPicker: React.FC<{
    label: string;
    value: GradientColor;
    onChange: (value: GradientColor) => void;
}> = ({ label, value, onChange }) => {
    const presets = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#84cc16'];
    
    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            <div className="flex gap-2 mb-4">
                <Button
                    onClick={() => onChange({...value, type: 'solid'})}
                    variant={value.type === 'solid' ? 'primary' : 'ghost'}
                    size="sm"
                >
                    Solid
                </Button>
                <Button
                    onClick={() => onChange({...value, type: 'gradient', color2: value.color2 || '#9333ea'})}
                    variant={value.type === 'gradient' ? 'primary' : 'ghost'}
                    size="sm"
                >
                    Gradient
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <ColorPicker
                    label="Primary Color"
                    value={value.color1}
                    onChange={(color1) => onChange({...value, color1})}
                    presets={presets}
                />
                {value.type === 'gradient' && (
                    <ColorPicker
                        label="Secondary Color"
                        value={value.color2 || '#9333ea'}
                        onChange={(color2) => onChange({...value, color2})}
                        presets={presets}
                    />
                )}
            </div>
            <div className="h-8 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
                <div
                    className="w-full h-full"
                    style={
                        value.type === 'gradient' && value.color2
                            ? { background: `linear-gradient(to right, ${value.color1}, ${value.color2})` }
                            : { backgroundColor: value.color1 }
                    }
                />
            </div>
        </div>
    );
};

const CollapsibleSection: React.FC<{
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    icon?: React.ReactNode;
}> = ({ title, children, defaultOpen = false, icon }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <Card className="overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="w-5 h-5 text-slate-600 dark:text-slate-400">{icon}</span>}
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                </div>
                <svg
                    className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 space-y-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="pt-6">{children}</div>
                </div>
            )}
        </Card>
    );
};

// --- Icons ---
const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const DocumentTextIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const AdjustmentsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
    </svg>
);

const ColorSwatchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
    </svg>
);

const CloudIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
);

const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const CollectionIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

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
        setProject(prev => ({ ...prev, links: [...prev.links, { id: generateUUID(), type: LinkType.Website, url: '' }] }));
    };

    const removeLink = (id: string) => {
        setProject(prev => ({ ...prev, links: prev.links.filter(link => link.id !== id) }));
    };
    
    const ThemeToggle = () => (
        <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? <MoonIcon className="w-4 h-4"/> : <SunIcon className="w-4 h-4"/>}
        >
            {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
    );
    
    return (
        <div className="h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Card Generator</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button onClick={onExport} variant="secondary" size="sm">
                            Export PNG
                        </Button>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <Button onClick={onNew} variant="ghost" size="sm" fullWidth>
                        New
                    </Button>
                    <Button onClick={onReset} variant="ghost" size="sm" fullWidth>
                        Reset
                    </Button>
                    <Button onClick={onSave} variant="primary" size="sm" fullWidth>
                        Save
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* AI Generation */}
                <CollapsibleSection 
                    title="AI Content Generator" 
                    icon={<SparklesIcon />}
                    defaultOpen={false}
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ai-prompt">Describe your project idea</Label>
                            <TextArea 
                                id="ai-prompt" 
                                value={aiPrompt} 
                                onChange={e => setAiPrompt(e.target.value)} 
                                placeholder="e.g., A productivity app based on the pomodoro technique with team collaboration features"
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button 
                            onClick={() => onGenerate(aiPrompt)} 
                            variant="special" 
                            disabled={isGeneratingAI}
                            fullWidth
                            icon={<SparklesIcon />}
                        >
                            {isGeneratingAI ? 'Generating...' : 'Generate Content'}
                        </Button>
                    </div>
                </CollapsibleSection>

                {/* Content */}
                <CollapsibleSection 
                    title="Project Content" 
                    icon={<DocumentTextIcon />}
                    defaultOpen={true}
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name" required>Project Name</Label>
                                <Input 
                                    id="name" 
                                    name="name" 
                                    value={project.name} 
                                    onChange={handleInputChange}
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tag">Tag</Label>
                                <Input 
                                    id="tag" 
                                    name="tag" 
                                    value={project.tag} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g., V2.0, Beta, In Review"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="imageUrl">Banner Image URL</Label>
                            <Input 
                                id="imageUrl" 
                                name="imageUrl" 
                                value={project.imageUrl || ''} 
                                onChange={handleInputChange} 
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="description" required>Description</Label>
                            <TextArea 
                                id="description" 
                                name="description" 
                                value={project.description} 
                                onChange={handleInputChange}
                                placeholder="Describe what this project aims to achieve..."
                                className="min-h-[120px]"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="warnings">Warnings & Risks</Label>
                            <TextArea 
                                id="warnings" 
                                name="warnings" 
                                value={project.warnings} 
                                onChange={handleInputChange} 
                                placeholder="e.g., Potential delays due to API changes, dependency on third-party service..."
                            />
                        </div>
                        
                        <RangeSlider
                            label="Progress"
                            value={project.progress}
                            onChange={(value) => setProject(prev => ({ ...prev, progress: value }))}
                            min={0}
                            max={100}
                            unit="%"
                        />
                    </div>
                </CollapsibleSection>

                {/* Dimensions */}
                <CollapsibleSection 
                    title="Card Dimensions" 
                    icon={<AdjustmentsIcon />}
                >
                    <div className="space-y-6">
                                                 <RangeSlider
                             label="Card Width"
                             value={project.cardWidth}
                             onChange={(value) => setProject(prev => ({ ...prev, cardWidth: value }))}
                             min={16}
                             max={60}
                             unit="rem"
                         />
                         <RangeSlider
                             label="Minimum Height"
                             value={project.cardHeight}
                             onChange={(value) => setProject(prev => ({ ...prev, cardHeight: value }))}
                             min={12}
                             max={40}
                             unit="rem"
                         />
                    </div>
                </CollapsibleSection>

                {/* Styling */}
                <CollapsibleSection 
                    title="Colors & Styling" 
                    icon={<ColorSwatchIcon />}
                >
                    <div className="space-y-6">
                        <GradientColorPicker 
                            label="Progress Bar Color" 
                            value={project.progressBarColor} 
                            onChange={value => setProject(p => ({...p, progressBarColor: value}))} 
                        />
                        
                        <GradientColorPicker 
                            label="Tag Color" 
                            value={project.tagColor} 
                            onChange={value => setProject(p => ({...p, tagColor: value}))} 
                        />
                        
                        <div>
                            <Label htmlFor="shadowStyle">Shadow Effect</Label>
                            <Select 
                                id="shadowStyle" 
                                name="shadowStyle" 
                                value={project.shadowStyle} 
                                onChange={handleInputChange}
                            >
                                {Object.values(ShadowStyle).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Select>
                        </div>
                        
                        <RangeSlider
                            label="Border Radius"
                            value={project.borderRadius}
                            onChange={(value) => setProject(prev => ({ ...prev, borderRadius: value }))}
                            min={0}
                            max={8}
                            showValue={false}
                        />
                        
                        <div>
                            <Label htmlFor="fontFamily">Font Family</Label>
                            <Select 
                                id="fontFamily" 
                                name="fontFamily" 
                                value={project.fontFamily} 
                                onChange={handleInputChange}
                            >
                                {Object.values(FONTS).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Meteo Status */}
                <CollapsibleSection 
                    title="Project Status" 
                    icon={<CloudIcon />}
                >
                    <div className="space-y-6">
                        <Toggle
                            checked={project.showMeteo}
                            onChange={(checked) => setProject(p => ({...p, showMeteo: checked}))}
                            label="Show Status Indicator"
                            description="Display a visual indicator of the project's current status"
                        />
                        
                                                 {project.showMeteo && (
                             <div>
                                 <Label>Current Status</Label>
                                 <div className="grid grid-cols-1 gap-3 mt-4">
                                     {(Object.keys(METEO_DATA) as (keyof typeof METEO_DATA)[]).map(status => {
                                         const meteo = METEO_DATA[status];
                                         const isSelected = project.meteoStatus === status;
                                         return (
                                             <button 
                                                 key={status} 
                                                 onClick={() => setProject(p => ({...p, meteoStatus: status}))} 
                                                 className={`group relative p-5 rounded-xl flex items-center gap-4 border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                                                     isSelected
                                                         ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20 ring-pulse' 
                                                         : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                 } ${meteo.bgColor} ${isSelected ? 'bg-opacity-20' : 'bg-opacity-10 hover:bg-opacity-15'}`}
                                             >
                                                 <div className={`flex-shrink-0 p-2 rounded-lg ${meteo.bgColor} ${isSelected ? 'bg-opacity-30' : 'bg-opacity-20'}`}>
                                                     <div className={`w-6 h-6 ${meteo.color}`}>
                                                         {meteo.icon}
                                                     </div>
                                                 </div>
                                                 <div className="flex-1 text-left">
                                                     <div className={`font-semibold text-base ${meteo.color}`}>
                                                         {meteo.label}
                                                     </div>
                                                     <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                         {status === MeteoStatus.EXCELLENT && 'Everything is going perfectly'}
                                                         {status === MeteoStatus.ON_TRACK && 'Project is progressing well'}
                                                         {status === MeteoStatus.MINOR_ISSUES && 'Some small issues to address'}
                                                         {status === MeteoStatus.AT_RISK && 'Requires immediate attention'}
                                                         {status === MeteoStatus.CRITICAL && 'Critical issues need resolution'}
                                                     </div>
                                                 </div>
                                                 {isSelected && (
                                                     <div className="flex-shrink-0">
                                                         <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                                                             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                         </div>
                                                     </div>
                                                 )}
                                             </button>
                                         );
                                     })}
                                 </div>
                                 {project.showMeteo && (
                                     <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                         <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                             </svg>
                                             <span>Status indicator will appear on your project card</span>
                                         </div>
                                     </div>
                                 )}
                             </div>
                         )}
                    </div>
                </CollapsibleSection>
                
                {/* Links */}
                <CollapsibleSection 
                    title="Project Links" 
                    icon={<LinkIcon />}
                >
                    <div className="space-y-4">
                        {project.links.map((link, index) => (
                            <Card key={link.id} className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <Label>Type</Label>
                                        <Select 
                                            value={link.type} 
                                            onChange={e => handleLinkChange(link.id, 'type', e.target.value)}
                                            className="w-32"
                                        >
                                            {Object.values(LinkType).map(lt => (
                                                <option key={lt} value={lt}>{lt}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Label>URL</Label>
                                        <Input 
                                            type="url" 
                                            value={link.url}
                                            onChange={e => handleLinkChange(link.id, 'url', e.target.value)}
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                    <div className="flex-shrink-0 pt-6">
                                        <Button
                                            onClick={() => removeLink(link.id)}
                                            variant="danger"
                                            size="sm"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        
                        <Button 
                            onClick={addLink} 
                            variant="secondary" 
                            fullWidth
                            icon={<LinkIcon />}
                        >
                            Add Link
                        </Button>
                    </div>
                </CollapsibleSection>
                
                {/* Saved Cards */}
                <CollapsibleSection 
                    title="Saved Cards" 
                    icon={<CollectionIcon />}
                >
                    <SavedCards 
                        projects={savedProjects}
                        onLoad={onLoadProject}
                        onDelete={onDeleteProject}
                        activeCardId={activeCardId}
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default ControlPanel;