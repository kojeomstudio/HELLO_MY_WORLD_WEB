export interface EnrichedSegment {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

const MINETEST_COLOR_MAP: Record<string, string> = {
    '0': '#000000',
    '1': '#0000AA',
    '2': '#00AA00',
    '3': '#00AAAA',
    '4': '#AA0000',
    '5': '#AA00AA',
    '6': '#FFAA00',
    '7': '#AAAAAA',
    '8': '#555555',
    '9': '#5555FF',
    'a': '#55FF55',
    'b': '#55FFFF',
    'c': '#FF5555',
    'd': '#FF55FF',
    'e': '#FFFF55',
    'f': '#FFFFFF'
};

export class EnrichedString {
    static parse(text: string): EnrichedSegment[] {
        const segments: EnrichedSegment[] = [];
        let currentColor = '#FFFFFF';
        let bold = false;
        let italic = false;
        let underline = false;
        let buffer = '';

        const flush = () => {
            if (buffer.length > 0) {
                segments.push({
                    text: buffer,
                    color: currentColor,
                    bold,
                    italic,
                    underline
                });
                buffer = '';
            }
        };

        let i = 0;
        while (i < text.length) {
            if (text[i] === '\u00A7' && i + 1 < text.length) {
                flush();
                const code = text[i + 1].toLowerCase();
                if (MINETEST_COLOR_MAP[code]) {
                    currentColor = MINETEST_COLOR_MAP[code];
                } else if (code === 'l') {
                    bold = true;
                } else if (code === 'm') {
                    underline = true;
                } else if (code === 'o') {
                    italic = true;
                } else if (code === 'r') {
                    currentColor = '#FFFFFF';
                    bold = false;
                    italic = false;
                    underline = false;
                }
                i += 2;
                continue;
            }

            if (text[i] === '#' && i + 1 < text.length && text[i + 1] === '#') {
                flush();
                i += 2;
                continue;
            }

            buffer += text[i];
            i++;
        }

        flush();
        return segments;
    }

    static toHtml(text: string): string {
        const segments = EnrichedString.parse(text);
        return segments.map(seg => {
            if (!/^#[0-9a-fA-F]{6}$/.test(seg.color)) return '';
            let style = `color:${seg.color}`;
            if (seg.bold) style += ';font-weight:bold';
            if (seg.italic) style += ';font-style:italic';
            if (seg.underline) style += ';text-decoration:underline';
            const escaped = seg.text;
            return `<span style="${style}">${escaped}</span>`;
        }).join('');
    }

    static stripColors(text: string): string {
        let result = '';
        let i = 0;
        while (i < text.length) {
            if (text[i] === '\u00A7' && i + 1 < text.length) {
                i += 2;
                continue;
            }
            result += text[i];
            i++;
        }
        return result;
    }

    static applyColor(text: string, color: string): string {
        const code = Object.entries(MINETEST_COLOR_MAP).find(([, v]) => v.toLowerCase() === color.toLowerCase());
        if (code) {
            return `\u00A7${code[0]}${text}\u00A7r`;
        }
        return text;
    }
}
