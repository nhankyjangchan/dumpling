export const verifierCodes = {
    invalidInstance(className: string): string {
        return `Invalid instance received: "${className}" instance was expected;`;
    },
    invalidMember(member: string, className: string): string {
        return `Invalid value was received for member "${member}" of instance "${className}";`;
    },
    requiredEntity(member: string, className: string): string {
        return `"${className}.${member}" must contain at least one instance;`;
    }
} as const;
