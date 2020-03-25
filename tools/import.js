import glob from 'glob'
import minimist from 'minimist'
import ora from 'ora'
import sha256 from 'simple-sha256'
import { join, basename } from 'path'
import {
  chmodSync,
  constants as fsConstants,
  copyFileSync,
  mkdirSync,
  readFileSync
} from 'fs'

import { rootPath } from '../src/config'
import Midi from '../src/models/midi'

const UPLOAD_PATH = join(rootPath, 'uploads')

init()

async function init () {
  const argv = minimist(process.argv.slice(2))
  const midiPath = argv._[0] // Path to MIDI folder

  if (midiPath == null) {
    throw new Error('Missing required argument: Path to MIDI folder')
  }

  const duplicates = []
  let importCount = 0

  const spinner = ora('Starting...').start()

  mkdirSync(UPLOAD_PATH, { recursive: true })

  spinner.text = `Finding MIDI files in ${midiPath}...`

  let filePaths = glob.sync('**/*.mid', { cwd: midiPath, nocase: true })
  filePaths = filePaths.map(filePath => join(midiPath, filePath))

  for (const [i, filePath] of filePaths.entries()) {
    spinner.text = `Processing file ${i} / ${filePaths.length}...`

    const fileName = basename(filePath)
    const fileData = readFileSync(filePath)
    const hash = sha256.sync(fileData)

    let midi = await Midi
      .query()
      .findOne({ hash })

    if (!midi) {
      // File does not exist yet, so add it
      midi = await Midi
        .query()
        .insert({
          name: fileName,
          hash
        })

      const outFile = join(UPLOAD_PATH, `${midi.id}.mid`)
      const flags = fsConstants.COPYFILE_EXCL // fail if dest exists
      copyFileSync(filePath, outFile, flags)
      chmodSync(outFile, 0o664)

      importCount += 1
    } else {
      // Duplicate, file already exists
      duplicates.push([midi.name, fileName])

      if (midi.name !== fileName &&
          (!midi.alternateNames || !midi.alternateNames.includes(fileName))) {
        // Alternate name is not in DB, so add it

        if (!midi.alternateNames) midi.alternateNames = []
        midi.alternateNames.push(fileName)

        await midi
          .$query()
          .update(midi)
      }
    }
  }

  spinner.succeed(`Imported ${importCount} new files.\n`)

  if (duplicates.length > 0) {
    console.log(`Skipped ${duplicates.length} duplicates:`)
    for (const duplicate of duplicates) {
      console.log(`  - ${duplicate[1]} (exists as ${duplicate[0]})`)
    }
  }

  return Midi.knex().destroy()
}
