import {expect, it} from 'vitest'
import {formatReleaseVersion, latestAnnouncement, nextReleaseVersion} from './announcements'
import type {ReleaseAnnouncement} from './announcements'

it('formats release versions as yyyyMMdd.vN', () => {
  expect(formatReleaseVersion('2026-10-15', 1)).toBe('20261015.v1')
  expect(formatReleaseVersion('2026-10-15', 2)).toBe('20261015.v2')
})

it('uses the next release number for announcements on the same day', () => {
  const existing: ReleaseAnnouncement[] = [
    {version: '20261015.v1', publishedOn: '2026-10-15', added: [], fixed: []},
    {version: '20261014.v1', publishedOn: '2026-10-14', added: [], fixed: []},
  ]
  expect(nextReleaseVersion('2026-10-15', existing)).toBe('20261015.v2')
  expect(nextReleaseVersion('2026-10-16', existing)).toBe('20261016.v1')
})

it('rejects invalid dates and release numbers', () => {
  expect(() => formatReleaseVersion('2026-02-30', 1)).toThrow('有效日期')
  expect(() => formatReleaseVersion('2026/10/15', 1)).toThrow('YYYY-MM-DD')
  expect(() => formatReleaseVersion('2026-10-15', 0)).toThrow('大於零')
})

it('publishes the V3 announcement with today\'s first release number', () => {
  expect(latestAnnouncement?.version).toBe('20261015.v1')
  expect(latestAnnouncement?.publishedOn).toBe('2026-10-15')
  expect(latestAnnouncement?.added).toHaveLength(3)
  expect(latestAnnouncement?.fixed).toHaveLength(2)
})
