import { useEffect, useState } from 'react';
import { AsciiLogoBg } from './components/AsciiLogoBg';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { Page404 } from './components/Page404';
import { fetchProjects } from './api/client';
import type { Project } from './types';

type Theme = 'auto' | 'light' | 'dark';

// only the root path is a real route; everything else is a 404
const isNotFound = window.location.pathname !== '/';

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
      {isNotFound ? (
        <Page404 />
      ) : (
        <>
          <Header />
          <main className="main">
            {loading && <p className="status">…</p>}
            {error   && <p className="status error">{error}</p>}
            {!loading && !error && <Timeline projects={projects} />}
          </main>
        </>
      )}
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
