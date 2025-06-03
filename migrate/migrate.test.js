import assert from 'node:assert'
import { readdir, readFile } from 'node:fs/promises'
import test from 'node:test'
import { join } from 'path'
import { JSDOM } from 'jsdom'

// tar -xzf archive.tar.gz
const reference = join(import.meta.dirname, '_site')
const target = join(import.meta.dirname, '../_site')

const ignored = [/404/, /README.md/, /.*\.css/, /.*\.sass/, /full\/index\.html/]

for await (const file of walk(reference)) {

  if (ignored.some(value => file.match(value))) continue

  test(file, async () => {

    const a = await readFile(join(reference, file))
    const b = await readFile(join(target, file))

    if (file.endsWith('atom.xml')) {
      const docA = new JSDOM(a, { contentType: 'text/xml' })
      const docB = new JSDOM(b, { contentType: 'text/xml' })

      const entriesA = Array.from(
        docA.window.document.getElementsByTagName('entry'),
        el => el.getElementsByTagName('title')[0].textContent
      )

      const entriesB = Array.from(
        docB.window.document.getElementsByTagName('entry'),
        el => el.getElementsByTagName('title')[0].textContent
      )

      for (const entry of entriesA) {
        assert.ok(entriesB.includes(entry), `Includes ${entry}`)
      }


    } else if (file.endsWith('.html')) {
      const domA = new JSDOM(a)
      const domB = new JSDOM(b)

      assert.equal(domA.window.document.title, domB.window.document.title, "Title matches")

      // Basic structure tests
      const docA = domA.window.document
      const docB = domB.window.document

      // If it's a blog post, verify time element
      const timeA = docA.querySelector('time')
      const timeB = docB.querySelector('time')
      if (timeA) {
        assert.ok(timeB, "Time element exists")
        const dateA = new Date(timeA.getAttribute('datetime'))
        const dateB = new Date(timeB.getAttribute('datetime'))
        assert.equal(dateA.getTime(), dateB.getTime(), "DateTime matches")
      }

      // Check lead paragraph if exists
      const leadA = docA.querySelector('.lead')
      const leadB = docB.querySelector('.lead')
      if (leadA) {
        assert.ok(leadB, "Lead paragraph exists")

        const normalizeText = text => text
          .replace(/[^a-zA-Z\s]/g, '')  // only keep letters and whitespace (unicode formatting)
          .replace(/\s+/g, ' ')         // normalize whitespace
          .trim()
          .toLowerCase()

        const textA = normalizeText(leadA.textContent)
        const textB = normalizeText(leadB.textContent)

        assert.equal(textA, textB, "Lead content matches (normalized)")
      }

    } else {
      assert.ok(a.equals(b), "content matches")
    }
  })

}


async function* walk(base, dir = '') {
  for (const entry of await readdir(join(base, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      yield* walk(base, path)

    else if (entry.isFile())
      yield path

  }
}