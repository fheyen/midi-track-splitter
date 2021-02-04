# midi-track-splitter

Splits a MIDI file into single files for each track while keeping tempo and other signature events

## Setup & Usage

```bash

git clone https://github.com/fheyen/midi-track-splitter

cd midi-track-splitter
npm install

# Only one file at a time supported
node index.js some_midi_file.mid
```

## Dependencies

Uses [Tonejs/Midi](https://github.com/Tonejs/Midi) for parsing and [lodash](https://lodash.com/) for cloning.

## TODO:

- Host as website
