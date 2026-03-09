import { fixFloat, formatNumber, toNumber } from "./format";

const OPS= new Set(["+", "-", "*", "/"]);

export function createEngine({ locale = "pt-BR"} = {}) {

    function initialState() {
        return {
            display: formatNumber(0, locale),
            expression: "",
            storedValue: null,
            pendingOp: null,
            isNewEntry: true,
            lastKey: null,
        };
    }

    function reduce(state, key) {
        const s = { ...state, lastKey: key};

        // helpers
        const current = toNumber(s.display);
        const setDisplayNumber = (n) => {
            s.display = formatNumber(n, locale);
        }

        // Digits / dot
        if (isDigit(key) || key === ".") {
            return onDigitOrDot(s, key, locale);
        }

        // clear
        if (key === "C") {
            return initialState();
        }

        // sign
        if (key === "SIGN") {
            if (!Number.isFinite(current)) return s;
            setDisplayNumber(current * -1);
            s.isNewEntry = false;
            return s;
        }

        // percent 
        if (key === "%") {
            if(!Number.isFinite(current)) return s;
            setDisplayNumber(current / 100);
            s.isNewEntry = true;
            s.expression = `${formatNumber(current, locale)} %`
            return s;
        }

        //  operator
        if(OPS.has(key)) {
            return onOperator (s, key, locale);
        }

        // equal
        if (key === "=") {
            return onEqual(s, locale);
        }

        return s;
    }

    function onDigitOrDot(s, key, locale) {
        const raw = displayToRaw(s.display);

        let nextRaw;
        if (s.isNewEntry) {
            nextRaw = key === "." ? "0." : key;
            s.isNewEntry = false;
        } else {
            if (key ==="." && raw.includes(".")) return s;
            nextRaw = raw === "0" && key !== "." ? key : raw + key; 
        }

        if (nextRaw.replace("-","").length > 14) return s; 

        const n = Number(nextRaw);
        if(!Number.isFinite(n)) {
            s.display = "Erro";
            s.isNewEntry = true;
            return s;
        }

        if (nextRaw.endsWith(".")) {
            s.display = formatNumber(n, locale).replace(/0$/, "") + ",";
            return s;
        }

        s.display = formatNumber(n, locale);
        return s;
    }

    
    function onOperator(s, op, locale) {
        const current = toNumber(s.display);
        if(!Number.isFinite(current)) return s;

        if (s.pendingOp && s.storedValue !== null && !isNewEntry){
            const computed = compute(s.storedValue, current, s,pendingOp);
            if (Number.isFinite(computed)) {
                s.display = 'Erro';
                s.expression = "";
                s.pendingOp = null;
                s.storedValue = null;
                s.isNewEntry = true;
                return s;
            }
            s.storedValue = computed;
            s.display = formatNumber(computed, locale);

        }   else if (s.storedValue === null) {
            s.storedValue = current;
        }

        s.pendingOp = op;
        s.isNewEntry = true; 
        s.expression = `${formatNumber(s.storedValue, locale)} ${symbol(op)} `;
        return s;
    }

    function onEqual(s, locale) {
        const current = toNumber(s.display);
        if (s.pendingOp && s.storedValue != null && Number.isFinite(current)){
            const computed = compute(s.storedValue, current, s.pendingOp);

            s.expression = `${formatNumber(s.storedValue, locale)} ${symbol(s.pendingOp)} ${formatNumber(current, locale)}}`

            if (!Number.isFinite(computed)) {
                s.display = "Erro";
            } else {
                s.display = formatNumber(computed, locale)
            }

            s.storedValue = null
            s.pendingOp = null
            s.isNewEntry = null
        }
    }

    function compute(a, b, op) {
        const A = Number(a);
        const B = Number(b);
        switch (op) {
            case "+" :
                return fixFloat(A + B)
            case "-" :
                return fixFloat(A - B)
            case "*" :
                return fixFloat(A * B)
            case "/" :
                return B === 0 ? NaN  : fixFloat(A / B);
            default: 
                return NaN;    
        }
    }

    function symbol(op) {
       if (op === "*") return "x"; 
       if (op === "/") return "÷";
       return op; 
    }

    function isDigit(k) {
        return/^[0-9]$/.test(k);
    }

    function displayToRaw(displayText) {
        const s = String(displayText);
        if (s === "Erro") return "0";
        const normalized =s.replace(/\./g, "").replace(/,/g, ".");
        return normalized === "" ? "0" : normalized;
    }

    return { initialState, reduce } 

}