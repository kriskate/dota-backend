import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'

import * as DB from './DB'
import { checkIfDataNeedsUpdate } from './wiki'

import { initializeVersionSystem, current, VERSIONF_BASE, getVersionFolder } from './wiki-versioning'
import { prod, justEndpoints } from '../utils/runtime-vars'
import { logger, delay } from '../utils/utils'

// setup - async because we want all the engines running before we start the express server
(async () => {
  logger.info('-------        APP INIT        -------')

  /* --- INIT --- */
  if(!justEndpoints) {
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
    logger.info('# checking if database needs update')
    let data = null
    try{
      data = await checkIfDataNeedsUpdate()
      if(data) {
        logger.info(`# updating database; new wiki version: ${current().wikiVersion}, current wiki version date ${current().wikiVersionDate}, dota version: ${current().dotaVersion}`)
        await DB.updateDB()
        logger.info('DB updated')
      } else logger.info('# DB does not need to be updated')
    } catch(e) {
      logger.error(`# DB could not update with new data -- had new data: ${data !== null}`, e)
    }
  }
  

  if(prod) {
    logger.info('setting cron job for data updates - every 4 hours')
    try {
      const runner = schedule.scheduleJob('0 */4 * * *', updater)
    } catch(e) {
      logger.error('failed to set cronjob', e)
    }
  }
  
  await updater()
  
  /* --- end DATABASE --- */
  }
  
  
  /* --- API server --- */
  logger.info('setting up express server')
  
  const port = 8080
  const app = new express()

  app.use('/versioned_data', express.static(path.join(__dirname, '..', 'versioned_data')));

  app.get('/health', (req, res) => {
    res.status(200).send({
      memory: process.memoryUsage(),      
      uptime: process.uptime(),
      version: require('../package.json').version,
    })
  })


  app.get('/currentWikiVersion', (req, res) => {    
    res.status(200).send(current());
  })

  /* get generated files */
  app.get('/wiki', async (req, res) => {
    const data = req.query ? req.query.data : null
    const language = req.query ? req.query.language : 'english'

    // to-do implement authorisation

    // const { app_key } = require(../..//secrets/app.json')

    if(['heroes', 'items', 'tips', 'patch_notes', 'info'].includes(data)) {
      const cf = getVersionFolder();

      res.sendFile(path.join(__dirname, '..', cf, `${language}/${data}.json`))
    } else res.send('Refine your query terms')
    
  })


  /* watch express API server */
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
  logger.info('------- service succesfully STARTED -------')
  
  /* --- end API server --- */



})()