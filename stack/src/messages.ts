import { flash, IncomingMessage, SendResult } from "@shark/cd40-sdk"

export function handleSend(msg: IncomingMessage): SendResult {
  switch(msg.message) {
    case 'scale': {
      const replicasStr = msg.props.find(p => p.name === 'replicas')?.value
      if(!replicasStr) {
        return flash(msg.conversation, 'error', 'replicas not provided')
      }
      let replicas = ''
      try {
        replicas = JSON.parse(replicasStr)
      } catch(e) {
        return flash(msg.conversation, 'error', `invalid replicas as JSON: ${e}`)
      }
      if(typeof replicas !== 'object') {
        return flash(msg.conversation, 'error', 'replicas must be an object')
      }
      for(const key in replicas as object) {
        if(typeof replicas[key] !== 'number') {
          return flash(msg.conversation, 'error', `replicas.${key} must be a number`)
        }
      }
      return {
        messages: [{
          message: 'confirm:request',
          props: [{
            name: 'title',
            value: 'Scale Resources',
          }]
        }],
        conversation: {
          ...msg.conversation,
          state: [{
            name: 'replicas',
            value: replicasStr,
          }]
        }
      }
    }
    case 'confirm:response': {
      const replicasStr = msg.conversation.state.find(s => s.name === 'replicas')?.value
      if(!replicasStr) {
        return flash(msg.conversation, 'error', 'invalid state, replicas not found')
      }
      // try to parse replicasStr
      let replicas: { [key: string]: number } = {}
      try {
        replicas = JSON.parse(replicasStr)
      } catch(e) {
        return flash(msg.conversation, 'error', `invalid replicas as JSON: ${e}`)
      }
      let services: { [key: string]: { replicas: number } } = {}
      for (const key in replicas as object) {
        services[key] = {
          replicas: replicas[key],
        }
      }
      return {
        messages: [{
          message: 'update:request',
          props: [{
            name: 'merge',
            value: JSON.stringify({ spec: { services } }),
          }]
        }],
        conversation: {
          ...msg.conversation,
          finalized: true
        }
      }
    }
    default:
      return flash(msg.conversation, 'error', `unknown message: ${msg.message}`)
  }
}
