import { useStack, CDK8sStack, RenderResult, Request, IncomingMessage, SendResult, Update } from "@shark/cd40-sdk"
import lognormal from "@stdlib/stats-base-dists-lognormal"
import { Resources } from "./deployment"
import { StackProps } from "./props"
import { handleSend } from "./messages"

type RandomGen = (p: number, mu: number, sigma: number) => number
export class ACMEStack extends CDK8sStack {
  private random: RandomGen

  constructor(random?: RandomGen) {
    super()
    this.random = random ?? lognormal.quantile
  }

  render(req: Request): RenderResult {
    const { success, data, error } = StackProps.safeParse(JSON.parse(req.this.spec))
    if(!success) {
      throw new Error(`parse error: ${error}`)
    }
    new Resources(this.app, 'resources', req.this.metadata, data)
    return this.renderApp()
  }

  protected status(): Update | undefined {
    return {
      replace: JSON.stringify({
        health: 'healthy',
        webRPM: Math.round(this.random(Math.random(), 2.5526, 0.5)),
        workerTPM: Math.round(this.random(Math.random(), 0.3, 4)),
      })
    }
  }

  send(msg: IncomingMessage): SendResult {
    return handleSend(msg)
  }
}

export const stack = useStack(ACMEStack)
