export function handle(e: unknown) {

  const message = e instanceof Error ? e.message : 'Unknown error occurred'

  return {
    ok: false,
    message
  } as const
}
