export function ThemeScript() {
  const code = `
    (function() {
      try {
        var stored = localStorage.getItem('aid-theme');
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        var theme = stored || (prefersLight ? 'light' : 'dark');
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
