// production environment
export const prod = process.env.NODE_ENV === 'production'

// development environment
export const dev = process.env.NODE_ENV === 'development'

// skips aggregation of specified data (eg: SKIP=heroes,items,tips,patch_notes npm start)
export const skip = process.env.SKIP