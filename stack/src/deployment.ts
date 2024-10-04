import { combineHealth, Health, HealthEvaluator, HealthEvaluatorRedundantDeployment, HealthEvaluatorSingleDeployment, KubeDeployment, ResourceLabels, Metadata, Update } from "@shark/cd40-sdk"
import { App, Chart } from "cdk8s"
import { Construct } from "constructs"
import { Service, StackProps } from "./props"

class Workload extends Construct {
  readonly replicas: number
  private readonly evaluateHealth?: HealthEvaluator

  constructor(scope: Construct, id: string, metadata: Metadata, props: StackProps, component: string, service?: Service, evaluateHealth?: HealthEvaluator) {
    super(scope, id)

    const prefix = `${metadata.name}-`

    const labels = ResourceLabels.forApp({
      appName: 'sample-app',
      environmentName: metadata.namespace,
    }).with({
      selector: {
        'app.kubernetes.io/component': component,
      },
      extra: {
        owner: 'team-yellow',
      }
    })
    this.replicas = service?.replicas ?? 1
    this.evaluateHealth = evaluateHealth

    new KubeDeployment(this, 'deployment', {
      metadata: {
        name: `${prefix}${component}`,
        namespace: metadata.namespace,
        labels: labels.default(),
      },
      spec: {
        selector: {
          matchLabels: labels.selector,
        },
        replicas: this.replicas,
        template: {
          metadata: {
            labels: labels.workloadLabels(),
          },
          spec: {
            containers: [
              {
                name: component,
                image: props.image,
                env: Object.entries(service?.env ?? {}).map(([name, value]) => ({
                  name,
                  value,
                })),
              }
            ]
          }
        }
      }
    })
  }

  health(): Health {
    if(this.evaluateHealth) {
      return this.evaluateHealth({
        replicas: this.replicas,
      })
    }
    return 'Healthy'
  }
}

export class Resources extends Chart {
  readonly web: Workload
  readonly worker: Workload

  constructor(scope: App, id: string, metadata: Metadata, props: StackProps) {
    super(scope, id)

    this.web = new Workload(this,
      'web',
      metadata,
      props,
      'web',
      props.services?.web,
      HealthEvaluatorRedundantDeployment,
    )
    this.worker = new Workload(this,
      'worker',
      metadata,
      props,
      'worker',
      props.services?.worker,
      HealthEvaluatorSingleDeployment,
    )
  }

  health(): Health {
    return combineHealth(this.web.health(), this.worker.health())
  }
}
