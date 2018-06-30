import path from 'path'
import express from 'express'
import schedule from 'node-schedule'

import * as DB from './DB'
import { checkIfDataNeedsUpdate } from './wiki'
import * as userParser from './user'

import { initializeVersionSystem, currentWikiVersion, currentWikiVersionDate, currentDotaVersion, VERSIONF_BASE, VERSIONF_BASE_RAW, VERSIONF_PREFIX } from './wiki-versioning'
import { prod } from '../utils/runtime-vars'
import { logger, delay, accessLogger } from '../utils/utils'

// setup - async because we want all the engines running before we start the express server
(async () => {
  logger.info('-------        APP INIT        -------')

  /* --- INIT --- */

  // create VERSIONF_BASE folder and dump git data into it
  logger.info(`--- initializing git data folder: ${VERSIONF_BASE}`)
  await DB.initDB()


  try {
    logger.info('--- initializing versioning system - if the service restarts, get the latest data version')
    await initializeVersionSystem()
  } catch(e) {
    logger.error('an error occured while trying to start the versioning system... exiting', e)

    await delay(1000)
    process.exit(1)
  }

  /* --- end INIT --- */

  /* --- DATABASE --- */

  /* get new data and update if required */
  const updater = async () => {
    logger.info('... checking if database needs update')
    let data = null
    try{
      data = await checkIfDataNeedsUpdate()
      if(data) {
        logger.info(`... updating database; new wiki version: ${currentWikiVersion}, current wiki version date ${currentWikiVersionDate}, dota version: ${currentDotaVersion}`)
        await DB.updateDB()
        logger.info('DB updated')
      } else logger.info('DB does not need to be updated')
    } catch(e) {
      logger.error(`DB could not update with new data -- had new data: ${data !== null}`, e)
    }
  }
  

  if(prod) {
    logger.info('setting cron job for data updates - everyday at 00:00')
    try {
      const rule = new schedule.RecurrenceRule()
      rule.hour = 0
      rule.minute = 0
      const runner = schedule.scheduleJob(rule, updater)
    } catch(e) {
      logger.error('failed to set cronjob', e)
    }
  }
  
  await updater()
  
  /* --- end DATABASE --- */
  
  
  
  /* --- API server --- */
  logger.info('setting up express server')
  
  const port = 8080
  const app = new express()

  app.get('/health', (req, res) => {
    res.status(200).send({
      memory: process.memoryUsage(),      
      uptime: process.uptime(),
      version: require('../package.json').version,
    })
  })


  app.get('/currentWikiVersion', (req, res) => {
    accessLogger.info('currentWikiVersion accessed')
    
    res.status(200).send({currentWikiVersion, currentWikiVersionDate, currentDotaVersion})
  })

  /* get generated files */
  app.get('/wiki', async (req, res) => {
    const data = req.query ? req.query.data : null

    // to-do implement authorisation

    // in order to not pass this whole key to the request (url)
    // we'll only send half of it
    // let key = serviceAccount.private_key_id
    // key = key.substring(0,key.length/2)

    if(['heroes', 'items', 'tips', 'patch_notes'].includes(data)) {
      const cf = `${VERSIONF_PREFIX}${currentWikiVersion}_${currentWikiVersionDate}`

      res.sendFile(path.join(__dirname, `../${VERSIONF_BASE}/${cf}`, `${data}.json`))
    }
    
    res.send('Refine your query terms')
    
  })



  /* watch express API server */
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
  logger.info('------- service succesfully STARTED -------')
  
  /* --- end API server --- */



})()