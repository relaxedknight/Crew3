export type TargetSelection = {
  currentTarget: HTMLElement & {
    selectionStart: number
    selectionEnd: number
  }
}

export type EmojiSelectEvent = {
  native: string
}
