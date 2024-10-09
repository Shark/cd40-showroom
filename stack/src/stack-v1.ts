import { CDK8sManifests, KubeConfigMap, Metadata } from "@shark/cd40-sdk"
import { Construct } from "constructs"
import { Spec } from "./stack"

// ###################################################
// The Stack defines which resources are created when
// you create an instance of your custom resource.
// ###################################################
export class StackV1 extends CDK8sManifests<Spec> {
  constructor(scope: Construct, id: string, metadata: Metadata, spec: Spec) {
    super(scope, id, metadata, spec)

    // In this case, it's just a ConfigMap with some data
    // to explain the concept.
    new KubeConfigMap(this, "hello-world", {
      metadata: {
        name: 'hello-world',
        namespace: metadata.namespace,
      },
      data: {
        'hello': 'world',
      }
    })
  }
}
