cmd에 이걸 입력하면 vite로 프로젝트가 생성된다.
`npm create vite@latest gomoku-client -- --template vanilla`

https://phaser.io/tutorials/making-your-first-phaser-3-game/part1
이걸 따라하면서 내가 궁금한 점들, 알게 된 점들을 적어 내려갈 생각이다.

1. config에 들어갈 수 있는 것들
	   https://docs.phaser.io/api-documentation/class/core-config 이거 참고
```js
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	scene: {
        preload: preload,
        create: create,
        update: update
    }
}
```

- 기본적으로 type는 AUTO를 추천한다고 한다. AUTO의 경우, WebGL을 먼저 시도했다가 안되는 경우 Canvas를 실행한다고 나온다. (Phaser.WebGL, Phaser.Canvas도 있다)
- width랑 height는 뭐 알다시피 크기이다.
## Scene
### preload vs create

|           | Preload           | Create                       |
| --------- | ----------------- | ---------------------------- |
| 어떨 때 쓰는가? | 외부에서 자료 가져올 떄 쓴다. | 자료 가져오는 걸 제외한 처음 생성될 것들을 한다. |
Preload 예시:
```javascript
function preload ()
{
	// 나머지 애들은 그냥 이미지를 로드한것
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    // 밑의 것은 여러개의 이미지를 하나의 이미지로 두고, 자른 거
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}
```
### Create에서 이미지 로드할때
html의 위치를 기준으로 상대 좌표를 생각해야 하는 것 같다. js파일을 기준으로 했더니 안 보였다. 실제 코딩을 할 때에는 절대 주소로 하는 것을 진지하게 생각해보아야지
참고로 이미지를 불러올 때 이런 식으로 하면 된다.
```js
//위의 코드에서 sky로 지정한 애를 가져온다.
this.add.image(400, 300, 'sky')  // 그리고 이미지의 좌표는 중앙을 기준으로 한다.

this.add.image(0, 0, 'sky').setOrigin(0,0) // 이러면 좌표기준이 0,0(왼쪽 위)가 된다.
// originX, originY라는 속성을 통해서 바꿀 수도 있는듯?
```


## ChatGPT - 보드 만들기
어... 공부 하다 보니 지루하고 현타가 와서 그냥 바로 보드 만들기에 들어갔다.
```js
import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#ffffff",
  scene: {
        preload: preload,
        create: create,
        update: update
    }
}

function preload ()
{
}


const BOARD_SIZE = 19
const CELL_SIZE = 30
const OFFSET = 30
const RADIUS_OF_HWAJUM = 5

function create()
{
  // 설정
  const graphics = this.add.graphics()
  graphics.lineStyle(1, 0x000000, 1)
  graphics.fillStyle(0x000000)
  
  // 줄 긋기
  const lineEnd = OFFSET + (BOARD_SIZE-1) * CELL_SIZE
  const lineStart = OFFSET
  for (let i = 0; i < BOARD_SIZE; i++) {
    const linePos = OFFSET + i * CELL_SIZE

    // 세로줄
    graphics.lineBetween(
      linePos, lineStart,
      linePos, lineEnd
    )

    // 가로줄
    graphics.lineBetween(
      lineStart, linePos,
      lineEnd, linePos
    )
  }

  // 화점 만들기
  for (let i = 0; i < 3; i++) {
    // y 좌표 구하기
    const yLoc = OFFSET + (2 * i + 1) * 3 * CELL_SIZE
    for (let j = 0; j < 3; j++) {
      // x 좌표 구하기
      const xLoc = OFFSET + (2 * j + 1) * 3 * CELL_SIZE

      // 점 찍기
      graphics.fillCircle(xLoc, yLoc, RADIUS_OF_HWAJUM)
    }
  }
}

function update()
{

}


const game = new Phaser.Game(config);
```

여기서 중요한 것은 제일 위의 설정 부분이다. 
- 선을 그을때나 fill뭐시기를 그릴 때나 `graphics.fillStyle(0x000000)` 와 같이 세팅을 미리 해 두어야 한다. 안 그러면 뭘 해도 그냥 안 보인다.
- `graphics.fillStyle(0x000000)`를 하게 되면 그 다음부터 draw되는 거는 그것을 따른다.
- 나머지 코드는 읽으면 이해할 거라 굳이 추가글을 쓰진 않겠다.
### 궁금증
#### 1. 여러개의 Graphics를 만들게 되면 어떤 일이 생길까?
```js
const g1 = this.add.graphics()
const g2 = this.add.graphcis()

// ... 밑에 설정 하는 코드들
```
이렇게 되면 반드시 g1이 먼저 렌더링 되고 g2가 렌더링 된다.
#### 2. 그럼 같은 Graphics에서는 어떻게 될까?
간단하다. 먼저 읽힌게 먼저 그려진다.

1, 2를 확인하기 위한 확인용 코드

```js
const g1 = this.add.graphics()
  const g2 = this.add.graphics()

  g2.fillStyle(0x00ff00)  // 초록색
  g1.fillStyle(0xff0000)  // 빨간색

  g2.fillCircle(0,0,75)   // 초록색
  g1.fillCircle(0,0,100)  // 빨간색

  g2.fillStyle(0x0000ff)  // 파란색
  g2.fillCircle(0,0,50)   // 파란색
```
![[Pasted image 20260102224300.png]]
- 이걸 보면 알 수 있다시피 g2의 파란색 원이 g2의 초록색 원보다 코드상으로 나중에 그려져 위에 올라가 있는 모습이 보인다. 
- 빨간색이 코드상으로는 나중에 그려졌음에도 g1이 먼저 렌더링이 되었으므로, 빨간색이 밑에 있는 모습이 보인다.

#### Scene.add.xxx ?
공식 문서에 따르면 [Scene.add](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html)는 팩토리로, 게임 오브젝트들을 생성하고, 화면에 표시해주는 것을 추가하는 displayList라는 곳에 게임 오브젝트들을 넣어주는 객체이다. displayList는 큐로 되어 있어서, 먼저 들어가는 것을 먼저 렌더링한다.
그래서, 방금 위의 질문에서 g2가 먼저 읽혀도 g1보다 나중에 렌더링 되는 것이다.
