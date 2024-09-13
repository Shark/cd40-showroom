import { z } from 'zod'

export const Service = z.object({
  replicas: z.number().optional(),
  env: z.record(z.string()).optional(),
})

export type Service = z.infer<typeof Service>

export const StackProps = z.object({
  image: z.string(),
  services: z.record(Service).optional(),
})

export type StackProps = z.infer<typeof StackProps>
