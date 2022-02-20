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
              <div class="like_board">
                <b-icon icon="heart" variant="danger"></b-icon
                ><span style="padding: 0px 5px 0px 2px; color: black"
                  >좋아요 3</span
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
              @delete-comment="test"
              :comment="comment"
            >
            </comment-delete>
          </div>
        </span>
        <span v-else>
          <div style="color: darkgrey; margin-top: 10px;">이 댓글은 삭제된 댓글입니다.</div>
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
    test() {
      this.$emit("delete-comment");
    },
  },
};
</script>

<style src="@/assets/styles/comments.css"></style>
