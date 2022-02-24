<template>
  <div>
    <div class="CommentBox">
      <div class="comment_option">
        <span class="comment_title">댓글</span>
        <span class="comment_count">{{ commentList.length }}</span>
        <span class="comment_tab">
          <button type="button" class="comment_refresh_button">
            <b-icon icon="arrow-clockwise"></b-icon>
          </button>
        </span>
      </div>

      <ul class="comment_list">
        <li
          class="CommentItem"
          v-for="(comments, idx) in commentList"
          :key="idx"
        >
          <div class="comment_area">
            <div class="comment_box">
              <span v-if="comments.comment.isDeleted === false">
                <div class="comment_nick_box">
                  <div class="comment_nick_info">
                    <span class="comment_nickname">{{
                      comments.comment.author
                    }}</span>
                  </div>
                </div>
                <div class="comment_text_box">
                  <div lcass="comment_text_view">
                    <span class="text_comment">{{
                      comments.comment.text
                    }}</span>
                  </div>
                </div>
                <div class="comment_info_box">
                  <div class="like_board"
                  style="cursor: pointer"
                  @click="onClickLiked(comments.comment)">
                    <b-icon v-if="comments.comment.isLiked === false" icon="heart" variant="danger"></b-icon
                    ><b-icon v-else-if="comments.comment.isLiked" icon="heart-fill" variant="danger"></b-icon
                      ><span style="padding: 0px 5px 0px 2px; color: black; cursor: default;"
                      >좋아요 {{ comments.comment.liked }}</span
                    >
                  </div>
                  <span class="comment_info_date">{{
                    comments.comment.modifiedDate
                  }}</span>
                  <b-badge
                    style="cursor: pointer"
                    class="comment_info_button"
                    variant="primary"
                    @click="onClick(comments, idx)"
                  >
                    댓글달기
                  </b-badge>
                  <b-icon
                    style="cursor: pointer; margin-left: px"
                    icon="trash-fill"
                    size="sm"
                    @click="onClickDelete(idx)"
                    >삭제</b-icon
                  >
                </div>
              </span>
              <span v-else>
                <div style="color: darkgrey; padding: 7px 0px 7px 5px">
                  이 댓글은 삭제된 댓글입니다.
                </div>
              </span>
              <!-- 댓글 삭제 -->
              <comment-delete
                v-if="openDeleteIdx === idx && openDelete"
                :comment="comments.comment"
                @delete-comment="getCommentList()"
              >
              </comment-delete>
              <!-- 대댓글 등록 -->
              <comment-enroll
                style="padding-left: 25px"
                v-show="isOpen"
                v-if="openIdx === idx"
                :postId="postId"
                :parentId="comments.comment.id"
                :isChild="true"
                @new-comment="getCommentList()"
                @onCancel="isOpen = false"
              >
              </comment-enroll>
              <!-- 대댓글 등록 -->
              <nested-comment
                v-for="(child, childIdx) in comments.children"
                :key="childIdx"
                :comment="child"
                :isDeleted="child.isDeleted"
                @delete-comment="getCommentList()"
              >
              </nested-comment>
            </div>
          </div>
        </li>
      </ul>
      <comment-enroll
        :postId="postId"
        @new-comment="getCommentList()"
      ></comment-enroll>
    </div>
  </div>
</template>

<script>
import nestedComment from "./nestedComment.vue";
import CommentEnroll from "./CommentEnroll.vue";
import CommentDelete from "./CommentDelete.vue";
import utils from "../../utils/utils.js";

export default {
  name: "Comments",
  components: { nestedComment, CommentEnroll, CommentDelete },
  props: {
    postId: String,
  },
  data() {
    return {
      commentList: [],
      isOpen: false,
      openIdx: null,
      openDelete: false,
      openDeleteIdx: null
    };
  },
  created() {
    this.getCommentList();
  },
  methods: {
    getCommentList() {
      this.commentList = [];
      this.$axios
        .get(this.$url + "/api/v1/comments/" + this.postId, {})
        .then((response) => {
          this.isOpen = false;
          let commentListData = response.data;
          commentListData = commentListData.sort(function (a, b) {
            return a.parentId - b.parentId;
          });
          for (let i = 0; i < commentListData.length; i++) {
            let comment = commentListData[i];
            if (comment.parentId === 0) {
              comment.modifiedDate = utils.getDateFormat(comment.modifiedDate);
              comment.isLiked = false
              this.$set(this.commentList, i, { comment, children: [] });
            } else {
              for (let j = 0; j < this.commentList.length; j++) {
                if (this.commentList[j].comment.id === comment.parentId) {
                  comment.modifiedDate = utils.getDateFormat(comment.modifiedDate);
                  comment.isLiked = false
                  this.commentList[j].children.push(comment);
                }
              }
            }
          }
          this.openIdx = null;
          this.openDeleteIdx = null;
          this.openDelete = false;

          console.log("commentList ::: ", this.commentList);
        })
        .catch((error) => {
          console.log("댓글 조회 실패 ::: ", error);
        });
    },
    onClick(comment, idx) {
      console.log("test click row comment data -> ", comment, idx);
      this.isOpen = true;
      this.openIdx = idx;
    },
    onClickDelete(idx) {
      this.openDelete = !this.openDelete;
      this.openDeleteIdx = idx;
    },
    onClickLiked(comment) {
      console.log('onClickLiked comment ::: ', comment)
      comment.isLiked = !comment.isLiked;
      if (comment.isLiked === true) {
        this.$axios
          .post(this.$url + `/api/v1/comments/like/${comment.id}`, {})
          .then(() => {
            console.log("좋아요 버튼 클릭 : " + comment.isLiked);
            this.$axios
              .get(this.$url + `/api/v1/comments/like/${comment.id}`, {})
              .then((res) => {
                console.log("좋아요 버튼 get ::: ", res);
                comment.liked = res.data.liked;
              })
              .catch((err) => {
                console.log(
                  "좋아요 버튼 클릭 true일 때 get method error ::: ",
                  err
                );
              });
          })
          .catch((err) => {
            console.log("좋아요 버튼 클릭 실패 ", err);
          });
      } else if (comment.isLiked === false) {
        this.$axios
          .delete(this.$url + `/api/v1/comments/like/${comment.id}`, {})
          .then(() => {
            console.log("좋아요 버튼 클릭 : " + comment.isLiked);
            this.$axios
              .get(this.$url + `/api/v1/comments/like/${comment.id}`)
              .then((res) => {
                comment.liked = res.data.liked;
              })
              .catch((err) => {
                console.log(
                  "좋아요 버튼 클릭 false일 때 get method error ::: ",
                  err
                );
              });
          })
          .catch((err) => {
            console.log("좋아요 버튼 클릭 실패 ", err);
          });
      }
    }
    // newComment (payload) {
    //   console.log('newComment', payload)
    // }
  },
};
</script>

<style src="@/assets/styles/comments.css">
</style>
