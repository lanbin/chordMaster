<template>
  <div class="chord">
    <div id="stave"
      ref="stave"></div>
    <button id="next"
      @click="change">change</button>
  </div>
</template>

<script>
import MIDI from 'midi.js'
import Vex from 'vexflow'

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
      stave: null
    }
  },
  mounted() {
    MIDI.loadPlugin({
      soundfontUrl: '/',
      instrument: 'acoustic_grand_piano', // or the instrument code 1 (aka the default)
      onsuccess() {
        var delay = 0; // play one note every quarter second
      var note = 50; // the MIDI note
      var velocity = 127; // how hard the note hits
      // play the note
      MIDI.setVolume(0, 127);
      MIDI.noteOn(0, note, velocity, delay);
      }
    })
    this.createStave()
  },
  methods: {
    createStave() {
      if(!this.staveContext) {
        var div = this.$refs.stave
        var renderor = new VF.Renderer(div, VF.Renderer.Backends.SVG)

        renderor.resize(200, 100)
        this.staveContext = renderor.getContext()
      }

      this.staveContext.setFont('Arial', 10, '').setBackgroundFillStyle('#eed')

      this.stave = new VF.Stave(0, 0, 200)

      this.stave.addClef('treble')
      this.stave.setContext(this.staveContext).draw()
    },
    cleanStave(){
      this.staveContext.clear()
    },
    change() {
      this.cleanStave()
      this.createStave()

      var notes = [
        // A C-Major chord.
        new VF.StaveNote({clef: 'treble', keys: [['c', 'd', 'e'][parseInt(Math.random() * 10) % 3] + '/4', ['f', 'g', 'a'][parseInt(Math.random() * 10) % 3] + '/4', 'g/4'], duration: 'h' })
      ]

      // Create a voice in 4/4 and add above notes
      var voice = new VF.Voice({num_beats: 2,  beat_value: 4})
      voice.addTickables(notes)

      // Format and justify the notes to 400 pixels.
      var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 100)

      // Render voice
      voice.draw(this.staveContext, this.stave)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#stave {
  transform: scale(2)
}

#next {
  margin-top: 50px;
}
</style>
