// Helpers for safely building HTML strings from stellar data.

const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

// Only allow http(s) links; anything else (javascript:, data:, etc.) becomes '#'.
function safeUrl(url) {
    try {
        const parsed = new URL(String(url));
        return (parsed.protocol === 'https:' || parsed.protocol === 'http:') ? parsed.href : '#';
    } catch {
        return '#';
    }
}

// Formats a numeric stat, falling back to '??' when the value is unknown.
function formatStat(value, { scale = 1, locale = false } = {}) {
    if(value === null || value === undefined || value === '') {
        return '??';
    }
    const num = Number(value) * scale;
    if(!Number.isFinite(num)) {
        return '??';
    }
    return locale ? num.toLocaleString() : String(num);
}

export { escapeHtml, safeUrl, formatStat };
