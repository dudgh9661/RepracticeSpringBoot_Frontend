<template>
  <div>
    <b-table striped hover @row-clicked="onClick" :items="postsList" :fields="fields">
      <template #cell(update)="row">
        <b-button size="sm" variant="primary" :to="{ name : 'BoardUpdate', params: { id : row.item.id }}">게시물 수정</b-button>
      </template>
    </b-table>
    <div style="float:right;" class="mr-5"><b-button href="/enroll">게시물 등록</b-button></div>
  </div>
</template>

<script>
  import utils from '@/utils/utils.js'
  
  export default {
    name: 'Board',
    data() {
      return {
        sortBy: 'id',
        sortDesc: false,
        fields: [
          { key: 'id', label: '게시물 번호'}, 
          { key: 'title', label: '제목'}, 
          { key: 'author', label: '작성자'},
          { key: 'modifiedDate', label: '최종 수정날짜'},
          { key: 'update', label: '' }
        ],
        postsList: []
      }
    },
    created () {
        this.$axios.get('http://localhost:8080/api/v1/posts', {
            // headers: { 'Content-Type': 'application/json' }
        }).then( response => {
            this.postsList = response.data
            this.postsList.forEach( (item) => {
              item.modifiedDate = utils.getDateFormat(item.modifiedDate)
            }) 
            console.log('res ::::', this.postsList)
        })
    },
    methods: {
      onClick (item) {
        let id = item.id
        //1. id를 '/board' url로 넘겨준다.
        console.log('onClick 함수 호출')
        window.location.href = `http://localhost:8081/board/${id}`
      }
    }
  }
</script>