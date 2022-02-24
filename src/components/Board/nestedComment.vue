<template>
  <div class="CommentBox" style="padding-left: 50px">
    <div class="comment_area">
      <div class="comment_box">
        <span v-if="!isDeleted">
          <div class="comment_nick_box">
            <div class="comment_nick_info">
              <span class="comment_nickname">{{ comment.author }}</span>
            </div>
          </div>
          <div class="comment_text_box">
            <div lcass="comment_text_view">
              <span class="text_comment">{{ comment.text }}</span>
            </div>
          </div>
          <div class="comment_info_box">
            <span class="box_left">
              <div
                class="like_board"
                style="cursor: pointer"
                @click="onClickLiked(comment)"
              >
                <b-icon
                  v-if="comment.isLiked === false"
                  icon="heart"
                  variant="danger"
                ></b-icon
                ><b-icon
                  v-else-if="comment.isLiked"
                  icon="heart-fill"
                  variant="danger"
                ></b-icon
                ><span
                  style="
                    padding: 0px 5px 0px 2px;
                    color: black;
                    cursor: default;
                  "
                  >좋아요 {{ comment.liked }}</span
                >
              </div>
            </span>
            <span class="comment_info_date">{{ comment.modifiedDate }}</span>
            <b-icon
              style="cursor: pointer; margin-left: px"
              icon="trash-fill"
              size="sm"
              @click="onClickDelete()"
              >삭제</b-icon
            >

            <!-- 댓글 삭제 -->
            <comment-delete
              v-if="openDelete"
              @delete-comment="deleteComment()"
              :comment="comment"
            >
            </comment-delete>
          </div>
        </span>
        <span v-else>
          <div style="color: darkgrey; margin-top: 10px">
            이 댓글은 삭제된 댓글입니다.
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CommentDelete from "./CommentDelete.vue";

export default {
  name: "nestedComment",
  components: { CommentDelete },
  props: {
    comment: Object,
    isDeleted: Boolean,
  },
  data() {
    return {
      openDelete: false,
    };
  },
  created() {
    console.log("nestedComment isDeleted ::: " + this.isDeleted);
    console.log("nestedComment comment ::: ", this.comment);
  },
  methods: {
    onClickDelete() {
      this.openDelete = !this.openDelete;
    },
    deleteComment() {
      this.comment.isDeleted = true;
      this.$emit("delete-comment");
    },
    onClickLiked(comment) {
      console.log("onClickLiked comment ::: ", comment);
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
    },
  },
};
</script>

<style src="@/assets/styles/comments.css"></style>
