const fs = require('fs');
const { Midi } = require('@tonejs/midi');
const _ = require('lodash');

/**
 * Takes file name from last command line argument and runs splitter
 */
function main() {
    const arguments = process.argv;
    const fileName = arguments.pop();
    if (!fileName.endsWith('.mid') && !fileName.endsWith('.midi')) {
        console.warn('No file given, call like this: node index.js some_midi_file.mid');
        process.exit(1);
    }
    splitIntoTracks(fileName);
}

/**
 * Reads a MIDI file and writes files for tracks
 *
 * @param {string} file file path
 */
function splitIntoTracks(file) {
    // const file = path.join(__dirname, '[Drums] ACDC - You shook me all night long.mid');
    console.log(`Reading ${file}`);

    // Read and parse file
    const midiData = fs.readFileSync(file);
    const midi = new Midi(midiData);
    console.log(`${midi.tracks.length} tracks`);

    for (let i = 0; i < midi.tracks.length; i++) {
        const track = midi.tracks[i];
        console.log(`\nTrack ${i} ${track.name}`);

        // Skip tracks without notes
        if (track.notes.length === 0) {
            console.log('No notes, will skip this track');
            continue;
        }

        // Remove all other tracks from result
        const clone = _.cloneDeep(midi);
        clone.tracks = clone.tracks = [track];

        // Write file
        const outputBinary = Buffer.from(clone.toArray());
        const trackName = cleanUpForFileName(track.name);
        const fileName = nameWithoutExtension(file);
        const outputFile = `${fileName} track ${i} ${trackName}.mid`;
        console.log(`Wrinting ${outputFile}`);
        fs.writeFileSync(outputFile, outputBinary);
    }
}

/**
 * Removes the file extension from a string
 * @param {string} string a string
 * @returns {string} cleaned up string
 */
function nameWithoutExtension(string) {
    const dotIndex = string.lastIndexOf('.');
    if (dotIndex === -1) {
        return string;
    }
    return string.slice(0, dotIndex);
}

// Get allowd characters for cleanUpForFileName()
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => d.toString());
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const other = [' ', '-', '.', '_', ',', '(', ')'];
const allowedCharacters = new Set([...numbers, ...letters, ...letters.map(d => d.toUpperCase()), ...other]);

/**
 * Allowed are only a-zA-z0-9, all other characters will be replaced by '_'
 * @param {string} string a string
 * @returns {string} cleaned up string
 */
function cleanUpForFileName(string) {
    if (!string || !string.length) { return ''; }
    return string.split('')
        .map(d => allowedCharacters.has(d) ? d : '_')
        .join('');
}

main();
