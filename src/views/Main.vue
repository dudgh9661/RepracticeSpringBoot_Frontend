<template>
  <div>
    <h2>vue + spring 게시판 프로젝트</h2>
    <BoardList/>
  </div>
</template>
  
<script>
  import BoardList from '../components/Board/BoardList.vue'

  export default {
    components: {
      BoardList
    }
  }
</script>
