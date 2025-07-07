import React from 'react';
import type { ProjectData } from '../types.ts';

interface SavedCardsProps {
    projects: ProjectData[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    activeCardId: string | null;
}

const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
);


const SavedCards: React.FC<SavedCardsProps> = ({ projects, onLoad, onDelete, activeCardId }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                No saved cards yet.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {projects.map(p => (
                <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCardId === p.id ? 'bg-blue-500/20' : 'bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                >
                    <span className="font-medium truncate flex-1 pr-4 text-slate-700 dark:text-slate-200">{p.name}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                            onClick={() => onLoad(p.id)}
                            className="text-xs font-semibold px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                        >
                            Load
                        </button>
                        <button
                            onClick={() => onDelete(p.id)}
                            className="p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/20 transition-all"
                            aria-label="Delete card"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedCards;