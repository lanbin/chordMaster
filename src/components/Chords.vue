<template>
  <div class="chord">
    <h1>What the given Chord is?</h1>
    <div id="stave"
      ref="stave"></div>
    <div>{{chordNote.join(" , ")}}</div>
    <button id="next"
      @click="change">change</button>
    <button id="next"
      @click="play">play the chord</button>
    <button id="next"
      @click="arpeggio">play the chord arpeggio</button>
  </div>
</template>

<script>
import MIDI from 'midi.js'
import Vex from 'vexflow'
import ChordGenerator from '../utils/chordGenerator.js'

const VF = Vex.Flow
const DELAY = 0
const VELOCITY = 127
const CHANNEL = 0
const AUTO_CLICK_BASE = true
const LEFT_HAND_VELOCITY = VELOCITY / 5
const MIDDLE_C_NOTE = 60

export default {
  data() {
    return {
      staveContext: null,
      stave: null,
      result: {},
      clef: 'bass',
      chordNote: []
    }
  },
  mounted() {
    var self = this
    MIDI.loadPlugin({
      soundfontUrl: '/',
      instrument: 'acoustic_grand_piano', // or the instrument code 1 (aka the default)
      onsuccess() {
         self.createStave()
      }
    })
    ChordGenerator.settings({
      notesNum:3,
      clef: this.clef
    })
  },
  methods: {
    createStave() {
      if(!this.staveContext) {
        var div = this.$refs.stave
        var renderor = new VF.Renderer(div, VF.Renderer.Backends.SVG)

        renderor.resize(200, 150)
        this.staveContext = renderor.getContext()
      }

      this.staveContext.setFont('Arial', 10, '').setBackgroundFillStyle('#eed')

      this.stave = new VF.Stave(0, 0, 200)

      this.stave.addClef(this.clef)
      this.stave.setContext(this.staveContext).draw()
    },
    cleanStave(){
      this.staveContext.clear()
    },
    change() {
      this.cleanStave()
      this.createStave()

      this.result = ChordGenerator.generator()

      let keys = this.result.keys,
      chordStaveNote = new VF.StaveNote({clef: this.result.clef, keys: keys, duration: 'h' })

      this.chordNote = keys

      keys.forEach((item, index) => {
        if(item.length > 3) {
          chordStaveNote = chordStaveNote.addAccidental(index, new VF.Accidental(item[1]))
        }
      })

      let notes = [
        chordStaveNote
      ]

      // Create a voice in 4/4 and add above notes
      var voice = new VF.Voice({num_beats: 2,  beat_value: 4})
      voice.addTickables(notes)

      // Format and justify the notes to 400 pixels.
      var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400)

      // Render voice
      voice.draw(this.staveContext, this.stave)
    },
    play(){
      if(this.result) {
        MIDI.chordOn(CHANNEL, this.result.chord, VELOCITY, DELAY)
      }
    },
    arpeggio() {
      if(this.result) {
        let chord = this.result.chord
        chord.forEach((item, index) => {
          MIDI.noteOn(CHANNEL, item, VELOCITY, 0.5 * index)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#stave {
  transform: scale(2);
  transform-origin: top;
  margin-bottom: 100px;
}

#next {
  margin-top: 50px;
}
</style>
