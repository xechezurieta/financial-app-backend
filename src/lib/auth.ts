import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/drizzle' // your drizzle instance

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true
	},
	database: drizzleAdapter(db, {
		provider: 'pg' // or "mysql", "sqlite"
	})
})
