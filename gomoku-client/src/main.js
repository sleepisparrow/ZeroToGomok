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
  const g1 = this.add.graphics()
  const g2 = this.add.graphics()

  g1.fillStyle(0xff0000)  // 빨간색
  g2.fillStyle(0x00ff00)  // 초록색

  g2.fillCircle(0,0,75)   // 초록색
  g1.fillCircle(0,0,100)  // 빨간색

  g2.fillStyle(0x0000ff)  // 파란색
  g2.fillCircle(0,0,50)   // 파란색
}

function update()
{

}


const game = new Phaser.Game(config);

