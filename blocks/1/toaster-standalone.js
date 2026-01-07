/**
 * Block ID: toaster
 * Category: component
 * Description: Toaster component
 * Runtime: Glue-Paste Safe (no imports, no JSX, no framework)
 */

(function () {
  // ---- Guard: prevent double definition ----
  if (window.__BLOCK_TOASTER_DEFINED__) return;
  window.__BLOCK_TOASTER_DEFINED__ = true;

  let root = null;

  function mount(props = {}, host) {
    if (root) return; // Already mounted

    const props = props.props !== undefined ? props.props : undefined;

    // ---- Root ----
    const root = document.createElement("div");
    root.style.padding = "2rem";
    root.style.fontFamily = "system-ui, sans-serif";
    root.textContent = "Toaster component (basic conversion - JSX not fully parsed)";


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
    window.BlockRegistry.register("toaster", {
      mount,
      unmount,
    });
  } else {
    // Fallback: auto-mount if BlockRegistry is not available
    mount(window.__BLOCK_PROPS__ || {}, window.__BLOCK_HOST__);
  }
})();