import { Express } from 'express'

export const startServer = (app: Express, port: number) => {
	app.listen(port, () => {
		console.log(`🚀 Server running on http://localhost:${port}`)
	})
}
