export function build(input: {
  protocol: 'http' | 'https',
  domain: string
  port?: number
}) {

  const base = `${input.protocol}://${input.domain}${input.port ? `:${input.port}` : ''}`

  return (input: {
    path?: `/${string}`,
    init?: RequestInit
  }) => fetch(`${base}${input.path || '/'}`, input.init)
}
