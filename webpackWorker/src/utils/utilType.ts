type ExtraKeys<I, E> = {
    [K in keyof I]: Extract<E, K> extends never ? K : never;
}[keyof I];

type MissingKeys<I, E> = Exclude<E, keyof I>;

type VerifyItoECheck<Missing extends never, ExtraKeys extends never> = 0;

/**
 * https://stackoverflow.com/questions/51829842/how-to-force-interface-to-implement-keys-of-enum-in-typescript-3-0
 * Genericized it a little more
 *
 * TL;DR; We can enforce Enum/String Literal against interfaces :) without classes with:
 * VerifyItoEResult<VerifyItoE<I,E> where I is the Interface, and E is the String Literal or Enum
 *
 * This is a two step validation system, I known I know it's not perfect, but this is
 * better than a dummy class as that is code left over...
 *
 * Essentially how this work is VerifyIToE will only return 0 if both generic constraints
 * of VerifyItoECheck are met. This is accomplished thanks to conditional types, for those
 * wondering why VerifyItoResult is required it is to return unknown.
 *
 * Fun fact all primitves extend never, so we can't check that VerifyItoECheck on it's own plus
 * due to constraints can't just set to generics as the first parameters :(
 *
 * The solution to this was to utilized unknown as it is NOT extended by number. Making the generic
 * constraint in VerifyItoEResult fail, thus validating our type. The core of the idea came from the link
 * above. All I did was make it so we could pass stuff generically instead of having to write specific
 * VerifyItoECheck for every check, that's hard to maintain...
 *
 *
 */
export type VerifyItoE<I, E> = MissingKeys<I, E> extends never
    ? ExtraKeys<I, E> extends never
        ? VerifyItoECheck<MissingKeys<I, E>, ExtraKeys<I, E>>
        : unknown
    : unknown;

export type VerifyItoEResult<T extends number> = T;
