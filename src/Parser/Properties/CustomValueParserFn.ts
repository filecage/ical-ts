import {ValueParserFn} from "../parseValues";

/**
 * This interface is used to tell the property parser compiler
 * that a property requires its value to be parsed through a non-standard
 * value type parser.
 *
 * It does not serve any purpose in the production environment.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
export default interface CustomValueParserFn<C extends ValueParserFn> {
/**
 * Would be lovely to instead of mapping these functions we could just
 * implement a static function, but typescript doesn't allow static
 * members on an interface because... well, probably because they try
 * to gain perfection through imperfection I guess?
 *
 * @see https://github.com/microsoft/TypeScript/issues/14600
 * @see https://github.com/microsoft/TypeScript/issues/34516
 */
}