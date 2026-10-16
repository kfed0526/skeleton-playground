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
export const announcements: readonly ReleaseAnnouncement[] = [
  {
    version: '20261016.v1',
    publishedOn: '2026-10-16',
    added: [
      '新增南瓜橫向大冒險：三個橫向關卡，可跳躍、蹲下、收集糖果並安全重試。',
      '新增骨頭人工地、怪獸節奏派對與怪獸寵物屋，支援藍圖搭建、自由演奏、寵物照顧與換裝。',
      '遊戲庫擴充為 27 款，新遊戲同步支援家長管理、手機與橫向觸控，以及離線遊玩。',
    ],
    fixed: [
      '修正節奏答錯後仍能繼續輸入的時序問題，現在會先鎖定操作再友善重播。',
      '修正新遊戲中的骨頭人造型同步，並改善冒險碰撞提示與積木拖曳驗證。',
    ],
  },
  {
    version: '20261015.v1',
    publishedOn: '2026-10-15',
    added: [
      '新增怪獸冰淇淋店、骨頭人洗車場、南瓜小火車與怪獸小超市。',
      '南瓜拼圖王新增六張主題圖片，以及 2×2、3×3、4×4、6×6、9×9 五種難度。',
      '遊戲庫擴充為 23 款，新增內容同步支援家長管理與離線遊玩。',
    ],
    fixed: [
      '改善拼圖拖曳後的連續操作、洗車觸控與鍵盤操作。',
      '修正火車切換模式與超市結帳時的計時流程，避免舊狀態影響新遊戲。',
    ],
  },
]

export const latestAnnouncement = announcements[0] ?? null
