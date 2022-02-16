<template>
  <div>
    <b-form @submit="onSubmit" inline>
        <b-form-group id="comment-group-1" label="작성자" label-for="comment-author" size="sm">
            <b-form-input
            id="comment-author" size="sm"
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="comment.author"
            required
            ></b-form-input>
        </b-form-group>

        <b-form-group id="comment-group-4" label="비밀번호" label-for="comment-password">
            <b-form-input
            id="comment-password" type="password" size="sm"
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="comment.password"
            required
            ></b-form-input>
        </b-form-group>

        <b-form-group id="comment-group-3" label="댓글" label-for="comment-text">
            <b-form-textarea
            id="textarea" size="sm"
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="comment.text"
            placeholder="댓글을 입력해주세요."
            rows="2"
            max-row="5"
            required
            ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">등록</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
    name: 'CommentEnroll',
    props: {
        postId: String,
        parentId: Number
    },
    data () {
        return {
            comment: {
                parentId: this.parentId === undefined ? '0' : this.parentId,
                postId: this.postId,
                author: '',
                password: '',
                text: '',
                isDeleted: false
            }
        }
    },
    created () {
        console.log('CommentEnroll.vue created() ::: ', this.comment)
        console.log('props parentId ::: ', this.parentId)
    },
    methods: {
        onSubmit (event) {
            event.preventDefault()
            let vueThis = this
            this.$axios.post(this.$url + '/api/v1/comments', this.comment, {
            }).then( response => {
                console.log('댓글 등록 성공 ::: ', response)
                // 페이지 리로딩 없이 재사용하기 때문에 초기화 필요
                this.comment = {
                    parentId: '0',
                    postId: this.postId,
                    author: '',
                    password: '',
                    text: '',
                    isDeleted: false
                }
                vueThis.$emit('new-comment')
            }).catch(error => {
                console.log('댓글 등록 실패', error)
            })
        }
    }
}
</script>

<style>

</style>