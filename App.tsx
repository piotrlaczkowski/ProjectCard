

import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { GoogleGenAI } from '@google/genai';

import ControlPanel from './components/ControlPanel.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import useLocalStorage from './hooks/useLocalStorage.ts';
import type { ProjectData, Theme } from './types.ts';
import { createNewProject } from './constants.tsx';

const App: React.FC = () => {
  const [savedProjects, setSavedProjects] = useLocalStorage<Record<string, ProjectData>>('project-cards-v2', {});
  const [currentProject, setCurrentProject] = useState<ProjectData>(createNewProject());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('project-card-theme', 'dark');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
  };

  const handleSaveProject = () => {
    // Check for name collision before saving
    const nameCollision = Object.values(savedProjects).find(
        p => p.name.toLowerCase() === currentProject.name.toLowerCase().trim() && p.id !== currentProject.id
    );

    if (nameCollision) {
        showNotification(`A card named "${currentProject.name}" already exists. Please use a unique name.`, 'error');
        return;
    }

    setSavedProjects(prev => ({
        ...prev,
        [currentProject.id]: currentProject,
    }));
    
    setActiveCardId(currentProject.id);
    showNotification(`Card "${currentProject.name}" saved!`);
  };

  const handleNewProject = () => {
    const newProj = createNewProject();
    setCurrentProject(newProj);
    setActiveCardId(null);
  };
  
  const handleResetProject = () => {
      const defaults = createNewProject();
      setCurrentProject(prev => ({
          ...defaults,
          id: prev.id, // Keep the same ID
          name: prev.name, // Keep the name
      }));
  };

  const handleLoadProject = (id: string) => {
    const projectToLoad = savedProjects[id];
    if (projectToLoad) {
        const defaults = createNewProject();
        setCurrentProject({...defaults, ...projectToLoad});
        setActiveCardId(id);
    }
  };

  const handleDeleteProject = (id: string) => {
    const deletedProjectName = savedProjects[id]?.name;
    setSavedProjects(prev => {
        const newProjects = {...prev};
        delete newProjects[id];
        return newProjects;
    });
    showNotification(`Card "${deletedProjectName}" deleted.`);

    if (activeCardId === id) {
        handleNewProject();
    }
  };

  const getFontCss = async () => {
      const FONT_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Slab:wght@400;700&family=Space+Mono:wght@400;700&display=swap";
      try {
          const response = await fetch(FONT_URL);
          if (!response.ok) return '';
          return response.text();
      } catch (error) {
          console.error("Failed to fetch font CSS:", error);
          return '';
      }
  };


  const handleExportToPng = async () => {
    if (!cardRef.current) {
      showNotification('Error: Card element not found.', 'error');
      return;
    }
    try {
      const fontCss = await getFontCss();
      const blob = await htmlToImage.toBlob(cardRef.current, { 
        backgroundColor: 'transparent',
        fontEmbedCSS: fontCss || undefined,
      });

      if (!blob) {
          throw new Error('Could not create image blob.');
      }
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showNotification('Image copied to clipboard!');
    } catch (err) {
      console.error('Error exporting to PNG:', err);
      showNotification('Failed to copy image.', 'error');
    }
  };

  const handleGenerateWithAI = async (prompt: string) => {
    if (!process.env.API_KEY) {
        showNotification('API_KEY is not configured.', 'error');
        return;
    }
    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: `Based on the following idea, generate content for a project card. Idea: "${prompt}". Provide a response in JSON format with three keys: "name" (a creative project name, max 5 words), "tag" (a short, relevant tag, max 2 words), and "description" (a concise, one-sentence description).`,
        config: { responseMimeType: "application/json" },
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      
      const parsed = JSON.parse(jsonStr);
      setCurrentProject(p => ({
        ...p,
        name: parsed.name || p.name,
        tag: parsed.tag || p.tag,
        description: parsed.description || p.description,
      }));
      showNotification('Content generated with AI!');

    } catch (error) {
        console.error("AI Generation Error:", error);
        showNotification('Failed to generate AI content.', 'error');
    } finally {
        setIsGeneratingAI(false);
    }
  };

  const sortedProjects = Object.values(savedProjects).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {notification && (
          <div className={`fixed top-5 right-5 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-notification`}>
              {notification.message}
          </div>
      )}

      {/* Control Panel (Left Side) */}
      <div className="w-full lg:w-[480px] lg:flex-shrink-0 h-auto lg:h-full border-r border-slate-200 dark:border-slate-700/50">
        <ControlPanel
          project={currentProject}
          setProject={setCurrentProject}
          onSave={handleSaveProject}
          onNew={handleNewProject}
          onReset={handleResetProject}
          onExport={handleExportToPng}
          onGenerate={handleGenerateWithAI}
          isGeneratingAI={isGeneratingAI}
          savedProjects={sortedProjects}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteProject}
          activeCardId={activeCardId}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      {/* Project Card Preview (Right Side) */}
      <main className="flex-grow h-full flex items-center justify-center p-4 md:p-8 overflow-auto relative bg-slate-50 dark:bg-slate-900">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(theme(colors.slate.200)_1px,transparent_1px)] dark:bg-[radial-gradient(theme(colors.slate.700)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        {/* Content must be relative to appear on top */}
        <div className="relative">
          <ProjectCard project={currentProject} ref={cardRef} />
        </div>
      </main>
    </div>
  );
};

export default App;