import { stack } from "../dist/stack-js/stack.js";

const result = stack.render({
  this: {
    metadata: {
      name: 'sample-app',
      namespace: 'default'
    },
    spec: JSON.stringify({
      image: 'stefanprodan/podinfo',
      services: {
        web: {
          replicas: 2
        },
        worker: {
          replicas: 1,
          env: {
            LOG_LEVEL: 'trace'
          }
        }
      }
    })
  }
})
console.log(result)

const response = stack.send({
  message: 'say-hello',
  conversation: {
    finalized: false,
    interactive: true,
    state: [],
  },
  props: [],
})
console.log(response)
