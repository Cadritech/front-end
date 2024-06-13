export function getTimeStampsDate(isoDateString: string): number {
  const date = new Date(isoDateString)

  return date.getTime()
}
