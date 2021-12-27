<template>
  <div>
    <b-form @submit="onSubmit" @delete="onDelete">
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

      <b-form-group id="input-group-4" label="비밀번호" label-for="input-password">
        <b-form-input
          id="input-password"
          v-model="boardData.password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="내용" label-for="input-content">
        <b-form-textarea
          id="input-content"
          v-model="boardData.content"
          type="text"
          rows="12"
          placeholder="내용을 입력해주세요~!"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-group-6" label="파일" label-for="input-content">
        <b-form-file v-model="file" ref="file-input" class="mt-3" plain></b-form-file>
        <div class="mt-3">선택된 파일 : <b>{{file ? file.name : ''}}</b></div>
      </b-form-group>
      <b-button @click="clearFiles" class="mr-2">파일 지우기</b-button>

      <b-button type="submit" variant="primary">수정</b-button>
      <b-button type="delete" variant="danger">삭제</b-button>
      <b-button href="/">취소</b-button>
    </b-form>
  </div>
</template>

<script>

export default {
    name: 'BoardUpdate',
    data () {
        return {
            boardId: this.$route.params.id,
            url: '',
            boardData: {
                author: '',
                password: '',
                content: '',
                title: ''
            },
            file: null,
        }
    },
    created() {        
        this.url = `http://localhost:8080/api/v1/posts/${this.boardId}`
        this.$axios.get(this.url, {
        }).then( res => {
            console.log('update res', res)
            this.boardData.id = res.data.id
            this.boardData.title = res.data.title
            this.boardData.author = res.data.author
            this.boardData.content = res.data.content
        }).catch( function() {
            console.log('게시판 업데이트 페이지에 쓸 정보 불러오기 실패')
        })
    },
    methods: {
        onSubmit (event) {
          event.preventDefault()
          //1.  form 정보를 API로 보낸다.
          
          let dataToJson = JSON.stringify(this.boardData)
          let blob = new Blob([dataToJson], {
            type: 'application/json'
          })
          let formData = new FormData()
          formData.append('data', blob)
          formData.append('file', this.file)

          this.$axios.put(`http://localhost:8080/api/v1/posts/${this.boardId}`, formData, {
          }).then( function() {
          console.log('게시판 업데이트 데이터 전송 성공')
          //2. 홈으로 redirect
          window.location.href = '/'
          }).catch( function(error) {
            console.log('게시판 업데이트 실패', error)
          })            
        },
        onDelete (event) {
          event.preventDefault()
          this.$axios.delete(`http://localhost:8080/api/v1/posts/${this.form.id}`,{                
          }).then( () => {                
          }).catch( (error) => {
              console.log('게시판 삭제 실패', error)
          })
        },
        clearFiles () {
          this.$refs['file-input'].reset()
        }
    }
}
</script>