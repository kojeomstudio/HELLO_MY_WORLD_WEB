const translations: Record<string, Record<string, string>> = {
    en: {
        'cmd.help': 'Show available commands',
        'cmd.status': 'Server status (TPS, players)',
        'ui.health': 'Health',
        'ui.hunger': 'Hunger',
        'ui.breath': 'Breath',
        'death.title': 'You Died!',
        'death.respawn': 'Click to respawn',
        'chat.join': '{player} joined the game',
        'chat.leave': '{player} left the game',
        'inventory.title': 'Inventory',
        'crafting.title': 'Crafting',
        'creative.title': 'Creative Inventory',
        'furnace.title': 'Furnace',
        'chest.title': 'Chest',
    },
    ko: {
        'cmd.help': '사용 가능한 명령어 보기',
        'cmd.status': '서버 상태 (TPS, 플레이어)',
        'ui.health': '체력',
        'ui.hunger': '배고',
        'ui.breath': '호흡',
        'death.title': '사망했습니다!',
        'death.respawn': '클릭하여 리스폰',
        'chat.join': '{player}님이 게임에 참여했습니다',
        'chat.leave': '{player}님이 게임에서 나갔습니다',
        'inventory.title': '인벤토리',
        'crafting.title': '제작',
        'creative.title': '크리에이티브 인벤토리',
        'furnace.title': '화로',
        'chest.title': '상자',
    }
};

let currentLocale = 'en';

function format(template: string, params: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(params)) {
        result = result.replace(`{${key}}`, value);
    }
    return result;
}

export function t(key: string, params?: Record<string, string>): string {
    const dict = translations[currentLocale] ?? translations['en'];
    let text = dict[key] ?? translations['en'][key] ?? key;
    if (params) {
        text = format(text, params);
    }
    return text;
}

export function setLocale(locale: string): void {
    if (translations[locale]) {
        currentLocale = locale;
    }
}

export function getLocale(): string {
    return currentLocale;
}

export function getAvailableLocales(): string[] {
    return Object.keys(translations);
}
