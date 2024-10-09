import { App } from 'cdk8s'
import { StackV1 } from '../src/stack-v1'

describe('StackV1', () => {
  test('smoke test', async () => {
    const app = new App()
    const manifests = new StackV1(app, 'manifests', {
      name: 'sample-app',
      namespace: 'default'
    }, {
      image: 'nginx',
      services: {
        web: {
          replicas: 2,
        },
      }
    })
    expect(manifests.toJson()).toMatchInlineSnapshot(`
[
  {
    "apiVersion": "v1",
    "data": {
      "hello": "world",
    },
    "kind": "ConfigMap",
    "metadata": {
      "name": "hello-world",
      "namespace": "default",
    },
  },
]
`)
  })
})
