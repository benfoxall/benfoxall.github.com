import assert from 'node:assert'
import { readdir, readFile } from 'node:fs/promises'
import test from 'node:test'
import { join } from 'path'
import { JSDOM } from 'jsdom'

// tar -xzf archive.tar.gz
const reference = join(import.meta.dirname, '_site')
const target = join(import.meta.dirname, '../_site')

const ignore = [/404/, /README.md/, /.*\.css/, /.*\.sass/]

for await (const file of walk(reference)) {

  // // if (!file.endsWith('worker.js')) continue
  // continue;
  if (ignore.some(value => file.match(value))) continue


  test(file, async () => {

    const a = await readFile(join(reference, file))
    const b = await readFile(join(target, file))

    if (file.endsWith('.html')) {

      const domA = new JSDOM(a)
      const domB = new JSDOM(b)

      assert.equal(domA.window.document.title, domB.window.document.title, "Title matches")

      // todo, more

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