<template>
  <span style="margin-top: 10px; margin-left: 10px;">
    <input class="board_delete" v-model="password" type="password" placeholder="비밀번호를 입력해주세요"/>
    <span class="board_delete_confirm" @click="onDelete"><b-icon icon="check" style="color: red; padding-top: 5px;" font-scale="2"></b-icon></span>
  </span>
</template>

<script>
export default {
  name: "BoardDelete",
  props: {
    post: Object,
  },
  data() {
    return {
      password: "",
    };
  },
  created() {
    console.log("BoardDelete created ::: ", this.post);
  },
  methods: {
    onDelete(event) {
      event.preventDefault();
      console.log("삭제 버튼 클릭 ::: ", this.post);
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
          .post(this.$url + `/api/v1/posts/${this.post.id}`, data, {})
          .then(() => {
            console.log("게시판 삭제 성공");
            this.$router.push('/');
          })
          .catch((error) => {
            console.log("게시판 삭제 실패", error);
            let errorMessage = error.response.data.message;
            vueThis.$alert(errorMessage, null, "error");
            vueThis.boardData.password = "";
          });
      });
    },
  },
};
</script>

<style scoped>
.board_delete {
    height: 20px;
    outline: none;
    border:0;
    border-radius: 6px;
    padding-left: 7px;
    background-color: #f5f5f5;
}
.board_delete_confirm {
    cursor: pointer;
    outline: none;
    /* border: 0; */
    
    /* border-radius: 6px; */
    /* padding-left: 5px; */
    /* background-color: #f5f5f5; */
}
span {
    display:inline-block; /*or display:block;*/
}
</style>
