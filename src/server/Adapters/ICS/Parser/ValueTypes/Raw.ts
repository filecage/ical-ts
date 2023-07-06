/**
 * We use this type to clarify that the connected value has not been
 * processed any further, even though they might not just be TEXT/string
 * values according to the RFC.
 *
 * Properties using this type might change to a rich presentation in later versions,
 * but they *should* keep a raw string representation in order to keep backwards compatibility.
 *
 * It is also a good practice to include the RFC's format definition in a comment block
 * of that property so that you don't always have to Google the RFC when working
 * with the code.
 */
export type Raw = string;