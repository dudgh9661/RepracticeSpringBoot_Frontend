<template>
    <div>
      <b-form>
      <b-form-group id="input-group-1" label="게시물 번호" label-for="input-id">
        <b-form-input
          id="input-1d"
          v-model="boardData.id"
          required
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          v-model="boardData.title"
          placeholder="제목을 적어주세요!"
          required
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="작성자" label-for="input-author">
        <b-form-input
          id="input-author"
          v-model="boardData.author"
          required
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="내용" label-for="input-content">
        <b-form-textarea
          id="input-content"
          v-model="boardData.content"
          type="text"
          rows="12"          
          required
          disabled
        ></b-form-textarea>
      </b-form-group>
      <div v-if="files.length > 0" class="mt-3"> 업로드된 파일
        <div v-for="(file, idx) in files" :key="idx">
          <b>{{file.originFileName}}</b>
          <span :class="isHovered[idx] ? 'text-primary' : ''" @mouseover="handleHover(idx,true)" @mouseleave="handleHover(idx,false)" @click="download(file)">
           다운로드
          </span>
        </div>
      </div>
      <Comments :postId="this.boardId"></Comments>
      <b-button href="/">홈으로</b-button>
    </b-form>
    </div>
</template>

<script>

import Comments from './Comments.vue'
export default {
  components: { Comments },

  data () {
      return {
        boardId: this.$route.params.id,
        boardData: {},
        files: [],
        isHovered: []
      }
  },
  created () {
        this.id = this.$route.params.id
        this.$axios.get(`http://localhost:8080/api/v1/posts/${this.boardId}`, {                      
        }).then( res => {
            this.boardData = res.data
            this.files = this.boardData.files
            for (let i = 0; i < this.files.length; i++) {
              this.$set(this.isHovered, i, false)
            }
            console.log(this.$data)
        }).catch( error => {
            console.log('게시물을 불러오지 못했습니다.', error)
        })
    },
    methods: {
      download (file) {
        this.$axios.get(`http://localhost:8080/api/v1/posts/download/${file.id}`, {
          responseType: 'blob'
        }).then( res => {
          let blob = new Blob([res.data], {type: res.headers['content-type']})
          console.log('파일 데이터 받아오기 성공 ::: ', blob)
          let fileName = file.originFileName
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.target = '_self'
          if (fileName) link.download = fileName
          link.click()
          link.remove()
        }).catch(  error =>  {
          console.log('파일 다운로드 실패 ::: ', error)
          alert('파일 다운로드에 실패했습니다. 다시 시도해주세요.')
        })
      },
      handleHover(idx, active) {
        this.$set(this.isHovered, idx, active)
      }
    }
}
</script>
