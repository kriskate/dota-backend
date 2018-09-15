import { prod } from '../utils/runtime-vars';
import { logger } from '../utils/utils';

import * as admin from "firebase-admin";


let db;
export const getDB = () => db;

let wikiCurrent;


// !! all catches should be handled at top level

export const initDB = async () => {
  const serviceAccount = require('../secrets/pocket-dota-backend-firebase-adminsdk-fr9td-c143d27641.json');
  
  await admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pocket-dota-backend.firebaseio.com"
  });
  
  
  db = await admin.database();
}


export const getCurrentInfo = async () => {
  const snapshot = await db.ref('/wiki/current').once("value");

  return snapshot.val();
}

export const getCurrentWiki = async () => {
  const child = versionFolder(await getCurrentInfo())

  return (await db.ref(`/wiki/data/${child}`).once('value')).val();
}

export const updateDB = async (newData) => {
  if(!prod) return;
  
  logger.debug(`updating db. new wikiVersion: ${newData.current.wikiVersion}.`);

  const currentInfo = await getCurrentInfo();
  if(newData.current.wikiVersion == currentInfo.wikiVersion) {
    throw new Error(`-- DB - tried to set same wiki version: ${currentInfo.wikiVersion}`);
  }
  
  const child = versionFolder(newData.current);
  const newVersion = await db.ref(`/wiki/data/${child}`);
  
  await newVersion.set({ ...newData });
  await wikiCurrent.set({ ...newData.current });

  logger.debug(`   - updated. Replaced wiki version ${currentInfo.wikiVersion}`);
}


const versionFolder = ({ wikiVersion, wikiVersionDate }) => `v_${wikiVersion}_${wikiVersionDate}`;