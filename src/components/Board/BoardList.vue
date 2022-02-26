<template>
  <div>
    <navigation @searchKeyword="getSearchResult"> </navigation>
    <b-table
      fixed
      responsive
      :items="postsList"
      :fields="fields"
      hover
      @row-clicked="onClick"
      id="my-table"
      small
    >
      <template #table-colgroup="scope">
        <col 
          v-for="field in scope.fields"
          :key="field.key"
          :style="getCss(field.key)"
        />
      </template>
      <template #cell(update)="row">
        <b-button
          size="sm"
          style="background: #006400; border: 0; outline: 0"
          :to="{ name: 'BoardUpdate', params: { id: row.item.id } }"
          >게시물 수정</b-button
        >
      </template>
    </b-table>
    <div>
      <b-button class="enroll_button" href="/enroll">게시물 등록</b-button>
    </div>
    <div>
      <b-pagination
        class="pagination"
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
        { key: "id", label: "번호", class: 'text-center'},
        { key: "title", label: "제목", class: 'text-center'},
        { key: "author", label: "작성자", class: 'text-center'},
        { key: "createdDate", label: "작성일", class: 'text-center'},
        { key: "liked", label: "좋아요", class: 'text-center'},
        { key: "viewCount", label: "조회수", class: 'text-center'},
        { key: "update", label: "", class: 'text-center'},
      ],

      postsList: [],
      perPage: 10,
      currentPage: 1,
      totalElement: 0,
      keyword: "",
      searchType: "",
    };
  },
  computed: {
    rows() {
      return this.totalElement;
    },
  },
  watch: {
    currentPage(newVal) {
      this.postsList = [];
      console.log("currentPage ::: ", this.currentPage);
      if (!this.$utils.isEmpty(this.keyword)) {
        console.log('keyword Search In BoardList.vue')
        let payload = {
          keyword: this.keyword,
          searchType: this.searchType,
        };
        this.getSearchResult(payload);
      } else {
        console.log('Search In BoardList.vue')
        this.$axios
          .get(this.$url + `/api/v1/posts/page/${newVal - 1}`, {
            // headers: { 'Content-Type': 'application/json' }
          })
          .then((response) => {
            // this.postsList = response.data;
            let data = response.data;
            console.log(
              "Changed currentPage In BoardList.vue watch() ::: ",
              data
            );
            this.postsList = data.postsList;
            this.postsList.forEach((item) => {
              item.createdDate = this.$utils.getDateFormat(item.createdDate);
            });
          });
      }
    },
  },
  created() {
    this.$axios
      .get(this.$url + `/api/v1/posts/page/${this.currentPage - 1}`, {
        // headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => {
        // this.postsList = response.data;
        let data = response.data;
        console.log("response data In BoardList.vue created() ::: ", data);
        this.postsList = data.postsList;
        this.totalElement = data.totalElement;

        this.postsList.forEach((item) => {
          item.createdDate = this.$utils.getDateFormat(item.createdDate);
        });
        console.log("BoardList.vue created() ::::", response);
      });
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
      let vueThis = this;
      this.keyword = payload.keyword;
      this.searchType = payload.searchType;

      this.$axios
        .get(
          this.$url +
            `/api/v1/posts/page/${this.currentPage - 1}/search?searchType=${
              this.searchType
            }&keyword=${this.keyword}`
        )
        .then((response) => {
          console.log("clicksearch data : ", response);
          let data = response.data; // 응답받은 data Object
          console.log("keyword 검색 결과 ::: ", data);
          this.postsList = data.postsList;
          this.totalElement = data.totalElement;

          this.postsList.forEach((item) => {
            item.createdDate = this.$utils.getDateFormat(item.createdDate);
          });
          console.log("BoardList.vue getSearchResult() ::::", response);
        })
        .catch((error) => {
          console.log("clickSearch() 작동 실패 ", error);
          vueThis.$alert("검색에 실패했습니다. 관리자에게 문의해주세요.");
        });
    },
    getCss(key) {
      let css = {
        width: "",
      };
      if (key === "id") {
        css.width = "10%";
      } else if (key === "title") {
        css.width = "30%";
      } else if (key === "author") {
        css.width = "20%";
      } else if (key === "createdDate") {
        css.width = "15%";
      } else if (key === "liked") {
        css.width = "5%";
      } else if (key === "update") {
        css.width = "10%";
      } else if (key === "viewCount") {
        css.width = "8%"
      }
      return css;
    },
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
  background: #a6a6a6;
  outline: none;
}
</style>
