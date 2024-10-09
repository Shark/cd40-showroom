import { CDK8sManifests, EnvVar, KubeDeployment, Metadata } from "@shark/cd40-sdk"
import { Construct } from "constructs"
import { Spec } from "./stack"

// ###################################################
// StackV2 generates resources dynamically from the
// App Custom Resource spec
// ###################################################
export class StackV2 extends CDK8sManifests<Spec> {
  readonly replicas: number
  readonly env: EnvVar[]

  constructor(scope: Construct, id: string, metadata: Metadata, spec: Spec) {
    super(scope, id, metadata, spec)

    this.replicas = spec.services?.web?.replicas ?? 1
    this.env = Object.entries(spec.services?.web?.env ?? {}).map(([name, value]) => ({ name, value }))

    new KubeDeployment(this, "deployment", {
      metadata: {
        name: 'acme-app-web',
        namespace: metadata.namespace,
      },
      spec: {
        selector: {
          matchLabels: {
            'app.kubernetes.io/name': 'acme-app',
          }
        },
        replicas: this.replicas,
        template: {
          metadata: {
            labels: {
              'app.kubernetes.io/name': 'acme-app',
            },
          },
          spec: {
            containers: [{
              name: 'web',
              image: spec.image,
              env: this.env,
            }]
          }
        }
      }
    })
  }
}
