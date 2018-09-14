import { prod } from '../utils/runtime-vars';
import { logger } from '../utils/utils';

import * as admin from "firebase-admin";


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
  const child = versionFolder(await getCurrentInfo())

  return (await wikiData.child(child).once('value')).val();
}

export const updateDB = async (newData) => {
  if(!prod) return;

  const currentInfo = await getCurrentWiki();
  if(newData.current.wikiVersion == currentInfo.wikiVersion) {
    throw new Error(`-- DB - tried to set same wiki version: ${currentInfo.wikiVersion}`);
  }

  const newVersion = await wikiData.child(versionFolder(newData.current));

  await newVersion.set({ ...newData });
  await wikiCurrent.set({ ...newData.current });
}


const versionFolder = ({ wikiVersion, wikiVersionDate }) => `v_${wikiVersion}_${wikiVersionDate}`;