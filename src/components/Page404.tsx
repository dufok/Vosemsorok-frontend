/**
 * BADPROMPT 404 — on-brand "not found" page.
 * Sits over the shared AsciiLogoBg; same translucent plate as the manifest.
 */
export function Page404() {
  return (
    <main className="notfound">
      <div className="notfound-plate">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-msg">
          This page dissolved into dots. Nothing here but the background —
          and the background is the point.
        </p>
        <a className="pill notfound-home" href="/">← back home</a>
      </div>
    </main>
  );
}
