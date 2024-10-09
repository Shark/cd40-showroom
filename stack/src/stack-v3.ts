import { CDK8sManifests, EnvVar, KubeDeployment, Metadata, Update } from "@shark/cd40-sdk"
import { Construct } from "constructs"
import lognormal from "@stdlib/stats-base-dists-lognormal"
import { Spec } from "./stack"

type RandomGen = (mu: number, sigma: number) => number
const defaultRandomGen = (mu: number, sigma: number) => Math.round(lognormal.quantile(Math.random(), mu, sigma))

// ###################################################
// StackV3 generates resources dynamically from the
// App Custom Resource spec and returns status info
// ###################################################
export class StackV3 extends CDK8sManifests<Spec> {
  readonly replicas: number
  readonly env: EnvVar[]

  private random: RandomGen

  constructor(scope: Construct, id: string, metadata: Metadata, spec: Spec, random?: RandomGen) {
    super(scope, id, metadata, spec)

    // random is a random number generator for our demo which we stub out in tests
    this.random = random ?? defaultRandomGen

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

  // ###################################################
  // status() generates the content of the status
  // subresource. In a real app we'd query health
  // checks and metrics here, but for a demo, stub
  // values are fine too.
  // ###################################################
  status(): Update | undefined {
    return {
      replace: JSON.stringify({
        health: this.replicas > 1 ? 'healthy' : 'degraded',
        webRPM: this.random(2.5526, 0.5),
        workerTPM: this.random(0.3, 4),
      })
    }
  }
}
