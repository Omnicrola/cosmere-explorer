import { vi, beforeEach } from 'vitest';

// gsap is loaded as a global <script> in index.html; tests get a stub that completes
// tweens instantly (calling onUpdate and onComplete) so end states can be asserted.
beforeEach(() => {
    globalThis.gsap = {
        to: vi.fn((target, vars) => {
            for(const key of ['x', 'y', 'z']) {
                if(key in vars) {
                    target[key] = vars[key];
                }
            }
            vars.onUpdate?.();
            vars.onComplete?.();
            return { kill: vi.fn() };
        }),
        killTweensOf: vi.fn(),
    };
    localStorage.clear();
    history.replaceState(null, '', '/');
    document.body.innerHTML = '';
});
