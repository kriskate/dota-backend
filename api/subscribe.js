import * as admin from "firebase-admin"

let subscribers;
export const initializeSubscribers = async () => {
  const serviceAccount = require('../secrets/pocket-dota-backend-firebase-adminsdk-fr9td-c143d27641.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pocket-dota-backend.firebaseio.com"
  });
  
  
  var db = admin.database();
  subscribers = db.ref("/subscribers");
}

export const subscribeTexts = {
  subscribed: (email) => `Succesfully subscribed ${email}.`,
  already_subscribed: (email) => `${email} already subscribed.`,
  unsubscribed: (email) => `Succesfully unsubscribed ${email}.`,
  not_subscribed: (email) => `${email} not subscribed.`,

  could_not_subscribe: (e) => `Could not subscribe at this time. please try again later \r\n ${e}`,
  could_not_unsubscribe: (e) => `Could not unsubscribe at this time. please try again later \r\n ${e}`,
}

export const subscribe = async (name, email) => {
  try {
    const snapshot = await subscribers.orderByChild("email").equalTo(email).once("value");

    if(snapshot.val()) {
      return subscribeTexts.already_subscribed(email);
    } else {
      await subscribers.push({ name, email });
      return subscribeTexts.subscribed(email);
    }
  } catch(e) {
    return subscribeTexts.could_not_subscribe(e);
  }
}


export const unsubscribe = async (email) => {
try {
    const snapshot = await subscribers.orderByChild('email').equalTo(email).once('value');
    
    const val = snapshot.val();
    if(val) {
      Object.keys(val).forEach(async (key) => {
        await subscribers.child(key).remove();
      })
      return subscribeTexts.unsubscribed(email);
    } else {
      return subscribeTexts.not_subscribed(email);
    }
  } catch (e) {
    return subscribeTexts.could_not_unsubscribe(e);
  }
}


const getAllSubscribers = async () => {
  // Attach an asynchronous callback to read the data at our posts reference
  subscribers.on("value", (snapshot) => {
    console.log(snapshot.val());
  }, function (err) {
    console.log("The read failed: " + err);
  });
}