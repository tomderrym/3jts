/**
 * Block ID: datacard
 * Category: component
 * Description: DataCard component
 * Runtime: Glue-Paste Safe (no imports, no JSX, no framework)
 */

(function () {
  // ---- Guard: prevent double mount ----
  if (window.__BLOCK_DATACARD_MOUNTED__) return;
  window.__BLOCK_DATACARD_MOUNTED__ = true;

  const data = (window.__BLOCK_PROPS__ && window.__BLOCK_PROPS__.data) || undefined;
  const loading = (window.__BLOCK_PROPS__ && window.__BLOCK_PROPS__.loading) || undefined;

  // ---- Root ----
  const root = document.createElement("div");
  root.style.padding = "2rem";
  root.style.fontFamily = "system-ui, sans-serif";
  root.textContent = "DataCard component (basic conversion - JSX not fully parsed)";

  // ---- Mount ----
  document.body.appendChild(root);


  // ---- Optional registry hook (safe if exists) ----
  if (window.BlockRegistry && typeof window.BlockRegistry.register === "function") {
    window.BlockRegistry.register("datacard", {
      mount: () => {},
      unmount: () => {
        if (root && root.parentNode) {
          root.remove();
        }
        window.__BLOCK_DATACARD_MOUNTED__ = false;
      },
    });
  }
})();