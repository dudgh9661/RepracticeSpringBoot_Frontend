<template>
  <div>
    <navigation @searchPost="getSearchResult"> </navigation>
    <b-table fixed responsive :items="postsList" :fields="fields"
      hover
      @row-clicked="onClick"
      id="my-table"
      small
    >
      <template #table-colgroup="scope">
        <col
          v-for="field in scope.fields"
          :key="field.key"
          :style="test(field.key)"
        >
      </template>
      <template #cell(update)="row">
        <b-button
          size="sm"
          style="background: #006400; border: 0; outline: 0;"
          :to="{ name: 'BoardUpdate', params: { id: row.item.id } }"
          >게시물 수정</b-button
        >
      </template>
    </b-table>
    <!-- <b-table 
      striped
      hover
      @row-clicked="onClick"
      id="my-table"
      :items="postsList"
      :fields="fields"
      small
    >
      <template #cell(update)="row">
        <b-button
          size="sm"
          variant="primary"
          :to="{ name: 'BoardUpdate', params: { id: row.item.id } }"
          >게시물 수정</b-button
        >
      </template>
    </b-table> -->
    <div>
      <b-button class="enroll_button" href="/enroll">게시물 등록</b-button>
    </div>
    <div>
      <b-pagination class="pagination"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import Navigation from "../nav/Navigation.vue";

export default {
  name: "Board",
  components: {
    Navigation,
  },
  data() {
    return {
      sortBy: "id",
      sortDesc: false,
      fields: [
        { key: "id", label: "번호" },
        { key: "title", label: "제목" },
        { key: "author", label: "작성자" },
        { key: "createdDate", label: "작성일" },
        { key: "liked", label: "좋아요" },
        { key: "update", label: "" }
      ],

      postsList: [],
      perPage: 10,
      currentPage: 1,
      totalElement: 0,
      testData: 0
    };
  },
  computed: {
    rows() {
      return this.totalElement
    }
  },
  watch: {
    currentPage (newVal) {
      this.testData = newVal
      this.postsList = []
      console.log('newVal ::: ', newVal)
      this.$axios
      .get(this.$url + `/api/v1/posts/page/${newVal-1}`, {
        // headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => {
        // this.postsList = response.data;
        let data = response.data
        console.log('Changed currentPage In BoardList.vue watch() ::: ', data)
        this.postsList = data.postsList
        this.postsList.forEach((item) => {
          item.createdDate = this.$utils.getDateFormat(item.createdDate);
        });
      });
    }
  },
  created() {
    this.$axios
      .get(this.$url + `/api/v1/posts/page/${this.currentPage-1}`, {
        // headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => {
        // this.postsList = response.data;
        let data = response.data
        console.log('response data In BoardList.vue created() ::: ', data)
        this.postsList = data.postsList
        this.totalElement = data.totalElement
        this.postsList.forEach((item) => {
          item.createdDate = this.$utils.getDateFormat(item.createdDate);
        });
        console.log("BoardList.vue created() ::::", response);
      });
  },
  beforeDestroy() {
    this.$eventBus.$off("searchPost");
  },
  methods: {
    onClick(item) {
      let id = item.id;
      //1. id를 '/board' url로 넘겨준다.
      console.log("onClick 함수 호출");
      window.location.href = `/board/${id}`;
    },
    getSearchResult(payload) {
      console.log("keyword로 검색한 결과 => ", payload);
      this.postsList = payload.postsList;
      this.currentPageNumber = payload.currentPageNumber;
      this.totalPage = payload.totalPage;
    },
    test (key) {
      console.log('key :: ', key)
      let css = {
        width: ''
      }
      if (key === 'id') {
        css.width = '10%'
      } else if (key === 'title') {
        css.width = '30%'
      } else if (key === 'author') {
        css.width = '20%'
        css.variant = "success"
      } else if (key === 'createdDate') {
        css.width = '15%'
      } else if (key === 'liked') {
        css.width = '5%'
      } else if (key === 'update') {
        css.width = '10%'
      }
      return css
    }
  },
};
</script>
<style>
.pagination {
  justify-content: center;
  outline: none;
}
.page-item > button:active {
  outline: none !important;
  box-shadow: none !important;
  border: 0;
}
.page-item.active .page-link {  
    background-color: transparent;  
    border-color: transparent;
    outline: none;
    text-decoration: none;
    box-shadow: none;
    color: green;
    font-weight: 700;
}
.page-item .page-link {  
    background-color: transparent;  
    border-color: transparent;
    color: black;
    outline: none;
}
.page-item.disabled .page-link {  
  border: 0;
  color: black;
  outline: none;
}
.enroll_button {
  position: relative;
  left: 90%;
  border: 0;
  background : #a6a6a6;
  outline: none;
}
</style>
