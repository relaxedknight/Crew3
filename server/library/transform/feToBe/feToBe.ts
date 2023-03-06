export function feToBe(input: {
  title: string
  content: string
  drawing?: string
}) {

  return {
    Title: {
      title: [
        {
          text: {
            content: input.title
          }
        }
      ]
    },
    Content: {
      rich_text: [
        {
          text: {
            content: input.content
          }
        }
      ]
    }
  }
}
