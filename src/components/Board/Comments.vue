<template>
  <div>
    <div class="CommentBox">
      <div class="comment_option">
        <span class="comment_title">댓글</span>
        <span class="comment_count">{{ getCommentLength }}</span>
        <span class="comment_tab">
          <button
            type="button"
            class="comment_refresh_button"
            @click="getCommentList()"
          >
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
                  <div
                    class="like_board"
                    style="cursor: pointer"
                    @click="onClickLiked(comments.comment)"
                  >
                    <b-icon
                      v-if="comments.comment.isLiked === false"
                      icon="heart"
                      variant="danger"
                    ></b-icon
                    ><b-icon
                      v-else-if="comments.comment.isLiked"
                      icon="heart-fill"
                      variant="danger"
                    ></b-icon
                    ><span
                      style="
                        padding: 0px 5px 0px 2px;
                        color: black;
                        cursor: default;
                      "
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
                @delete-comment="deleteComment()"
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
                @new-comment="newCommentChild"
                @onCancel="isOpen = false"
              >
              </comment-enroll>
              <!-- 대댓글 등록 -->
              <nested-comment
                v-for="(child, childIdx) in comments.children"
                :key="childIdx"
                :comment="child"
                :isDeleted="child.isDeleted"
                :postId="postId"
                @delete-comment="deleteComment()"
                @add-comment-liked="addNestedCommentLiked"
                @delete-comment-liked="deleteNestedCommentLiked"
              >
              </nested-comment>
            </div>
          </div>
        </li>
      </ul>
      <comment-enroll
        :postId="postId"
        @new-comment="newComment"
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
    likedCommentList: Array,
  },
  data() {
    return {
      commentList: [],
      isOpen: false,
      openIdx: null,
      openDelete: false,
      openDeleteIdx: null,
    };
  },
  created() {
    console.log("created Comments", this.$parent.$data.likedCommentList);
    this.initComment();
  },
  mounted() {
    console.log("mounted Comments", this.likedCommentList);
  },
  computed: {
    getCommentLength() {
      let cnt = this.commentList.length;

      for (let i = 0; i < this.commentList.length; i++) {
        cnt += this.commentList[i].children.length;
      }
      return cnt;
    },
  },
  methods: {
    initComment() {
      console.log("props likedCommentList ::: ", this.likedCommentList);
      this.getCommentList();
    },
    getCommentList() {
      console.log("getCommentList() ::: ", this.likedCommentList);
      this.commentList = [];
      this.$axios
        .get(this.$url + "/api/v1/comments/" + this.postId, {})
        .then((response) => {
          this.isOpen = false;
          let commentListData = response.data;
          // this.$set에서 사용할 comment index.
          // i로 this.$set을 셋팅할 경우, 0:댓글 1,2:대댓글 3:댓글 인경우 0->3으로
          // 즉, 2,3번 index가 빈 값으로 들어가게 됨
          // this.$set( , 0, ) -> this.$set( , 3, ) -> 2,3번 index가 empty로 자동으로 박힘
          let commentIdx = 0;
          // 댓글부터 셋팅해야, 그것의 Children으로 push 할 수 있으므로 정렬한다.
          // commentListData = commentListData.sort(function (a, b) {
          //   return a.parentId - b.parentId;
          // });
          for (let i = 0; i < commentListData.length; i++) {
            let comment = commentListData[i];
            if (comment.parentId === 0) {
              // 댓글
              comment.modifiedDate = utils.getDateFormat(comment.modifiedDate);
              console.log("comment 정보 : ", comment);
              console.log("좋아요 여부 : ", this.getIsLiked(comment));
              comment.isLiked = this.getIsLiked(comment); // 좋아요 클릭 상태
              this.$set(this.commentList, commentIdx++, {
                comment,
                children: [],
              }); // 댓글 idx 관리
              console.log("댓글 ::: ", this.commentList);
            } else {
              // 대댓글
              for (let j = 0; j < this.commentList.length; j++) {
                if (this.commentList[j].comment.id === comment.parentId) {
                  comment.modifiedDate = utils.getDateFormat(
                    comment.modifiedDate
                  );
                  console.log("대댓글 comment 정보 : ", comment);
                  console.log("좋아요 여부 : ", this.getIsLiked(comment));
                  comment.isLiked = this.getIsLiked(comment);
                  this.commentList[j].children.push(comment);
                  break;
                }
              }
              console.log("대댓글 ::: ", this.commentList);
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
      this.isOpen = true;
      this.openIdx = idx;
    },
    onClickDelete(idx) {
      this.openDelete = !this.openDelete;
      this.openDeleteIdx = idx;
    },
    onClickLiked(comment) {
      console.log("onClickLiked comment ::: ", comment);
      comment.isLiked = !comment.isLiked;
      let vueThis = this;
      if (comment.isLiked === true) {
        this.$axios
          .post(this.$url + `/api/v1/comments/like/${comment.id}`, {
            ip: this.$ip,
            postId: this.postId,
          })
          .then(() => {
            console.log("좋아요 버튼 클릭 : " + comment.isLiked);
            this.$axios
              .get(this.$url + `/api/v1/comments/like/${comment.id}`, {})
              .then((res) => {
                console.log("좋아요 버튼 get ::: ", res);
                comment.liked = res.data.liked;
                vueThis.likedCommentList.push({ id: comment.id }); // 좋아요 버튼이 눌린 신규 comment 추가
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
          .post(this.$url + `/api/v1/comments/unlike/${comment.id}`, {
            ip: this.$ip,
          })
          .then(() => {
            console.log("좋아요 취소 버튼 클릭 : " + comment.isLiked);
            this.$axios
              .get(this.$url + `/api/v1/comments/like/${comment.id}`)
              .then((res) => {
                comment.liked = res.data.liked;
                let deleteIdx = vueThis.likedCommentList.findIndex(
                  (element) => element.id === comment.id
                );
                console.log("deleteIdx ::: ", deleteIdx);
                vueThis.likedCommentList.splice(deleteIdx, 1); // 좋아요 버튼이 눌린 신규 comment 추가
              })
              .catch((err) => {
                console.log(
                  "좋아요 버튼 클릭 false일 때 get method error ::: ",
                  err
                );
              });
          })
          .catch((err) => {
            console.log("좋아요 취소 버튼 클릭 실패 ", err);
          });
      }
    },
    newComment(payload) {
      console.log("newComment", payload);
      let comment = payload;
      this.$set(this.commentList, this.commentList.length, {
        comment,
        children: [],
      });
      console.log("update commentList ::: ", this.commentList);
    },
    newCommentChild(payload) {
      let comment = payload;
      console.log("newCommentChild", comment);
      for (let i = 0; i < this.commentList.length; i++) {
        if (comment.parentId === this.commentList[i].comment.id) {
          console.log("child11 ::: ", this.commentList[i].children);
          this.$set(
            this.commentList[i].children,
            this.commentList[i].children.length,
            comment
          );
          this.isOpen = false;
          console.log("child22 ::: ", this.commentList[i].children);
          return;
        }
      }
    },
    deleteComment() {
      this.openDelete = false;
    },
    getIsLiked(comment) {
      if (this.$utils.isEmpty(this.likedCommentList)) {
        console.log("likedCommentList가 비었습니다");
        return false;
      }
      for (let i = 0; i < this.likedCommentList.length; i++) {
        let getComment = this.likedCommentList[i];
        if (getComment.id === comment.id) return true;
      }
      console.log("getIsLiked() false : " + comment.id, this.likedCommentList);
      return false;
    },
    addNestedCommentLiked(comment) {
      console.log('addNestedCommentLiked ::: ', comment)
      this.likedCommentList.push({ id: comment.id }); // 좋아요 버튼이 눌린 신규 comment 추가
    },
    deleteNestedCommentLiked(comment) {
      console.log('deleteNestedCommentLiked ::: ', comment)
      let deleteIdx = this.likedCommentList.findIndex((element) => element.id === comment.id);
      console.log("deleteIdx ::: ", deleteIdx);
      this.likedCommentList.splice(deleteIdx, 1); // 좋아요 버튼이 눌린 신규 comment 추가
    },
  },
};
</script>

<style src="@/assets/styles/comments.css"></style>
