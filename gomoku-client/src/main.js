import './style.css'
import Phaser from 'phaser'
import { GameScene } from './scenes/GameScene'

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
  backgroundColor: '#ffffff',
  scene: [GameScene]
}

const game = new Phaser.Game(config)
