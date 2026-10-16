import type { $Verifier } from '@verifier/types';

export const verifierCodes = {
    invalidInstance(className: $Verifier.AnyConstructor): string {
        return `Invalid instance received: "${className.name}" instance was expected;`;
    },
    invalidMember<ClassName extends $Verifier.AnyConstructor>(
        member: keyof InstanceType<ClassName> & string,
        className: ClassName
    ): string {
        return `Invalid value was received for member "${member}" of instance "${className.name}";`;
    },
    requiredEntity<ClassName extends $Verifier.AnyConstructor>(
        member: keyof InstanceType<ClassName> & string,
        className: ClassName
    ): string {
        return `"${className.name}.${member}" must contain at least one instance;`;
    }
} as const;
