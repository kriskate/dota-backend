import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'

import * as DB from './DB'
import { checkIfDataNeedsUpdate } from './wiki'

import { initializeVersionSystem, getLocalWiki } from './wiki-versioning'
import { prod, justEndpoints } from '../utils/runtime-vars'
import { logger, delay } from '../utils/utils'
import { initializeSubscribers, subscribe, subscribeTexts, unsubscribe } from './subscribe';


// setup - async because we want all the engines running before we start the express server
(async () => {

  logger.info('-------        APP INIT        -------')

  /* --- INIT --- */
  if(!justEndpoints) {
  // create VERSIONF_BASE folder and dump git data into it
  logger.info(`--- initializing DATABASE`)
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
      data = await checkIfDataNeedsUpdate();
      if(data) {
        const { wikiVersion, wikiVersionDate, dotaVersion } = data.current;
        logger.info(`... updating database; new wiki version: ${wikiVersion}, wiki version date ${wikiVersionDate}, dota version: ${dotaVersion}`)
        await DB.updateDB(data)
        logger.info('... re-initializing versioning system')
        await initializeVersionSystem(data)
        logger.info('DB updated')
      } else logger.info('DB does not need to be updated')
    } catch(e) {
      logger.error(`DB could not update with new data -- had new data: ${data !== null}`, e)
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

  app.get('/health', (req, res) => {
    res.status(200).send({
      memory: process.memoryUsage(),      
      uptime: process.uptime(),
      version: require('../package.json').version,
    })
  })


  app.get('/current', (req, res) => {    
    res.status(200).send(getLocalWiki().current);
  })

  /* get generated files */
  app.get('/wiki', async (req, res) => {
    const data = req.query ? req.query.data : null

    // to-do implement authorisation

    // const { app_key } = require(../..//secrets/app.json')

    if(['heroes', 'items', 'tips', 'patch_notes'].includes(data)) {
      const r = JSON.parse(getLocalWiki()[data])
      res.status(200).send(r);
    } else res.status(404).send('Refine your query terms');
    
  })


  /* WEBSITE */
  app.use(express.static(path.join(__dirname, '../website')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../website', 'index.html'));
  })

  /* SUBSCRIBERS */
  logger.info('setting up subscribers');
  await initializeSubscribers();

  if(!prod) {
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");

      next();
    })
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin');

    next();
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/subscribe', async (req, res) => {
    const { name, email } = req.body;

    const message = await subscribe(name, email);

    if(message === subscribeTexts.subscribed(email)) {
      res.status(200).send({ status: 'OK', message });
    } else if (message === subscribeTexts.already_subscribed(email)) {
      res.status(200).send({ status: 'OK', message });
    } else {
      res.status(500).send({ status: 'NOTOK', message });
    }
  })

  app.get('/unsubscribe', async (req, res) => {
    const email = req.query.email;

    const message = await unsubscribe(email);
    
    res.status(200).send({ message });
  })


  /* watch express API server */
  app.listen(port, () => {
    console.log('Listening on port ' + port)
  })
  logger.info('------- service succesfully STARTED -------')
  
  /* --- end API server --- */



})()