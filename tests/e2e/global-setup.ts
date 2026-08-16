import { once } from 'node:events'
import { createServer } from 'node:http'

import next from 'next'

const E2E_HOSTNAME = 'localhost'
const E2E_PORT = 3000

export default async function globalSetup() {
  const app = next({
    dev: false,
    hostname: E2E_HOSTNAME,
    port: E2E_PORT,
  })

  await app.prepare()

  const handle = app.getRequestHandler()
  const server = createServer((request, response) => {
    void handle(request, response).catch(() => {
      if (!response.headersSent) {
        response.statusCode = 500
      }
      response.end('PersonaFlight E2E server error')
    })
  })

  server.listen(E2E_PORT, E2E_HOSTNAME)
  await once(server, 'listening')

  return async () => {
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }
          resolve()
        })
      }),
      app.close(),
    ])
  }
}
