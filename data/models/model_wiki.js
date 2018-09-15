export default ({
  current=model_current({}),
  heroes,
  items,
  patch_notes,
  tips,
}) => ({
  current,
  heroes,
  items,
  patch_notes,
  tips,
})

export const model_current = ({
  appVersion,
  dotaVersion,
  dotaVersionDate,
  wikiVersion,
  wikiVersionDate,
}) => ({
  appVersion,
  dotaVersion,
  dotaVersionDate,
  wikiVersion,
  wikiVersionDate,
})