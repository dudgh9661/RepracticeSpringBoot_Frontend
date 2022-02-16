<template>
  <div>
      <b-form @submit="onDelete" inline>
        <b-form-input
            id="input-password"
            placeholder="비밀번호를 입력해주세요!"
            v-model="password"
            required>
        </b-form-input>
        <b-button type="submit" variant="primary">확인</b-button>
      </b-form>
  </div>
</template>

<script>
export default {
    name: 'CommentDelete',
    props: {
        comment: Object
    },
    data () {
        return {
            password: ''
        }
    },
    created () {
        console.log('CommentDelete created ::: ', this.comment)
    },
    methods: {
        onDelete (event) {
            event.preventDefault()
            console.log('확인 버튼 클릭 ::: ', this.comment)
            let vueThis = this
            let data = {
                password : this.password
            }
            this.$axios.post(this.$url + `/api/v1/comments/${this.comment.id}`, data, {
            }).then( response => {
                vueThis.$emit('delete-comment')
                console.log('댓글 삭제 성공 ::: ', response)
            }).catch( error => {
                console.log('댓글 삭제 실패 ::: ', error)
                let errorMessage = error.response.data.message
                vueThis.$alert(errorMessage, null, 'error')
                vueThis.password = ''
            })
        }
    }

}
</script>

<style>

</style>