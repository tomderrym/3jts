/**
 * Block ID: logterminal
 * Category: component
 * Description: LogTerminal component
 * Runtime: Glue-Paste Safe (no imports, no JSX, no framework)
 */

(function () {
  // ---- Guard: prevent double mount ----
  if (window.__BLOCK_LOGTERMINAL_MOUNTED__) return;
  window.__BLOCK_LOGTERMINAL_MOUNTED__ = true;

  const logs = (window.__BLOCK_PROPS__ && window.__BLOCK_PROPS__.logs) || undefined;
  const type = (window.__BLOCK_PROPS__ && window.__BLOCK_PROPS__.type) || undefined;
  const streamText = (window.__BLOCK_PROPS__ && window.__BLOCK_PROPS__.streamText) || undefined;

  // ---- Root ----
  const root = document.createElement("div");
  root.style.padding = "2rem";
  root.style.fontFamily = "system-ui, sans-serif";
  root.textContent = "LogTerminal component (basic conversion - JSX not fully parsed)";

  // ---- Mount ----
  document.body.appendChild(root);


  // ---- Optional registry hook (safe if exists) ----
  if (window.BlockRegistry && typeof window.BlockRegistry.register === "function") {
    window.BlockRegistry.register("logterminal", {
      mount: () => {},
      unmount: () => {
        if (root && root.parentNode) {
          root.remove();
        }
        window.__BLOCK_LOGTERMINAL_MOUNTED__ = false;
      },
    });
  }
})();