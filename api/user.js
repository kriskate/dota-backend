import model_user from '../data/model_user'

let db = null
let users = null

export const init = (_db) => { 
  db = _db
  users = db.ref("users")
}



export const userExists = (id) => users.child(id).once('value').then(snapshot => snapshot.val() !== null)


export const createNewUser = (id=users.push().key, name='anonymous', email='not@set', steamID='noSteamIDProvided') => {
  let model = model_user(id, name, email, steamID, settings)
  
  users.child(uid).set({
    name,
    email,
    steamID,
  })
}


export const updateUserData = (id, props) => {
  let updates = {}

  Object.keys(props).map(key => {
    updates[key] = props[key]
  })

  return users.child(id).update(updates)
}

