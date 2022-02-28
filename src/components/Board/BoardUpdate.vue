<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="게시물 번호" label-for="input-id">
        <b-form-input
          id="input-1d"
          v-model="boardData.id"
          required
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="제목" label-for="input-title">
        <b-form-input
          id="input-title"
          v-model="boardData.title"
          placeholder="제목을 적어주세요!"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="작성자" label-for="input-author">
        <b-form-input
          id="input-author"
          v-model="boardData.author"
          required
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-4"
        label="비밀번호"
        label-for="input-password"
      >
        <b-form-input
          id="input-password"
          type="password"
          v-model="boardData.password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="내용" label-for="input-content">
        <b-form-textarea
          id="input-content"
          v-model="boardData.content"
          type="text"
          rows="12"
          placeholder="내용을 입력해주세요~!"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-group-6" label="파일" label-for="input-content">
        <b-form-file
          v-model="newFile"
          ref="file-input"
          accept="image/*"
          placeholder="이미지 파일만 업로드 가능합니다!"
          multiple
          class="mt-3"
        >
          <template v-slot:file-name="{ names }">
            <b-badge
              v-for="(name, idx) in names"
              :key="idx"
              variant="dark"
              class="ml-1"
              >{{ name }}</b-badge
            >
          </template>
        </b-form-file>
      </b-form-group>
      <div v-if="oldFile.length > 0" class="mt-3">
        업로드된 파일
          <div v-for="(file, idx) in oldFile" :key="idx">
            <b>{{ file.name }}</b>
          </div>
      </div>
      <b-button @click="clearFiles" class="mr-2">파일 지우기</b-button>
      <b-button type="submit" variant="primary">수정</b-button>
      <b-button href="/">취소</b-button>
    </b-form>
  </div>
</template>

<script>

export default {
  name: "BoardUpdate",
  data() {
    return {
      boardId: this.$route.params.id,
      url: "",
      boardData: {
        author: "",
        password: "",
        content: "",
        title: "",
      },
      newFile: [],
      oldFile: [],
    };
  },
  created() {
    this.url = this.$url + `/api/v1/posts/${this.boardId}`;
    let vueThis = this;
    this.$axios
      .get(this.url, {})
      .then((res) => {
        console.log("update res", res);
        this.boardData.id = res.data.id;
        this.boardData.title = res.data.title;
        this.boardData.author = res.data.author;
        this.boardData.content = res.data.content;
        // this.oldFile = res.data.files;

        // 1. 기존에 있던 파일들을 Blob을 이용해 File 객체로 만든다.
        // 2. 만들어진 File 객체를 oldFile에 넣어 초기화 시킨다.
        let fileList = res.data.files
        for (let i = 0; i < fileList.length; i++) {
          this.$axios
            .get(this.$url + `/api/v1/posts/download/${fileList[i].id}`, {
              responseType: "blob",
            })
            .then((res) => {
              let blob = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              console.log("파일 데이터 받아오기 성공 ::: ", blob);
              // vue의 변경감지를 유지하기 위해 $set을 이용한다.
              vueThis.oldFile.push(new File([blob], fileList[i].originFileName));
              console.log(vueThis.oldFile)
            })
            .catch((error) => {
              console.log("파일 이미지 불러오기 실패 ::: ", error);
              alert("파일 이미지 불러오기를 실패했습니다. 다시 시도해주세요.");
            });
        }
      })
      .catch(function () {
        console.log("게시판 업데이트 페이지에 쓸 정보 불러오기 실패");
      });
  },
  watch: {
    // 새로 업로드할 파일들을 oldFile에 넣는다.
    newFile: function (newVal, oldVal) {
      console.log('old IN newFile', oldVal);
      console.log('new IN newFile: ', newVal);
      for (let i = 0; i < newVal.length; i++) {
        console.log('새로 들어온 파일 ' + i + ' : ', newVal[i]);
        // vue의 변경감지를 유지하기 위해 $set을 이용한다.
        this.$set(this.oldFile, this.oldFile.length, newVal[i]);
      }
    }
  },
  methods: {
    /*
     * 함수명 : onSubmit
     * 설명 : 게시글을 업데이트한다.
     */
    onSubmit(event) {
      event.preventDefault();
      let vueThis = this;
      let dataToJson = JSON.stringify(this.boardData);
      let blob = new Blob([dataToJson], {
        type: "application/json",
      });
      let formData = new FormData();
      formData.append("data", blob);

      for (let i = 0; i < this.oldFile.length; i++) {
        formData.append("file", this.oldFile[i]);
      }

      this.$axios
        .put(this.$url + `/api/v1/posts/${this.boardId}`, formData, {})
        .then(function () {
          console.log("게시판 업데이트 데이터 전송 성공");
          //2. 홈으로 redirect
          window.location.href = "/";
        })
        .catch(function (error) {
          console.log("게시판 업데이트 실패");
          let errorMessage = error.response.data.message;
          vueThis.$alert(errorMessage, null, "error");
          vueThis.boardData.password = "";
        });
    },
    /*
     * 함수명 : clearFiles
     * 설명 : 파일을 초기화한다.
     */
    clearFiles() {
      this.$refs["file-input"].reset();
      this.newFile = [];
      this.oldFile = [];
    },
  },
};
</script>
