<template>
  <div class="chord">
    <img src="../assets/ChordMaster.png">
    <h1>Chord Master</h1>
    <button id="go" @click="go">Get In</button>
  </div>
</template>

<script>
export default {
  methods:{
    go() {
      this.$router.push('Chords')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#go{
  padding: 5px 10px;
  font-size: 20px;
  border-radius: 5px;
}
</style>
