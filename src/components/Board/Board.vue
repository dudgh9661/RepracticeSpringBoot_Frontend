<template>
  <div>
    <div class="layout_content">
      <div class="board_wrap">
        <div class="BoardContentBox">
          <div class="board_header">
            <div class="BoardTitle">
              <div class="title_area">
                <h3 class="title_text">{{boardData.title}}</h3>
              </div>
            </div>
            <div class="WriterInfo">
              <div class="profile_area">
                <div class="profile_info">
                  <div class="nick_box">
                    <span class="nickname">{{boardData.author}}</span>
                  </div>
                  <div class="board_info">
                    <span class="date">{{boardData.date}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="board_container">
            <div class="article_viewer">
              <div class="content boardViewer">
                <div class="se-viewer">
                  <div class="se-main-container">
                    <div
                      class="se-component se-image"
                      v-for="(fileUrl, idx) in filesUrl"
                      :key="idx"
                    >
                      <div
                        class="se-component-content se-component-content-extend"
                      >
                        <div
                          class="se-section se-section-image se-section-align-"
                        >
                          <b-img
                            class="se-moudle-image-link __se_image_link __se_link"
                            :height="300"
                            :witdth="300"
                            fulid
                            :src="fileUrl.href"
                          ></b-img>
                        </div>
                      </div>
                    </div>
                    <div class="se-component se-text">
                      <div class="se-component-content">
                        <div class="se-section se-section-text">
                          {{boardData.content}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="AttachFileIssueLayer" style="display: none;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="files.length > 0" class="mt-3">
      업로드된 파일
      <div v-for="(file, idx) in files" :key="idx">
        <b>{{file.originFileName}}</b>
        <span
          :class="isHovered[idx] ? 'text-primary' : ''"
          @mouseover="handleHover(idx,true)"
          @mouseleave="handleHover(idx,false)"
          @click="download(file)"
        >
          다운로드
        </span>
      </div>
    </div>
    <Comments :postId="this.boardId"></Comments>
    <b-button href="/">홈으로</b-button>
  </div>
</template>

<script>

import Comments from './Comments.vue'
export default {
  components: { Comments },

  data () {
      return {
        boardId: this.$route.params.id,
        boardData: {},
        files: [],
        filesUrl: [],
        isHovered: []
      }
  },
  created () {
        this.id = this.$route.params.id
        this.$axios.get(this.$url + `/api/v1/posts/${this.boardId}`, {
        }).then( res => {
            this.boardData = res.data
            this.boardData.date = this.$utils.getDateFormat(res.data.date)
            this.files = this.boardData.files
            for (let i = 0; i < this.files.length; i++) {
              this.$set(this.isHovered, i, false)
            }
            console.log('get posts data ::: ', this.$data)
            console.log('uploaded files ::: ', this.files)
            // get file src URL
            for (let i = 0; i < this.files.length; i++) {
              this.$axios.get(this.$url + `/api/v1/posts/download/${this.files[i].id}`, {
                responseType: 'blob'
              }).then( res => {
                let blob = new Blob([res.data], {type: res.headers['content-type']})
                console.log('파일 데이터 받아오기 성공 ::: ', blob)
                // file download 링크 생성
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                this.filesUrl.push(link)
                window.URL.revokeObjectURL(blob)
              }).catch(  error =>  {
                console.log('파일 이미지 불러오기 실패 ::: ', error)
                alert('파일 이미지 불러오기를 실패했습니다. 다시 시도해주세요.')
            })
        }
        console.log('filesUrl ::: ', this.filesUrl)
        }).catch( error => {
            console.log('게시물을 불러오지 못했습니다.', error)
        })
    },
    methods: {
      /*
       * 함수명 : download
       * 설명 : 파일 다운로드를 실행한다.
      */
      download (file) {
          let fileName = file.originFileName
          let link = this.filesUrl[this.files.indexOf(file)]
          link.target = '_self'
          link.download = fileName
          link.click()
          link.remove()
      },
      /*
       * 함수명 : handleHover
       * 설명 : 파일 다운로드 text에 hover를 각각 적용한다.
      */
      handleHover(idx, active) {
        this.$set(this.isHovered, idx, active)
      }
    }
}
</script>
<style scoped>
.layout_content {
  width: 860px;
  margin: 0 auto;
  background-color: var(--skinColor);
  font-size: 13px;
}
.board_wrap {
  position: relative;
  width: 860px;
  margin: 0 auto;
  font-size: 12px;
}
.BoardContentBox {
  padding: 29px 29px 0;
  border: 1px solid #ebecef;
  border-radius: 6px;
}
.board_header {
  position: relative;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebecef;
}
.BoardTitle {
  margin-bottom: 12px;
  font-size: 13px;
}
.BoardTitle .title_area {
  margin-top: 7px;
}
.title_text {
  font-weight: 400;
  font-size: 26px;
  word-break: break-all;
  word-wrap: break-word;
  word-break: break-word;
}
.BoardTitle .title_area:after {
  content: "";
  display: block;
  clear: both;
}
div {
  display: block;
}
.profile_area {
  float: left;
}
.profile_area .profile_info {
  margin-bottom: 6px;
}
.nick_box {
  display: inline-block;
  position: relative;
  vertical-align: top;
}
.nick_box .nickname {
  margin-right: 6px;
  font-size: 13px;
  font-weight: 700;
  color: chartreuse;
}
.board_info {
  font-size: 12px;
  line-height: 13px;
  color: #979797;
}
.date {
  margin-right: 8px;
}
.WriterInfo:after {
  content: "";
  display: block;
  clear: both;
}
.se-viewer {
  line-height: 1;
}
.BoardViewer .se-viewer {
  background: transparent;
}
.se-main-container,
.se-viewer div {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 12px;
  font: inherit;
  vertical-align: baseline;
}
.se-viewer .se-text {
  margin-top: 20px;
  margin-top: 30px;
}
.se-viewer .se-component {
  position: relative;
}
.BoardViewer .se-viewer .se-component-content {
  padding-right: 0;
  padding-left: 0;
}
.se-viewer .se-component-content {
  margin: 0;
  max-width: 640px;
  max-width: 700px;
  padding-right: 20px;
  padding-left: 5px;
}
.BoardViewer .se-viewer .se-caption,
.BoardViewer .se-viewer .se-component-content,
.BoardViewer .se-viewer .se-component-content.se-component-content-fit {
  max-width: 800px;
}
.se-viewer .se-section-text:after {
  display: block;
  content: "";
  clear: both;
  margin: 50px;
}
.BoardViewer .se-viewer .se-image,
.BoardViewer .se-viewer .se-imageGroup,
.BoardViewer .se-viewer .se-sticker {
  margin-top: 30px;
}
.se-viewer .se-image {
  margin-top: 20px;
  margin-top: 30px;
}
.BoardViewer .se-viewer .se-caption,
.BoardViewer .se-viewer .se-component-content,
.BoardViewer .se-viewer .se-component-content.se-component-content-fit {
  max-width: 800px;
}
.se-viewer .se-component-content.se-component-content-extend {
  padding-right: 0;
  padding-left: 0;
  max-width: 860px;
}
.se-viewer .se-image .se-module-image,
.se-viewer .se-module-image-link {
  position: relative;
  display: block;
}
.se-viewer a {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 12px;
  font: inherit;
  vertical-align: baseline;
}
.se-component-content .se-section-text {
  
  /* font-weight: 400; */
  font-size: 25px;
  /* word-break: break-all; */
  /* word-wrap: break-word; */
  /* word-break: break-word; */
}
</style>
