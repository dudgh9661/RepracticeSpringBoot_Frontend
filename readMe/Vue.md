<h2>LifeCycle Hook</h2>

<h3>beforeCreate</h3> : 인스턴스가 생성되고 가장 처음으로 실행되는 라이프 사이클 단계이다. data, methods 속성이 아직 인스턴스에 정의되어 있지 않고, DOM과 같은 화면 요소에도 접근할 수 없다.

<h3>Created</h3> : data, methods 속성에 접근할 수 있는 가장 첫 라이프 사이클 단계, 때문에 서버에 데이터를 요청하여 받아오는 로직을 수행하기에 좋다.다만, 아직 인스턴스가 화면 요소에 부착되기 전이기 때문에 template 속성에 정의된 DOM 요소에 접근할 수 없다.

<h3>beforeMount</h3> : created 단계 이후 template 속성에 지정한 마크업 속성을 render()함수로 변환한 후 el속성에 지정한 화면요소(DOM)에 인스턴스를 부착하기 **전**에 호출되는 단계. render()함수가 호출되기 직전의 로직을 추가하기 좋다.

> render()는 javaScript로 화면의 DOM을 그리는 함수.

<h3>Mounted</h3> : el속성에서 지정한 화면 요소에 인스턴스가 부착된 직후 호출되는 단계. template 속성에 정의한 화면 요소(DOM)에 접근할 수 있어 화면 요소(DOM)을 제어하는 로직을 수행하기 좋은 단계. 다만, 돔에 인스턴스가 부착되자마자 호출되기 때문에 하위 컴포넌트나 외부 라이브러리에 의해 추가된 화면 요소들이 최종 HTML 코드로 변환되는 시점과 다를 수 있습니다.

> 변환되는 시점이 다를 경우, $nextTick() API를 활용하여 HTML 코드로 최종 파싱(변환)될 때까지 기다린 후 돔 제어 로직을 추가합니다.

<h3>beforeUpdate</h3> : mounted 단계로 인해 화면요소(DOM)에 인스턴스가 부착되고 나면, 인스턴스에 정의한 속성들이 화면에 치환된다. 치환된 값은 Vue의 Reactivity(반응성)을 제공하기 위해 $watch 속성으로 감시한다. 이를 **데이터 관찰**이라고 한다.

> Reactivity of Vue.js : 뷰의 특징 중 하나로, 코드의 변화에 따라 화면이 반사적으로 반응하여 빠르게 화면을 갱신하는 것을 말한다.

**beforUpdate**는 관찰하고 있는 데이터가 변경되면 가상 돔으로 화면을 다시 그리기 전에 호출되는 단계. 변경**예정**인 새 데이터에 접근할 수 있어 변경 예정 데이터의 값과 관련된 로직을 미리 넣을 수 있다. 여기에 값을 변경하는 로직을 새로 넣더라도 화면이 다시 그려지지는 않는다.

<h3>updated</h3> : 데이터가 변경되고 나서 가상 돔으로 다시 화면을 그리고 나면, 실행되는 단계. 데이터 변경으로 인한 화면 요소 변경까지 완료된 시점이므로, 데이터 변경 후 **화면 요소 제어와 관련된 로직**을 추가하지 좋은 단계.

> 이 단계에서 데이터 값을 변경하면 무한루프에 빠질 수 있기 때문에 값을 변경하려면 computed, watch와 같은 속성을 사용해야 한다. 따라서, 데이터 값을 갱신하는 로직은 가급적 beforeUpdate에 추가하고, updated에서는 **변경 데이터의 화면요소(DOM)와 관련된 로직을 추가하는 것이 좋다.**

> mounted 단계와 마찬가지로 하위 컴포넌트의 화면요소와 외부 라이브러리에 의해 주입된 요소의 최종 변환 시점이 다를 수 있다. $nextTick()을 사용하여 변환이 완료될 때까지 기다렸다가 로직을 추가하도록 한다.

<h3>beforeDestroy</h3> : Vue Instance가 파괴되기 직전에 호출되는 단계. 이 단계에서 **아직 인스턴스에 접근할 수 있다.** 따라서, Vue Instance의 데이터를 삭제하기 좋은 단계.

<h3>destroyed</h3> : Vue Instance가 파괴되고 나서 호출되는 단계. Vue Instance에 정의한 모든 속성이 제거되고, 하위에 선언한 인스턴스들 또한 모두 파괴된다.

------


**JavaScipt**
```
new Vue({ 
  el: "#app", 
  data: {
    count: 0,
    secondCount: 0 // computed, method 안에 없는 변수이다.
  },
  computed: {
    double: function () {
      console.log('Computed double')
      return this.count * 2
    }
  },
  methods: {
    triple: function () {
      console.log('methods triple')
      return this.count * 3
    }
  }
})
```

**HTML**

```
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<div id="app">
  <p>count: {{ count }}</p>
  <p>second count: {{ secondCount }}</p>
  <p>computed: {{ double }}</p>
  <p>methods: {{ triple() }}</p>
  <button v-on:click="count ++">클릭</button>
  <button v-on:click="secondCount ++">클릭</button>
</div>
```

- count 증가 버튼 클릭 시, computed && method 둘 다 호출

- secondCount 증가 버튼 클릭 시, method만 호출

> 즉 **computed**는 data안의 ***관련된 데이터의 변화***에만 실행이 되는 반면에, **method**는 data 안에 있는 ***관련이 없는 데이터의 변화***에도 매번 실행된다.
