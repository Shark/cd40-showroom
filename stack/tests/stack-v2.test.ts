import { App } from 'cdk8s'
import { StackV2 } from '../src/stack-v2'

describe('StackV2', () => {
  test('smoke test', async () => {
    const app = new App()
    const manifests = new StackV2(app, 'manifests', {
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
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "metadata": {
      "name": "acme-app-web",
      "namespace": "default",
    },
    "spec": {
      "replicas": 2,
      "selector": {
        "matchLabels": {
          "app.kubernetes.io/name": "acme-app",
        },
      },
      "template": {
        "metadata": {
          "labels": {
            "app.kubernetes.io/name": "acme-app",
          },
        },
        "spec": {
          "containers": [
            {
              "env": [],
              "image": "nginx",
              "name": "web",
            },
          ],
        },
      },
    },
  },
]
`)
  })
})
