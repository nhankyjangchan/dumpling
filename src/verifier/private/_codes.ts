import type { $Shared } from '@/types';

export const verifierCodes = {
    invalidInstance(ClassRef: $Shared.AnyConstructor): string {
        return `Invalid instance received: "${ClassRef.name}" instance was expected;`;
    },
    invalidMember<AnyClassRef extends $Shared.AnyConstructor>(
        member: keyof InstanceType<AnyClassRef> & string,
        ClassRef: AnyClassRef
    ): string {
        return `Invalid value was received for member "${member}" of instance "${ClassRef.name}";`;
    },
    requiredEntity<AnyClassRef extends $Shared.AnyConstructor>(
        member: keyof InstanceType<AnyClassRef> & string,
        ClassRef: AnyClassRef
    ): string {
        return `"${ClassRef.name}.${member}" must contain at least one instance;`;
    }
} as const;
