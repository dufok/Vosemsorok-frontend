export function MarqueeHeader() {
  const text = '\u00A0\u00A0·\u00A0\u00A0VOSEMSOROK\u00A0\u00A0·\u00A0\u00A0STEPAN VLADOVSKII\u00A0\u00A0·\u00A0\u00A02026\u00A0\u00A0·\u00A0\u00A0VISUALIZER\u00A0\u00A0·\u00A0\u00A03D DESIGNER';

  return (
    <header className="marquee-header">
      <div className="marquee-track">
        {/* Duplicate 4× so there's never a gap at any screen width */}
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
      </div>
    </header>
  );
}
