import type { Express, Request, Response } from 'express'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { Client, isFullPage } from '@notionhq/client'
import { createValidator } from 'express-joi-validation'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import joi from 'joi'

import { guard } from './util'
import { transform } from './library'

dotenv.config();

const app: Express = express()
const port = process.env.PORT

const notion = new Client({ auth: process.env.NOTION_KEY })

const validator = createValidator()

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

app.get('/jots', async (req: Request, res: Response, next) => {

  try {
    const ret = await notion.databases.query({
      database_id: DATABASE_ID
    })

    const transformed = ret.results
      .filter((result): result is PageObjectResponse => isFullPage(result))
      .map((result) => transform.beToFe(result))

    res.json({
      ok: true,
      results: transformed
    })
  } catch (e) {
    res.json({
      ok: false
    })

    next(e)
  }
})

app.post(
  '/jot',
  validator.body(
    joi.object({
      title: joi.string().required(),
      content: joi.string().required()
    })
  ),
  async (
    { body }: Request,
    res: Response,
    next
  ) => {

    try {

      const response = await notion.pages.create({
        parent: {
          database_id: DATABASE_ID
        },
        properties: transform.feToBe(body)
      })

      if (!isFullPage(response)) {

        throw 'Unknown error occurred'
      }

      res.json({
        ok: true,
        result: transform.beToFe(response)
      })
    } catch (e) {
      console.error(e)

      res.json({
        ok: false
      })

      next(e)
    }
  }
)

app.delete(
  '/jot',
  validator.body(
    joi.object({
      id: joi.string().required()
    })
  ),
  async (
    { body }: Request,
    res: Response,
    next
  ) => {

    try {
      await notion.blocks.delete({
        block_id: body.id
      })

      res.json({
        ok: true
      })
    } catch (e) {
      res.json({
        ok: false
      })

      next(e)
    }
  }
)
