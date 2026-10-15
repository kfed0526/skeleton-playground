export type ReleaseAnnouncement = {
  version: string
  publishedOn: string
  added: readonly string[]
  fixed: readonly string[]
}

export function formatReleaseVersion(publishedOn: string, releaseNumber: number) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(publishedOn)
  if (!match) throw new Error('公告日期必須使用 YYYY-MM-DD 格式')

  const [, year, month, day] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  const isValidDate = date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() === Number(month) - 1
    && date.getUTCDate() === Number(day)
  if (!isValidDate) throw new Error('公告日期不是有效日期')
  if (!Number.isInteger(releaseNumber) || releaseNumber < 1) {
    throw new Error('當天發行次數必須是大於零的整數')
  }

  return `${year}${month}${day}.v${releaseNumber}`
}

export function nextReleaseVersion(
  publishedOn: string,
  existing: readonly ReleaseAnnouncement[] = announcements,
) {
  const releaseNumber = existing.filter(item => item.publishedOn === publishedOn).length + 1
  return formatReleaseVersion(publishedOn, releaseNumber)
}

// 收到正式公告內容後，將最新公告加在陣列最前面；不要放入 xxx 等佔位文字。
export const announcements: readonly ReleaseAnnouncement[] = []

export const latestAnnouncement = announcements[0] ?? null
