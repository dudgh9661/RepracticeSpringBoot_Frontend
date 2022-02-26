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
      postsList: [],
      totalElement: 0
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
      let payload = {
        keyword: this.keyword,
        searchType: this.searchType
      }
      this.$emit('searchKeyword', payload)
    }
  }
}
</script>

<style>

</style>