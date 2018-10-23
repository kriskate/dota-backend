// production environment
export const prod = process.env.NODE_ENV === 'production'

// just api
export const justEndpoints = process.env.JUST_ENDPOINTS

// development environment
export const dev = process.env.NODE_ENV === 'development'
// development environment but forcing app to push to git
export const forcePush = !!process.env.FORCE_PUSH

// skips aggregation of specified data (eg: SKIP=heroes,items,tips,patch_notes npm start)
export const skip = process.env.SKIP

// for fetching local files
export const localAPI = process.env.TEST_API