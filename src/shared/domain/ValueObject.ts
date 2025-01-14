export abstract class BaseValueObject {
    toPrimitives(): Record<string, unknown> {
        const entries = Object.entries(this);
        const result: Record<string, unknown> = {};
        for (const [key, val] of entries) {
            if (val && typeof val === 'object' && 'value' in val) {
                result[key] = (val as { value: unknown }).value;
            } else {
                result[key] = val;
            }
        }
        return result;
    }
}
