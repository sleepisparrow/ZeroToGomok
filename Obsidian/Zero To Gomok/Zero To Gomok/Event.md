#javascript

## 1. Event란 
정의: 웹에서 일어나는 사건
특정 사건이 발생하면, 지정된 특정 행동을 취한다.
~~추측건대 함수 포인터를 이용한 Callback 구조인 거 같다.~~

```HTML
<body>
	<input type="button" value="hi" onclick="alert('hi')">
```
이에 대응하기 위해서 우리는 EventListener를 만든다. 

```js
const btn = document.querySelector("button"); 
// querySelector()는 <str> 항목을 가진 애중 제일 위에 있는 것을 반환한다.

function random(number) { 
	return Math.floor(Math.random() * (number + 1)); 
} 

btn.addEventListener(
	"click", 
	() => { 
		const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`; 
		document.body.style.backgroundColor = rndCol; 
	}	//평범한 lambda다.
);
```
이때 같은 객체에 같은 eventlistener를 넣어도 된다. (넣은 순서에 따라 작동한다고 한다.) 
반대로 EventListener를 없앨 때에는 `removeEventListener("이벤트str", <function>);` 하면 된다.

