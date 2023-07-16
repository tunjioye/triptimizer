import prettyMilliseconds, { Options } from 'pretty-ms'

export const MIN_TO_MS = 60000

export const prettyMinsDuration = (minutes: number, options?: Options) => {
  return prettyMilliseconds(minutes * MIN_TO_MS, options)
    .replaceAll('hours', 'hrs')
    .replaceAll('hour', 'hr')
    .replaceAll('minutes', 'mins')
    .replaceAll('minute', 'min')
}
