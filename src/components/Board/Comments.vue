<template>
  <div>
    <ul>
        <div
            v-for="(comments, idx) in commentList"
            :key="idx">
            <span v-if="comments.comment.isDeleted === false">
                <span class="mb-2 mr-sm-2 mb-sm-0"><b>작성자</b> : {{comments.comment.author}}</span>
                <span class="mb-2 mr-sm-2 mb-sm-0"><b>댓글</b> : {{comments.comment.text}}</span>
                <span class="mb-2 mr-sm-2 mb-sm-0"><b>작성시간</b> : {{comments.comment.modifiedDate}}</span>
                <b-badge variant="primary" @click="onClick(comments,idx)">댓글달기</b-badge>
                <b-icon icon="trash-fill" size="sm" @click="onClickDelete(idx)">삭제</b-icon>
            </span>
            <span v-else>
                <del>이 댓글은 삭제된 댓글입니다.</del>
            </span>
            <!-- 댓글 삭제 -->
            <comment-delete v-if="openDeleteIdx === idx && openDelete"
                :comment="comments.comment"
                @delete-comment="getCommentList()">
            </comment-delete>
            <!-- 대댓글 등록 -->
            <comment-enroll
                v-show="isOpen" v-if="openIdx === idx"
                :postId="postId" 
                :parentId="comments.comment.id" 
                @new-comment="getCommentList()">
            </comment-enroll>
            <!-- 대댓글 등록 -->
            <nested-comment 
                v-for="(child, childIdx) in comments.children"
                :key="childIdx"
                :comment="child"
                :isDeleted="child.isDeleted"
                @delete-comment="getCommentList()">
            </nested-comment>
        </div>
    </ul>
    <!-- 댓글 등록 -->
    <comment-enroll :postId="postId" @new-comment="getCommentList()"></comment-enroll> 
  </div>
</template>

<script>
import nestedComment from './nestedComment.vue'
import CommentEnroll from './CommentEnroll.vue'
import CommentDelete from './CommentDelete.vue'
import utils from '../../utils/utils.js'

export default {
    name: 'Comments',
    components: { nestedComment,CommentEnroll, CommentDelete },
    props: {
        postId: String
    },
    data () {
        return {
            commentList: [],
            isOpen: false,
            openIdx: null,
            openDelete: false,
            openDeleteIdx: null
        }
    },
    created () {
        this.getCommentList()
    },
    methods: {
        getCommentList () {
            this.commentList = []
            this.$axios.get(this.$url + '/api/v1/comments/' + this.postId, {
            }).then(response => {
                this.isOpen = false
                let commentListData = response.data
                commentListData = commentListData.sort(function(a, b) {
                return a.parentId - b.parentId
                })
                for (let i = 0; i < commentListData.length; i++) {
                    let comment = commentListData[i]
                    if (comment.parentId === 0) {
                        comment.modifiedDate = utils.getDateFormat(comment.modifiedDate)
                        this.$set(this.commentList, i, {comment, children: []})
                    } else {
                        for (let j = 0; j < this.commentList.length; j++) {
                            if (this.commentList[j].comment.id === comment.parentId) {
                                comment.modifiedDate = utils.getDateFormat(comment.modifiedDate)
                                this.commentList[j].children.push(comment)
                            }
                        }
                    }
                }
                this.openIdx = null
                this.openDeleteIdx = null
                this.openDelete = false

                console.log('commentList ::: ', this.commentList)
            }).catch(error => {
                console.log('댓글 조회 실패 ::: ', error)
            })
        },
        onClick (comment, idx) {
            console.log('test click row comment data -> ', comment, idx)
            this.isOpen = !this.isOpen
            this.openIdx = idx
        },
        onClickDelete (idx) {
            this.openDelete = !this.openDelete
            this.openDeleteIdx = idx
        }
    }
}
</script>

<style>

</style>