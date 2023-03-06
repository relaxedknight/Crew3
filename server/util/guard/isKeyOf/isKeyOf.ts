export function isKeyOf <A extends Record<string, unknown>>(input: A, key: string | number | symbol): key is keyof A {

  return key in input
}
