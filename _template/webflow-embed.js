/**
 * Snippet name: one-line description of what it does
 *
 * Where:    Webflow → Embed element inside a section (not the footer)
 * Requires: [data-snippet="item"] on each element
 * Depends:  none
 *
 * Why not Webflow.push: inside the page body webflow.js isn't loaded yet,
 * so this snippet waits for the DOM on its own.
 */

(function () {
  const LOG = '[snippet-name]';

  function init() {
    const items = document.querySelectorAll('[data-snippet="item"]');
    if (!items.length) {
      console.log(LOG, 'no elements on this page, skipping');
      return;
    }

    items.forEach((item) => {
      // Main logic
    });

    console.log(LOG, 'ready,', items.length, 'element(s)');
  }

  // Run now if the DOM is ready, otherwise wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
