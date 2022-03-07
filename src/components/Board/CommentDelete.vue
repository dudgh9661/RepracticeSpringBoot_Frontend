<template>
  <div>
    <b-icon icon="arrow-return-right" style="color: black;"></b-icon>
    <input class="comment_delete" v-model="password" type="password" placeholder="비밀번호를 입력해주세요"/>
    <span class="comment_delete_confirm">
      <b-icon icon="check" style="color: red; padding-top: 5px;" font-scale="2" @click.stop="onDelete"></b-icon>
      <span style="color: black; padding-top: 5px" font-scale="2" @click.stop="onCancel">취소</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "CommentDelete",
  props: {
    comment: Object,
  },
  data() {
    return {
      password: "",
    };
  },
  created() {
    console.log("CommentDelete created ::: ", this.comment);
  },
  methods: {
    onDelete(event) {
      event.preventDefault();
      console.log("확인 버튼 클릭 ::: ", this.comment);
      if (this.$utils.isEmpty(this.password)) {
          this.$alert("비밀번호를 입력해주세요")
          return
      }
      let vueThis = this;
      let data = {
        password: this.password,
      };
      this.$confirm("정말 삭제하실건가요?").then(() => {
        this.$axios
          .post(this.$url + `/api/v1/comments/${this.comment.id}`, data, {})
          .then((response) => {
            vueThis.$emit("delete-comment");
            this.comment.isDeleted = true;
            console.log("댓글 삭제 성공 ::: ", response);
          })
          .catch((error) => {
            console.log("댓글 삭제 실패 ::: ", error);
            let errorMessage = error.response.data.message;
            vueThis.$alert(errorMessage, null, "error");
            vueThis.password = "";
          });
      });
    },
    onCancel () {
      this.password = "";
      this.$emit("onCancel");
    }
  }
};
</script>

<style>
.comment_delete {
    height: 20px;
    outline: none;
    border:0;
    border-radius: 6px;
    padding-left: 7px;
    background-color: #f5f5f5;
}
.comment_delete_confirm {
    cursor: pointer;
    outline: none;
    /* border: 0; */
    
    /* border-radius: 6px; */
    /* padding-left: 5px; */
    /* background-color: #f5f5f5; */
}
</style>
