<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-2" label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          v-model="data.title"
          placeholder="제목을 적어주세요!"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="작성자" label-for="input-author">
        <b-form-input
          id="input-author"
          v-model="data.author"
          required
        ></b-form-input>
      </b-form-group>
      
      <b-form-group id="input-group-4" label="비밀번호" label-for="input-password">
        <b-form-input
          id="input-password"
          v-model="data.password"
          required
        ></b-form-input>
      </b-form-group>
      
      <b-form-group id="input-group-5" label="내용" label-for="input-content">
        <b-form-textarea
          id="input-content"          
          v-model="data.content"          
          type="text"
          size="lg"
          placeholder="내용을 입력해주세요~!"
          rows="10"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-group-6" label="파일" label-for="input-content">
        <b-form-file v-model="file" class="mt-3" plain></b-form-file>
        <div class="mt-3">선택된 파일 : {{file ? file.name : ''}}</div>
      </b-form-group>
      
      <b-button type="submit" variant="primary">등록</b-button>
      <b-button href="/">취소</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
    name: 'BoardEnroll',
    data () {
        return {
          data: {
            title: '',
            author: '',
            password: '',
            content: ''
          },
          file: null
        }
    },
    methods: {
        onSubmit (event) {
          event.preventDefault()
          
          let dataToJson = JSON.stringify(this.data)
          console.log('before Blob :: ', dataToJson)
          let blob = new Blob([dataToJson], {
            type: 'application/json'
          })
          console.log('after Blob :: ', blob)
          let formData = new FormData()
          formData.append('data', blob)
          formData.append('file', this.file)
            this.$axios.post('http://localhost:8080/api/v1/posts', formData, {
            }).then( response => {          
              console.log('게시판 글 등록 성공', response)              
              //2. 홈으로 redirect
              window.location.href = '/'
            }).catch( function(error) {
                console.log('게시판 글 등록 실패', error)
            })     
        }
    }
}
</script>
