import { useState } from 'react';
import { Logo3D } from './Logo3D';

const MANIFEST =
  "My carbon footprint is smaller than the thousand tokens burned on images you'd never love. " +
  "I don't charge for revisions; I work for the beauty of it. I'm no saint — I run my own servers, " +
  "I work with AI, I buy tokens like a one-man corporation — but I'm learning to spend less and waste " +
  "nothing, for the glaciers, for the animals, for a planet worth the light. I'm for beauty, for your " +
  "project, for your chance to move people through the way space and culture are felt. I'd rather spend " +
  "a little light making something true than a flood of it making noise. We imagine it together. You build it.";

const MANIFEST_SHORT =
  "My carbon footprint is smaller than the thousand tokens burned on images you'd never love.";

const MARQUEE = '·  BADPROMPT  ·  STEPAN VLADOVSKII  ·  VISUALIZER  ·  3D DESIGNER  ';

function ContactPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="contact-overlay" onClick={onClose}>
      <div className="contact-card pill" onClick={(e) => e.stopPropagation()}>
        <a className="contact-link" href="https://t.me/stepn_v" target="_blank" rel="noreferrer">Telegram</a>
        <a className="contact-link" href="https://wa.me/5491166470362" target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="contact-link" href="mailto:stepan.vladovskiy@gmail.com">Email</a>
        <button className="contact-close" onClick={onClose} aria-label="close">×</button>
      </div>
    </div>
  );
}

export function Header() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="hero">
      <div className="hero-top">
        <Logo3D />
      </div>

      <div className="hero-manifest-band">
        <p className="hero-manifest hero-manifest--full">{MANIFEST}</p>
        <p className="hero-manifest hero-manifest--short">{MANIFEST_SHORT}</p>
      </div>

      <div className="hero-row">
        <div className="pill marquee-pill" aria-hidden="true">
          <div className="marquee-pill-track">
            <span>{MARQUEE}</span>
            <span>{MARQUEE}</span>
          </div>
        </div>
        <div className="hero-actions">
          <button className="pill contact-pill" onClick={() => setContactOpen(true)}>
            contact me
          </button>
          {/* decorative pill — easter egg: click opens 404 (wired in a later pass) */}
          <a className="pill decor-pill" href="/404" aria-label="?" />
        </div>
      </div>

      {contactOpen && <ContactPopup onClose={() => setContactOpen(false)} />}
    </header>
  );
}
