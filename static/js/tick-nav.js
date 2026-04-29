/* tick-nav.js
 * --------------------------------------------------------------
 * Implements:
 *   1. Tick navigator with macOS-dock-style magnification on hover.
 *   2. Active-tick tracking via IntersectionObserver as the reader scrolls.
 *   3. Smooth-scroll for in-page jumps (with reduced-motion respect).
 *
 * Performance note: with hundreds of posts, we throttle the magnification
 * update to one rAF per mousemove and bail out cheaply when the cursor is
 * far from the rail.
 */

(function () {
    'use strict';

    const tickList = document.getElementById('tick-list');
    if (!tickList) return;

    const tickItems = Array.from(tickList.querySelectorAll('.tick-item'));
    const ticks = tickItems.map(li => li.querySelector('.tick'));
    const links = tickItems.map(li => li.querySelector('a'));

    /* -- Magnification ------------------------------------------------- */

    /* Tunables */
    const MAX_SCALE = 2.6;          // peak scaling at cursor center
    const RANGE_PX = 180;           // vertical falloff radius
    const RAIL_HOVER_PADDING = 80;  // how far left of the rail still triggers

    let frame = null;
    let lastMouse = { x: 0, y: 0, active: false };

    function updateScales() {
        frame = null;
        if (!lastMouse.active) {
            for (const t of ticks) t.style.transform = '';
            return;
        }

        const cursorY = lastMouse.y;
        for (let i = 0; i < ticks.length; i++) {
            const t = ticks[i];
            const rect = t.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const d = Math.abs(center - cursorY);
            let scale = 1;
            if (d < RANGE_PX) {
                /* cosine bump: 1 at d = RANGE_PX, 1 + MAX_SCALE at d = 0 */
                const k = Math.cos((d / RANGE_PX) * (Math.PI / 2));
                scale = 1 + (MAX_SCALE - 1) * k;
            }
            t.style.transform = `scaleX(${scale.toFixed(3)})`;
        }
    }

    function onMouseMove(ev) {
        /* Cheap test: only magnify when the cursor is near the right rail */
        const rail = tickList.getBoundingClientRect();
        const nearRail = ev.clientX > rail.left - RAIL_HOVER_PADDING;
        lastMouse = { x: ev.clientX, y: ev.clientY, active: nearRail };
        if (frame == null) frame = requestAnimationFrame(updateScales);
    }

    function onMouseLeaveDocument() {
        lastMouse.active = false;
        if (frame == null) frame = requestAnimationFrame(updateScales);
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDocument);
    /* When the cursor crosses out of the page (e.g. switches windows) */
    window.addEventListener('blur', onMouseLeaveDocument);


    /* -- Active-tick tracking ----------------------------------------- */

    const idToItem = new Map();
    for (const li of tickItems) {
        const a = li.querySelector('a');
        if (a) {
            const id = a.getAttribute('href').slice(1); /* strip '#' */
            idToItem.set(id, li);
        }
    }

    const articles = Array.from(document.querySelectorAll('article.post'));
    if (articles.length && 'IntersectionObserver' in window) {
        let activeId = null;
        const visible = new Map(); /* id -> intersectionRatio */

        const io = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const id = entry.target.id;
                if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
                else visible.delete(id);
            }
            /* pick the most-visible one; ties broken by document order */
            let bestId = null, bestRatio = -1;
            for (const a of articles) {
                if (visible.has(a.id)) {
                    const r = visible.get(a.id);
                    if (r > bestRatio) { bestRatio = r; bestId = a.id; }
                }
            }
            if (bestId !== activeId) {
                if (activeId && idToItem.has(activeId)) {
                    idToItem.get(activeId).classList.remove('is-active');
                }
                if (bestId && idToItem.has(bestId)) {
                    idToItem.get(bestId).classList.add('is-active');
                }
                activeId = bestId;
            }
        }, {
            rootMargin: '-30% 0px -55% 0px', /* favour the article in the top-middle of viewport */
            threshold: [0, 0.25, 0.5, 0.75, 1.0]
        });

        for (const a of articles) io.observe(a);
    }


    /* -- Smooth-scroll for in-page jumps ------------------------------ */

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function smoothJumpTo(targetId, ev) {
        const target = document.getElementById(targetId);
        if (!target) return;
        if (ev) ev.preventDefault();
        target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
        /* Update the URL hash without an extra jump */
        history.replaceState(null, '', '#' + targetId);
    }

    /* Tick links */
    for (const a of links) {
        a.addEventListener('click', (ev) => {
            const href = a.getAttribute('href') || '';
            if (href.startsWith('#')) smoothJumpTo(href.slice(1), ev);
        });
    }

    /* Jump-to-bottom button */
    const jumpBtn = document.querySelector('.jump-to-bottom');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', (ev) => {
            const href = jumpBtn.getAttribute('href') || '';
            if (href.startsWith('#')) smoothJumpTo(href.slice(1), ev);
        });
    }
})();
