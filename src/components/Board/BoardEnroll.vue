<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-2" label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          v-model="data.title"
          placeholder="제목을 적어주세요"
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
          id="input-password" type="password"
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
          placeholder="내용을 입력해주세요"
          rows="10"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-group-6" label="파일" label-for="input-content">
        <b-form-file v-model="files" accept="image/*" placeholder="이미지 파일만 업로드 가능합니다" multiple class="mt-3">
        </b-form-file>
      </b-form-group>
      
      <div>업로드된 파일 목록</div>
      <div v-for="(file,idx) in transFiles" :key="idx" variant="dark" class="ml-1">
        <b-badge >{{file.name}}</b-badge>
        <b-icon icon="x" style="color:red;" @click="deleteFile(file)"></b-icon>
      </div>
      <b-button type="submit" variant="primary">등록</b-button>
      <b-button @click="clickCancel">취소</b-button>
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
          files: [],
          transFiles: []
        }
    },
    watch: {
      files (newVal) {
        console.log('files newVal : ', newVal)
        console.log('files  : ',  this.files)
        for (let i = 0; i < newVal.length; i++) {
          this.transFiles.push(newVal[i]);
        }
      }
    },
    methods: {
        // 게시글 전송 함수
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
          
          //file 여러개를 보낸다.
          for (let i = 0; i < this.transFiles.length; i++) {
            formData.append('file', this.transFiles[i])
          }
          // for (let i = 0; i < this.files.length; i++) {
          //   formData.append('file', this.files[i])
          // }
            
          this.$axios.post(this.$url + '/api/v1/posts', formData, {
          }).then( response => {
            console.log('게시판 글 등록 성공', response)              
            //2. 홈으로 redirect
            this.$router.push('/')
          }).catch( function(error) {
            console.log('게시판 글 등록 실패', error)
          })
        },
        deleteFile (file) {
          this.transFiles = this.transFiles.filter(transFile => transFile.name !== file.name);
          console.log('deleteFile => ', this.transFiles)
        },
        clickCancel (event) {
          event.preventDefault();
          this.$router.push('/')
        }
    }
}
</script>
