import express, { Express } from 'express'
import { Client } from '@notionhq/client'
import cors from 'cors'
import dotenv from 'dotenv'

import { guard } from './util'

dotenv.config();

const app: Express = express()
const port = process.env.PORT

const notion = new Client({ auth: process.env.NOTION_KEY })

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

const DATABASE_ID = (() => {
  const id = process.env.NOTION_DATABASE_ID

  if (!id) {

    console.error('DATABASE_ID is missing from .env')

    process.exit(1)
  }

  return id
})();

// Synchronising Database with expected structure for client implementation
(async() => {

  const database = await notion.databases.retrieve({
    database_id: DATABASE_ID
  })

  const property = {
    Title: {
      title: {},
      name: 'Title'
    },
    Content: {
      rich_text: {},
      name: 'Content'
    },
  }

  // Ensure the current database properties match the expected Schema
  const match = Object.entries(database.properties).reduce((result: boolean, [currKey, currProperty]) => {

    return !result ? result : guard.isKeyOf(property, currKey) && property[currKey].name === currProperty.name && currProperty.type in property[currKey]
  }, true)

  // Synchronise the Database before launching the server
  if (!match) {
    const remove = Object.entries(database.properties)
    .filter(([currKey, currProperty]) => !(currKey in property) && currProperty.type !== 'title')
    .reduce((result: Record<string, null>, [currKey]) => ({
      ...result,
      [currKey]: null
    }), {})

    const [titleKey] = Object.entries(database.properties)
      .find(([_, currProperty]) => currProperty.type === 'title') || []

    const sync = Object.entries(property)
      .filter(([_, currProperty]) => !('title' in currProperty))
      .reduce((result: Record<string, typeof property[keyof typeof property] | null>, [currKey, currProperty]) => {

      return {
        ...result,
        [currKey]: currProperty
      }
    }, {
      ...(titleKey && {
        [titleKey]: property.Title
      }),
      ...remove
    })

    await notion.databases.update({
      database_id: DATABASE_ID,
      properties: sync
    })
  }

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
})()