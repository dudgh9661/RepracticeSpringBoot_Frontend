<template>
  <div>
    <span v-if="!isDeleted">
        <b-icon icon="arrow-return-right"></b-icon>
        <span class="mb-2 mr-sm-2 mb-sm-0">&nbsp;<b>작성자</b> : {{comment.author}}</span>
        <span class="mb-2 mr-sm-2 mb-sm-0"><b>댓글</b> : {{comment.text}}</span>
        <span class="mb-2 mr-sm-2 mb-sm-0"><b>작성시간</b> : {{comment.modifiedDate}}</span>
        <b-icon icon="trash-fill" size="sm" @click="onClickDelete()">삭제</b-icon>
        <comment-delete 
            v-if="openDelete"
            @delete-comment="test"
            :comment="comment">
        </comment-delete>
    </span>
    <span v-else>
        <del>이 댓글은 삭제된 댓글입니다.</del>
    </span>
  </div>
</template>

<script>
import CommentDelete from './CommentDelete.vue'

export default {
    name: 'nestedComment',
    components: {CommentDelete},
    props: {
        comment: Object,
        isDeleted: Boolean
    },
    data () {
        return {
            openDelete: false
        }
    },
    created () {
        console.log("nestedComment isDeleted ::: " + this.isDeleted)
        console.log("nestedComment comment ::: ", this.comment)
    },
    methods: {
        onClickDelete() {
            this.openDelete = !this.openDelete
        },
        test () {
            this.$emit('delete-comment')
        }
    }
}
</script>

<style>

</style>