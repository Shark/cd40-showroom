import { ACMEStack } from '../src/stack'

describe('render', () => {
  test('smoke test', async () => {
    const randomGen = () => 1; // no randomness here
    const stack = new ACMEStack(randomGen);
    const actual = stack.render({
      this: {
        metadata: {
          name: 'sample-app',
          namespace: 'default'
        },
        spec: '{"image":"nginx"}',
      },
    });
    expect(actual).toMatchInlineSnapshot(`
{
  "manifests": [
    {
      "content": "apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/component: web
    app.kubernetes.io/instance: default
    app.kubernetes.io/managed-by: argo-cd
    app.kubernetes.io/name: sample-app
    owner: team-yellow
  name: sample-app-web
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/component: web
      app.kubernetes.io/instance: default
      app.kubernetes.io/name: sample-app
  template:
    metadata:
      labels:
        app.kubernetes.io/component: web
        app.kubernetes.io/instance: default
        app.kubernetes.io/managed-by: argo-cd
        app.kubernetes.io/name: sample-app
        owner: team-yellow
    spec:
      containers:
        - env: []
          image: nginx
          name: web
",
      "fileName": "manifest-0.yaml",
    },
    {
      "content": "apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/component: worker
    app.kubernetes.io/instance: default
    app.kubernetes.io/managed-by: argo-cd
    app.kubernetes.io/name: sample-app
    owner: team-yellow
  name: sample-app-worker
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/component: worker
      app.kubernetes.io/instance: default
      app.kubernetes.io/name: sample-app
  template:
    metadata:
      labels:
        app.kubernetes.io/component: worker
        app.kubernetes.io/instance: default
        app.kubernetes.io/managed-by: argo-cd
        app.kubernetes.io/name: sample-app
        owner: team-yellow
    spec:
      containers:
        - env: []
          image: nginx
          name: worker
",
      "fileName": "manifest-1.yaml",
    },
  ],
  "status": {
    "replace": "{"health":"healthy","webRPM":1,"workerTPM":1}",
  },
}
`)
  })
})
