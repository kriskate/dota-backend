import express from 'express'
import schedule from 'node-schedule'

import * as DB from './DB'
import * as wiki from './wiki'
import * as userParser from './user'

import {initializeVersionSystem, currentWikiVersion, currentWikiVersionDataFolder, currentWikiVersionDate} from './wiki-versioning'

import {logger, delay, accessLogger} from '../utils/utils'




// setup - async because we want all the engines running before we start the express server
(async () => {


  /* --- INIT --- */

  try {
    logger.info('------- initializing versioning system - if the service restarts, get the latest data version')
    await initializeVersionSystem()
  } catch(e) {
    logger.error('an error occured while trying to start the versioning system... exiting', e)

    await delay(1000)
    process.exit(1)
  }

  /* --- end INIT --- */



  /* --- DATABASE --- */

  /* updates db if new data */
  const updater = async () => {
    let data = null
    try{
      data = await wiki.gatherData()
      if(data) {
        await DB.updateDB(data)
        logger.info('DB updated')
      } else logger.info('DB does not need to be updated')
    } catch(e) {
      logger.error(`DB could not update with new data -- had new data: ${data !== null}`, e)
    }
  }
  
  logger.info('setting cron job for data updates - everyday at 00:00')
  const rule = new schedule.RecurrenceRule()
  rule.hour = 0
  rule.minute = 0
  const runner = schedule.scheduleJob(rule, updater)
  await updater()

  /* --- end DATABASE --- */



  /* --- API server --- */
  const port = 8080
  const app = new express()

  app.get('/test1234', (req, res) => res.send(200))
  app.get('/currentWikiVersion', (req, res) => {
    accessLogger.info('currentWikiVersion accessed')
    
    res.send({currentWikiVersion, currentWikiVersionDataFolder, currentWikiVersionDate})
  })

  app.get('/wiki', (req, res) => {
    // in order to not pass this whole key to the request (url)
    // we'll only send half of it
    let key = serviceAccount.private_key_id
    key = key.substring(0,key.length/2)
    console.log(key, req.query.key)

    if(req.query.key == key)
      res.send(wiki.currentData)
    else
      res.send('not authorised')
  })

  /* watch express API server */
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
  logger.info('------- service succesfully started')
  
  /* --- end API server --- */



})()