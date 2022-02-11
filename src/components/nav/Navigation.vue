<template>
  <div>
    <b-navbar sticky type="dark" variant="success">
      <b-navbar-brand><b-icon icon="emoji-smile-fill" animation="cylon"></b-icon>&nbsp;&nbsp;&nbsp;Board Project</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/">Home</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav>
        <div>
          <b-form-select v-model="searchType" :options="options" size="sm" class="mr-2"></b-form-select>
        </div>
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="keyword">{{keyword}}</b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit" @click="clickSearch"><b-icon icon="search"></b-icon></b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      searchType: 'title',
      keyword: '',
      options: [
        { value: 'title', text: '제목'},
        { value: 'content', text: '내용'},
        { value: 'author', text: '작성자'}
      ],
      postsList: []
    }
  },
  methods: {
    clickSearch (event) {
      event.preventDefault()
      console.log('clickSearch() 실행')
      let vueThis = this
      if (this.$utils.isEmpty(this.keyword)) {
        vueThis.$alert('검색어를 입력해주세요')
        return
      }

      this.$axios.get('http://localhost:8080/api/v1/posts/search?' + 'searchType=' + this.searchType + '&keyword=' + this.keyword)
      .then( response => {
        console.log('clicksearch data : ', response)
        this.postsList = response.data
        vueThis.$emit('searchPost', this.postsList)
      }).catch( error => {
        console.log('clickSearch() 작동 실패 ', error)
        vueThis.$alert('검색에 실패했습니다. 관리자에게 문의해주세요.')
      })
    }
  }
}
</script>

<style>

</style>