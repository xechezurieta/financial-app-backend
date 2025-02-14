import path from 'path'

import { config } from 'dotenv'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { client, db } from './drizzle'

config()

async function main() {
	await migrate(db, {
		migrationsFolder: path.join(process.cwd(), '/src/db/migrations')
	})
	console.log(`Migrations complete`)
	await client.end()
}

main()
