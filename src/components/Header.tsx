import { useState } from 'react';
import { Logo3D } from './Logo3D';

const MANIFEST =
  "Stepan Vladovskii — Engineer, Set Designer, Organizer, Director of Photography, and — most in-demand of all — 3D Artist. " +
  "For years I've helped create, launch, build, run, glue and cut. Actively looking for a new team!";

const MANIFEST_SHORT =
  "Stepan Vladovskii — Engineer, Set Designer, Director of Photography, and most in-demand — 3D Artist. Open to a new team.";

const MARQUEE = '·  BADPROMPT  ·  STEPAN VLADOVSKII  ·  ENGINEER  ·  SET DESIGNER  ·  ORGANIZER  ·  DIRECTOR OF PHOTOGRAPHY  ·  3D ARTIST  ·  OPEN TO WORK  ';

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
