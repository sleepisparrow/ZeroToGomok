#javascript #class #기본_개념 

## 정의
class는 특별한 함수 
두가지 방법으로 생성 가능 : `정의(Declaration)`와 `표현(Expression)`
```JS
// Declaration
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

// Expression; the class is anonymous but assigned to a variable
const Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};

// Expression; the class has its own name
const Rectangle = class Rectangle2 {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};
```

## 구성요소들
공식 문서에 따르면 class element는 세가지 특징으로 구분이 가능하다고 한다.:
- Kind: [[#Getter&Setter]],  [[#Method]], [[#Field]]
- Location: [[#Static]], [[#Instance]]
- Visibility: [[#Public]], [[#Private]]
이 밑에서는 구성 요소들의 사용법만 적어두고, 정의는 적지 않겠다 (다 아니까)

### Kind
#### Getter & Setter
```JS
class User {
    constructor() {
        this._v = 1
    }
    
    get v() {
        console.log("getter called")
        return this._v
    }
    
    set v(x) {
	    console.log("setter called")
	    this._v = x 
    }
}


let x = new User()
console.log(x.v) // 이러면 getter가 실행된다.
x.v = 3          // 이러면 setter가 실행된다. 
// 추가적으로, getter 이름을 프로퍼티랑 같게 지으면 에러난다.
// 이 이유는 이름이 같으면, 자기 자신을 무한히 재귀적으로 실행될 수 있기 때문이다.
```
#### Setter
```JS
class User {
    constructor() {
        this._v = 1
    }
    
    set v() {
        console.log("getter called")
        return this._v
    }
}


let x = new User()
x.v = 2
// 이러면 setter가 실행된다.
// 마찬가지로, setter 이름을 프로퍼티랑 같게 지으면 에러난다.
// 이유는 이름이 같으면, 자기 자신을 무한히 재귀적으로 실행될 수 있기 때문이다.
```
#### Method
```js
const obj = {
  foo() {
    return "bar";
  },
};

console.log(obj.foo());
// Expected output: "bar"

```
여기서 주의해야 할 점은 method는 함수와는 달리, 독립적인 요소가 아니라는 것이다. method는 객체의 [[prototype]] 에 만들어지기 때문에, this가 있다는 전제 하에 만들어지고, 따로 떼어내서 쓸 수 없다. 
```js
// method
obj.prototype.foo = function () {}

// function
obj.foo = function () {}
```
#### Field
```js
class C {
    instance = 1
}
 

console.log(new C().instance)  // out: 1
```

와! 다른 평범한 언어들처럼 되는걸 처음 알았다.

### Location
#### Static
#### Instance


### Visibility
#### Public
#### Private

## 궁금증들
1. 이름이 정의돈 Expression은 다른 데에서도 쓰일 수 있을까?
```JS
const x = class C { }

  

const y = new C()
// -----output-----
// ReferenceError: C is not defined
// ...
```
당연하다면, 당연히도, 안 되었다..

2. 같은 이름의 class 가 여러개 있을 수 있을까?
```JS
class A { }  

class A { } // SyntaxError! Identifier 'A' has already been declared
{
    class A { } // No Error!
}
```
let이나 const와 같이 동작하는 듯하다. (참고로 js에선 class keyword도 [[Hoisting]]을 하는데, `let`이나 `const`와 같이 동작한다고 한다 //TDM을 가진다는 뜻)

3. 그럼 this 테크닉을 이용하면 다른 객체처럼 바꿔쓰는게 될까?
생각해보니 당연히 될 거 같긴 한데 궁금하니 해보자.
```JS
class A {
    constructor() {
        this.v = 'A'
    }
    
    print() {
        console.log(this.v)
    }
}

class B {
    constructor() {
        this.v = 'B'
    }

    print() {
        console.log(this.v)
    }
}

  

let x = new A()

x.print.call(new B())
// ----- output -----
// B
```
당연하게도 된다. 근데 내가 이 코드를 짜면서 bind와 call의 사용법을 잘 기억해내지 못하였다. 이걸 다시 공부하는 문서를 짜자. [[Bind, Call, Apply]]
