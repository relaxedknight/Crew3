export type Prop = {
  onSelect: (e: SelectEvent) => void
}

export type SelectEvent = {
  native: string
}

export type Track = {
  called: boolean
  data?: Promise<unknown>
}
