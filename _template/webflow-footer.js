/**
 * Snippet name: one-line description of what it does
 *
 * Where:    Webflow → Page settings → Custom code → Before </body> tag
 * Requires: [data-snippet="item"] on each element
 * Depends:  none
 *           (or: GSAP + ScrollTrigger, enabled in Site settings → GSAP)
 */

// Safety net: keeps Webflow.push working even if this code runs before webflow.js
var Webflow = Webflow || [];

Webflow.push(function () {
  const LOG = '[snippet-name]';

  // 1. Find elements; exit quietly if this page doesn't have them
  const items = document.querySelectorAll('[data-snippet="item"]');
  if (!items.length) {
    console.log(LOG, 'no elements on this page, skipping');
    return;
  }
  console.log(LOG, 'found', items.length, 'element(s)');

  // 2. Main logic
  items.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('is--active');
    });
  });

  console.log(LOG, 'ready');
});
