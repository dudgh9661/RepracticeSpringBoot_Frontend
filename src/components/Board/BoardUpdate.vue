<template>
  <div>
    <b-form @submit="onSubmit">
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
          id="input-password" type="password"
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
        <b-form-file v-model="newFile" ref="file-input" multiple placeholder="파일을 올려주세요~" class="mt-3">
          <template v-slot:file-name="{names}">
            <b-badge v-for="(name,idx) in names" :key="idx" variant="dark" class="ml-1">{{name}}</b-badge>
          </template>
        </b-form-file>
      <!-- <div v-if="newFile !== null" class="mt-3">업로드된 파일</div>
        <div v-for="(file,idx) in newFile" :key="idx">
          <b>{{newFile ? newFile. : ''}}</b>
        </div>
      <div v-if="newFile === null" class="mt-3">업로드된 파일  <b>{{oldFile ? oldFile.originFileName : ''}}</b></div> -->
      </b-form-group>
      <div v-if="oldFile.length > 0" class="mt-3"> 업로드된 파일
        <span v-if="newFile.length === 0">
          <div v-for="(file, idx) in oldFile" :key="idx">
            <b>{{file.originFileName}}</b>
          </div>
        </span>
        <span v-else-if="newFile !== null">
          <div v-for="(file, idx) in newFile" :key="idx">
            <b>{{file.name}}</b>
          </div>
        </span>
      </div>
      <b-button @click="clearFiles" class="mr-2">파일 지우기</b-button>
      <b-button type="submit" variant="primary">수정</b-button>
      <b-button @click="onDelete" type="delete" variant="danger">삭제</b-button>
      <b-button href="/">취소</b-button>
    </b-form>
  </div>
</template>

<script>

import utils from '@/utils/utils.js'

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
                title: '',
            },
            newFile: [],
            oldFile: []
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
            this.oldFile = res.data.files
        }).catch( function() {
            console.log('게시판 업데이트 페이지에 쓸 정보 불러오기 실패')
        })
    },
    watch: {
      newFile: function(newVal) {
        for (const newFile in newVal) {
          this.oldFile.originFileName = newFile.name
        }
      }
    },
    methods: {
        onSubmit (event) {
          event.preventDefault()
          let vueThis = this
          let dataToJson = JSON.stringify(this.boardData)
          let blob = new Blob([dataToJson], {
            type: 'application/json'
          })
          let formData = new FormData()
          formData.append('data', blob)

          //file 여러개를 보낸다.
          for (let i = 0; i < this.newFile.length; i++) {
            formData.append('file', this.newFile[i])
          }

          this.$axios.put(`http://localhost:8080/api/v1/posts/${this.boardId}`, formData, {
          }).then( function() {
          console.log('게시판 업데이트 데이터 전송 성공')
          //2. 홈으로 redirect
          window.location.href = '/'
          }).catch( function(error) {
            console.log('게시판 업데이트 실패')
            let errorMessage = error.response.data.message
            vueThis.$alert(errorMessage, null, 'error')
            vueThis.boardData.password = ''
          })            
        },
        onDelete (event) {
          event.preventDefault()
          let vueThis = this
          if (utils.isEmpty(this.boardData.password)) {
            this.$alert('비밀번호가 입력되지 않았습니다.')
            return
          }
          
          let data = {
            password : this.boardData.password
          }

          this.$confirm("정말 삭제하실건가요?").then(() => {
            this.$axios.post(`http://localhost:8080/api/v1/posts/${this.boardData.id}`, data, {                
            }).then( () => {
              console.log('게시판 삭제 성공')
              window.location.href = '/'
            }).catch( (error) => {
                console.log('게시판 삭제 실패', error)
                let errorMessage = error.response.data.message
                vueThis.$alert(errorMessage, null, 'error')
                vueThis.boardData.password = ''
                })
            })
        },
        clearFiles () {
          this.$refs['file-input'].reset()
          this.newFile = []
          this.oldFile = []
        }
    }
}
</script>