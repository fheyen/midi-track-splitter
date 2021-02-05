const fs = require('fs');
const { Midi } = require('@tonejs/midi');
const { nameWithoutExtension, cleanUpForFileName, } = require('./library');

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
    console.log(`Reading ${file}`);

    // Read and parse file
    const midiData = fs.readFileSync(file);
    const midi = new Midi(midiData);
    const tracks = midi.tracks;
    console.log(`${tracks.length} tracks`);
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        console.log(`\nTrack ${i} ${track.name}`);

        // Skip tracks without notes
        if (track.notes.length === 0) {
            console.log('No notes, will skip this track');
            continue;
        }

        // Remove all other tracks from result
        midi.tracks = [track];

        // Write file
        const outputBinary = Buffer.from(midi.toArray());
        const trackName = cleanUpForFileName(track.name);
        const fileName = nameWithoutExtension(file);
        const outputFile = `${fileName} track ${i} ${trackName}.mid`;
        console.log(`Writing ${outputFile}`);
        fs.writeFileSync(outputFile, outputBinary);
    }
}

main();
