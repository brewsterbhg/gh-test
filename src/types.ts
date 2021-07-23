export interface RequestArgs {
  labels: string[]
  requestUrl: string
  title: string
  user: string
}

export interface Label {
  color: string
  default: boolean
  description: string
  id: number
  name: string
  node_id: string
  url: string
}

export interface SlackNotification {
  text: string
  blocks: Block[]
}

interface Block {
  type: string
  text: {
    type: string
    text: string
  }
}
