<template>
  <div>
    <div class="CommentWriter">
      <div class="comment_inbox">
        <strong class="blind">댓글을 입력하세요</strong>

        <em class="comment_inbox_name">
          <input
            class="input_box"
            v-model="comment.author"
            placeholder="닉네임"
            size="13"
          />
          <input
            class="input_box"
            v-model="comment.password"
            placeholder="비밀번호"
            type="password"
            size="13"
          />
        </em>
        <textarea
          placeholder="댓글을 남겨보세요"
          rows="1"
          class="comment_inbox_text"
          style="overflow: hidden; overflow-wrap: break-word; height: 17px"
          @keydown.enter="onSubmit"
          v-model="comment.text"
        >
        </textarea>
      </div>
      <div class="comment_attach">
        <div class="register_box">
          <span
            v-if="isChild"
            class="button btn_register"
            :style="{ color: isActived }"
            @click="onCancel"
            >취소</span
          >
          <span
            class="button btn_register"
            :style="{ color: isActived }"
            @click="onSubmit"
            >등록</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentEnroll",
  props: {
    postId: String,
    parentId: Number,
    isChild: Boolean,
  },
  data() {
    return {
      comment: {
        parentId: this.parentId === undefined ? "0" : this.parentId,
        postId: this.postId,
        author: "",
        password: "",
        text: "",
        isDeleted: false,
        isLiked: false,
      },
      isActived: "",
    };
  },
  created() {
    console.log("CommentEnroll.vue created() ::: ", this.comment);
    console.log("props parentId ::: ", this.parentId);
  },
  watch: {
    "comment.text"() {
      if (this.comment.text.length > 0) this.isActived = "#32cd32";
      else this.isActived = "";
    },
  },
  methods: {
    onSubmit(event) {
      // let payload = this.comment;
      let vueThis = this;
      event.preventDefault();
      if (
        this.$utils.isEmpty(this.comment.text) ||
        this.$utils.isEmpty(this.comment.author) ||
        this.$utils.isEmpty(this.comment.password)
      ) {
        this.$alert("필드값을 모두 채워주세요");
        return;
      }

      this.$axios
        .post(this.$url + "/api/v1/comments", this.comment, {})
        .then((response) => {
          console.log("댓글 등록 성공 ::: ", response);
          console.log("등록된 댓글 :: ", response.data);
          // 댓글 pk인 id를 설정해준다.
          let payload = response.data;
          payload.isLiked = false;
          payload.modifiedDate = this.$utils.getDateFormat(payload.modifiedDate)
          vueThis.$emit("new-comment", payload);
          // 페이지 리로딩 없이 재사용하기 때문에 초기화 필요
          this.comment = {
            parentId: this.parentId === undefined ? "0" : this.parentId,
            postId: this.postId,
            author: "",
            password: "",
            text: "",
            isDeleted: false
          };
        })
        .catch((error) => {
          console.log("댓글 등록 실패", error);
        });
    },
    onCancel() {
      this.$emit("onCancel");
    },
  },
};
</script>
<style>
.input_box {
  margin-right: 5px;
  outline: none;
  border: 0;
  border-radius: 6px;
  padding-left: 5px;
  background-color: #f5f5f5;
}
.CommentBox .comment_list + .CommentWriter {
  margin-top: 15px;
}
.CommentWriter {
  margin: 12px 0 29px;
  padding: 16px 10px 10px 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  box-sizing: border-box;
  background: #ffffff;
}
.CommentWriter .comment_inbox {
  position: relative;
  margin-bottom: 10px;
}
.blind {
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
}
.CommentWriter .comment_inbox_name {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 13px;
}
.CommentWriter .comment_inbox_text {
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  width: 100%;
  min-height: 17px;
  padding-right: 1px;
  border: 0;
  font-size: 13px;
  -webkit-appearance: none;
  resize: none;
  box-sizing: border-box;
  background: transparent;
  color: #000000;
  outline: 0;
}
.CommentWriter .comment_attach {
  position: relative;
}
div {
  display: block;
}
.CommentWriter .attach_box {
  float: left;
  padding-top: 10px;
}
.CommentWriter .register_box {
  float: right;
}
.CommentWriter .register_box .button {
  display: inline-block;
  min-width: 46px;
  height: 34px;
  line-height: 36px;
  font-size: 13px;
  color: #b7b7b7;
  border-radius: 6px;
  box-sizing: border-box;
  font-weight: 700;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
}
.CommentWriter .comment_attach:after {
  content: "";
  display: block;
  clear: both;
}
.CommentBox a {
  color: inherit;
}
</style>
