import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {expect, it} from 'vitest'
import Announcement from './Announcement'

it('renders the version and separates added and fixed changes', () => {
  const html = renderToStaticMarkup(createElement(Announcement, {announcement: {
    version: '20261015.v1',
    publishedOn: '2026-10-15',
    added: ['新增測試功能'],
    fixed: ['修正測試功能'],
  }}))

  expect(html).toContain('20261015.v1')
  expect(html).toContain('新增測試功能')
  expect(html).toContain('修正測試功能')
})

it('renders nothing before a release announcement is approved', () => {
  expect(renderToStaticMarkup(createElement(Announcement, {announcement: null}))).toBe('')
})
