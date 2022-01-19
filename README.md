## 프로젝트 목표

  1. Spring Boot Framework의 동작원리 이해를 기반으로, WEB의 기본 동작인 CRUD를 구현할 수 있다.
  2. 객체 지향의 특성을 살려 Backend를 구축할 수 있다.
  3. Controller Layer, Service Layer, Domain Layer의 역할을 이해하고 JPA를 이용해 DB를 조작할 수 있다.
  4. Vue를 이용하여 Frontend를 구축할 수 있고 Spring Boot로 구축한 Server와 통신할 수 있다.
  
---
+ 구현해야 할 것들
  + 게시글 
    + CRUD V
    + 파일 업로드 V
    + 댓글 V
    + 대댓글 V
    + 추천
    + 조회수 카운팅
  + 페이징
  + 게시글 검색
  + 공지사항
  + 정렬(추천별, 조회수별)

### 프로젝트 구조
```
frontend/src
    ├── App.vue
    ├── components
    │   └── Board
    │       ├── Board.vue
    │       ├── BoardEnroll.vue
    │       ├── BoardList.vue
    │       ├── BoardUpdate.vue
    │       ├── CommentDelete.vue
    │       ├── CommentEnroll.vue
    │       ├── Comments.vue
    │       └── nestedComment.vue
    ├── main.js
    ├── router
    │   └── index.js
    ├── utils
    │   └── utils.js
    └── views
        └── Main.vue
```
