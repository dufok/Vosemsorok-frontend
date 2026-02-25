import { useEffect, useState } from 'react';
import { MarqueeHeader } from './components/MarqueeHeader';
import { Timeline } from './components/Timeline';
import { fetchProjects } from './api/client';
import type { Project } from './types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <MarqueeHeader />
      <main className="main">
        {loading && <p className="status">…</p>}
        {error   && <p className="status error">{error}</p>}
        {!loading && !error && <Timeline projects={projects} />}
      </main>
    </div>
  );
}
