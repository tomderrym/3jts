/**
 * Block ID: habittracker
 * Category: component
 * Description: HabitTracker component
 * Runtime: Glue-Paste Safe (no imports, no JSX, no framework)
 */

(function () {
  // ---- Guard: prevent double definition ----
  if (window.__BLOCK_HABITTRACKER_DEFINED__) return;
  window.__BLOCK_HABITTRACKER_DEFINED__ = true;

  let root = null;

  function mount(props = {}, host) {
    if (root) return; // Already mounted

    const amount = props.amount !== undefined ? props.amount : undefined;
    const activity = props.activity !== undefined ? props.activity : undefined;

    // ---- Root ----
    const root = document.createElement("div");
    root.style.padding = "2rem";
    root.style.fontFamily = "system-ui, sans-serif";
    root.textContent = "HabitTracker component (basic conversion - JSX not fully parsed)";


    // Mount to provided host or fallback to document.body
    const mountTarget = host || document.body;
    mountTarget.appendChild(root);
  }

  function unmount() {
    if (root && root.parentNode) {
      root.remove();
      root = null;
    }
  }

  // ---- Register with BlockRegistry (if available) ----
  if (window.BlockRegistry && typeof window.BlockRegistry.register === "function") {
    window.BlockRegistry.register("habittracker", {
      mount,
      unmount,
    });
  } else {
    // Fallback: auto-mount if BlockRegistry is not available
    mount(window.__BLOCK_PROPS__ || {}, window.__BLOCK_HOST__);
  }
})();