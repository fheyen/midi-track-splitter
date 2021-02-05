const fs = require('fs');
const { Midi } = require('@tonejs/midi');
const glob = require('glob');
const path = require('path');
const { nameWithoutExtension, cleanUpForFileName, } = require('./library');

/**
 * Takes file name from last command line argument and runs splitter
 */
function main() {
    const arguments = process.argv;
    const targetDir = arguments.pop();
    const sourceDir = arguments.pop();

    console.log(`Source dir: ${sourceDir}\nTarget dir: ${targetDir}`);

    const options = {
        nodir: true,
    };
    const files = glob.sync(`${sourceDir}/**/*.mid*(i)`, options);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    for (let i = 0; i < files.length; i++) {
        try {
            const file = files[i];
            splitIntoTracks(file, sourceDir, targetDir);
            // Show progress
            const progress = Math.round(((i + 1) / files.length) * 100);
            console.log(`${i + 1} of ${files.length}, ${progress} %, ${file}`);
        } catch (error) {
            console.error(error);
        }
    }
}

/**
 * Makes sure directories exist before creating a file
 *
 * @see https://stackoverflow.com/questions/13542667/create-directory-when-writing-to-file-in-node-js
 * @param {*} filePath
 */
function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

/**
 * Reads a MIDI file and writes files for tracks
 *
 * @param {string} file file path
 */
function splitIntoTracks(file, sourceDir, targetDir) {
    // Read and parse file
    const midiData = fs.readFileSync(file);
    const midi = new Midi(midiData);
    const tracks = midi.tracks;
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];

        // Skip tracks without notes
        if (track.notes.length === 0) {
            // console.log('   No notes, will skip this track');
            continue;
        }

        // Get new path
        const trackName = cleanUpForFileName(track.name);
        const fileName = nameWithoutExtension(file);
        // Fix windows paths with \ messing up replace
        const s = sourceDir.replaceAll('\\', '/');
        const relative = fileName.replace(s, '');
        const target = path.join(targetDir, relative);
        const outputFile = `${target} track ${i} ${trackName}.mid`;

        // Skip existing files
        if (fs.existsSync(outputFile)) {
            // console.log('skipping existing file');
            continue;
        }

        // Remove all other tracks from result
        midi.tracks = [track];

        // Write file
        // console.log(`   Writing ${outputFile}`);
        ensureDirectoryExistence(outputFile);
        const outputBinary = Buffer.from(midi.toArray());
        fs.writeFileSync(outputFile, outputBinary);
    }
}

main();
