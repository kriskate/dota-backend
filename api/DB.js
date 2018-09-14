import { prod } from '../utils/runtime-vars'
import { logger } from '../utils/utils'
import { current } from './wiki-versioning'

import * as admin from "firebase-admin"
import model_dota, { model_current } from '../data/models/model_wiki';


let wiki;
let wikiData;
let wikiCurrent;


// !! all catches should be handled at top level

export const initDB = async () => {
  const serviceAccount = require('../secrets/pocket-dota-backend-firebase-adminsdk-fr9td-c143d27641.json');
  
  await admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pocket-dota-backend.firebaseio.com"
  });
  
  
  var db = await admin.database();
  wiki = await db.ref("/wiki");
  wikiData = await db.ref('/wiki/data');
  wikiCurrent = await db.ref('/wiki/current');
}


export const getCurrentInfo = async () => {
  const snapshot = await wikiCurrent.once("value");

  return snapshot.val();
}

export const getCurrentWiki = async () => {
  const snapshot = await wikiData.orderByChild('info')
    .equalTo(await getCurrentInfo()).once('value');

  return await snapshot.val();
}

export const updateDB = async (wikiData) => {
  if(!prod) return;

  const data = model_dota({ wikiData });
  
  await wiki.push(data);
  await current.set({ ...data.current });
}
