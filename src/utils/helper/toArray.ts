export const toArray = (value: unknown): unknown[] => {
    if(Array.isArray(value)) return value;
    if(value && typeof value === "object") return [value];

    if(typeof value === "string") {
        const trimmed = value.trim();
        if(!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            if(Array.isArray(trimmed)) return parsed;
            if(parsed && typeof parsed === "object") return [parsed];
            return [];
        } catch {
            return [];
        };
    };

    return [];
};