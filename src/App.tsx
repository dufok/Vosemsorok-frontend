import { useEffect, useState } from 'react';
import { AsciiLogoBg } from './components/AsciiLogoBg';
import { MarqueeHeader } from './components/MarqueeHeader';
import { Timeline } from './components/Timeline';
import { fetchProjects } from './api/client';
import type { Project } from './types';

type Theme = 'auto' | 'light' | 'dark';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [theme, setTheme]       = useState<Theme>('auto');

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const body = document.body;

    if (theme === 'auto') {
      // Remove manual overrides — let CSS prefers-color-scheme take over
      body.classList.remove('light', 'dark');
    } else {
      body.classList.remove('light', 'dark');
      body.classList.add(theme);
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme(t => t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto');
  };

  const label = theme === 'auto' ? 'AUT' : theme === 'dark' ? 'DRK' : 'LGT';

  return (
    <div className="app">
      <AsciiLogoBg />
      <MarqueeHeader />
      <main className="main">
        {loading && <p className="status">…</p>}
        {error   && <p className="status error">{error}</p>}
        {!loading && !error && <Timeline projects={projects} />}
      </main>
      <button
        className="theme-toggle"
        onClick={cycleTheme}
        title={`Theme: ${theme}`}
      >
        {label}
      </button>
    </div>
  );
}
