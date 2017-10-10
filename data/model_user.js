import uuid4 from 'uuid/v4'


export const model_settings = (

  autoUpdateDotaData=false,
  
  steamID='notProvided',

) => ({ autoUpdateDotaData, steamID, })


export default (

  id=uuid4(),

  name=`anonymous-${id}`,

  email='not@set',

  settings=new model_settings(),

) => ({ id, name, email, settings, })