const KeyToNote = MIDI.keyToNote
const CLEVS = ["treble", "bass"]
const KeyOffset = 21
const EqualTemperament = 12
  // 两个八度
const Range = 24

var keyNoteMap = []
var notesNum = 3
var clef = CLEVS[0]

Object.keys(KeyToNote)
  .forEach((noteName, pos) => {
    keyNoteMap[pos] = noteName.replace(/\d/g, '')
  })


function settings(opt) {
  if (!opt) return

  // 设置和弦组成音的数量
  if (opt.notesNum >= 3 && opt.notesNum <= 10) {
    notesNum = opt.notesNum
  }

  // 设置和弦位置
  if (CLEVS.includes(opt.clef) && opt.clef.toLowerCase()) {
    // 低音谱表 从A2 到 A4
    // 高音谱表 从C3 到 C5
    clef = opt.clef.toLowerCase()
  }

}

function generator() {

  let rootNote = (clef === CLEVS[0] ? 48 : 33)
  let chord = []
  let noteInChordNum = notesNum
  console.log(clef , CLEVS[0])
  // 生成和弦
  while (--noteInChordNum >= 0) {
    let note = rootNote + parseInt(Math.random() * Range)
    let octaveNum = 0
    let closeNote = false

    // 八度音
    chord.forEach((item, index) => {
      // 是否两个音构成一个八度
      if (Math.abs(note - item) % EqualTemperament === 0) {
        octaveNum++
      }

      // 音太近也不行
      if(!closeNote && Math.abs(note - item) <= 2) {
        closeNote = true
      }
    })

    // 八度造成无法构成基本三和弦不行
    if (notesNum - octaveNum <= 2) {
      ++noteInChordNum
      continue;
    }

    // 音太近也不行
    if(closeNote) {
      ++noteInChordNum
      continue;
    }

    chord.push(note)
  }

  // 先排个序
  chord.sort((before, after) => {
    return before > after
  })

  // 转成音名
  let notesNameArr = chord.map((value) => {
    var offset = value - KeyOffset
    return (keyNoteMap[offset] + "/" + Math.floor(value / EqualTemperament))
  })

  return {
    chord,
    clef,
    keys: notesNameArr
  }
}


export default {
  settings,
  generator
}