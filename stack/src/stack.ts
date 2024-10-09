
import { useCDK8sStack } from "@shark/cd40-sdk"
import { z } from "zod"
import { StackV1 } from "./stack-v1"
import { StackV2 } from "./stack-v2"
import { StackV3 } from "./stack-v3"

// ###################################################
// Spec defines the schema for the acmecorp.com/v1 App
// Custom Resource spec
// ###################################################
export const spec = z.object({
  image: z.string(),
  services: z.record(z.object({
    replicas: z.number().optional(),
    env: z.record(z.string()).optional(),
  })).optional(),
})

export type Spec = z.infer<typeof spec>

export const stack = useCDK8sStack(spec, StackV1)
// export const stack = useCDK8sStack(spec, StackV2)
// export const stack = useCDK8sStack(spec, StackV3)
