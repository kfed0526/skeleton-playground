import type {ReleaseAnnouncement} from '../services/announcements'

type AnnouncementProps = {
  announcement: ReleaseAnnouncement | null
}

export default function Announcement({announcement}: AnnouncementProps) {
  if (!announcement) return null

  return <aside className="announcement" aria-labelledby="announcement-title">
    <div className="announcement-heading">
      <span>📣 最新公告</span>
      <time dateTime={announcement.publishedOn}>{announcement.version}</time>
    </div>
    <h2 id="announcement-title">遊樂場更新完成！</h2>
    <div className="announcement-changes">
      {announcement.added.length > 0 && <section>
        <h3>✨ 新增功能</h3>
        <ul>{announcement.added.map(item => <li key={item}>{item}</li>)}</ul>
      </section>}
      {announcement.fixed.length > 0 && <section>
        <h3>🛠️ 修正功能</h3>
        <ul>{announcement.fixed.map(item => <li key={item}>{item}</li>)}</ul>
      </section>}
    </div>
  </aside>
}
