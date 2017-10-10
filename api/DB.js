import * as admin from "firebase-admin"

// will use the same token file for both front and back ends
import * as serviceAccount from '../..//secrets/service-account.json'
import {logger} from '../utils/utils'
import {currentWikiVersion} from './wiki-versioning'


export const updateDB = async data => {
  logger.info(`--- updating database; new version: ${currentWikiVersion}; data: ${data}`)
}


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://dota-little-helper.firebaseio.com"
// })
// const db = admin.database()

//dotaParser.init(db)