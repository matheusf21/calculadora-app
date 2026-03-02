export function sanitizeNumberString(s) {
    if (!s) return "0";
    return s;
}

export function toNumber(displayText) {
    const raw = String(displayText).replace(/\./g, "").replace (/,/g, ".");
    const n = Number(raw);
    return Number.isFinite(n) ? n :  NaN;
} 

export function formatNumber(n, locale = "pt-BR") {
    if (!Number.isFinite(n)) return 'Erro';

    const fixed = fixFloat(n); 

    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 10,
    }).format(fixed);

}

export function fixFloat(n) {
    return Math.round((n + Number.EPSILON) * 1e12) / 1e12;
}