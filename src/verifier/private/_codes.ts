import type { $Shared } from '@/types';

export const verifierCodes = {
    invalidInstance(classRef: $Shared.AnyConstructor): string {
        return `Invalid instance received: "${classRef.name}" instance was expected;`;
    },
    invalidMember<ClassRef extends $Shared.AnyConstructor>(
        member: keyof InstanceType<ClassRef> & string,
        classRef: ClassRef
    ): string {
        return `Invalid value was received for member "${member}" of instance "${classRef.name}";`;
    },
    requiredEntity<ClassRef extends $Shared.AnyConstructor>(
        member: keyof InstanceType<ClassRef> & string,
        classRef: ClassRef
    ): string {
        return `"${classRef.name}.${member}" must contain at least one instance;`;
    }
} as const;
