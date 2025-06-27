const WIDTH=1100, HEIGHT=650;
const TYPE_COLOR={1:0x3290ff,2:0xff4646,3:0xffc828,4:0xffd200};
class GameScene extends Phaser.Scene{
  constructor(){super('game');}
  preload(){
    // no assets needed yet
  }
  create(){
    // fill plain background (Phaser handles clear color)
    this.nodes=BOARD_NODES; this.edges=BOARD_EDGES;
    this.boardG=this.add.graphics();
    this.playerG=this.add.graphics();
    this.drawBoard();
    this.players=[
      {name:'P1',color:0x3c78f0,pos:'0',stars:0},
      {name:'P2',color:0xe23c3c,pos:'0',stars:0}
    ];
    this.activeIdx=0;
    this.stepsRemaining=0;
    this.pendingRolls=[];
    this.moving=false;
    this.moveTimer=0;
    this.awaitingChoice=false;
    this.branchOptions=[];
    this.branchIndex=0;
    this.text=this.add.text(10,10,'', {font:'16px sans-serif',color:'#000'});
    this.input.keyboard.on('keydown-SPACE',()=>{
      if(this.awaitingChoice){this.chooseBranch();}
      else if(!this.moving){this.rollDice();}
    });
    this.input.keyboard.on('keydown-LEFT',()=>{if(this.awaitingChoice){this.branchIndex=(this.branchIndex-1+this.branchOptions.length)%this.branchOptions.length;this.updateHUD();}});
    this.input.keyboard.on('keydown-RIGHT',()=>{if(this.awaitingChoice){this.branchIndex=(this.branchIndex+1)%this.branchOptions.length;this.updateHUD();}});
    this.updateHUD();
  }
  drawBoard(){
    const g=this.boardG; g.clear(); g.lineStyle(2,0x000000);
    for(const [u,v] of this.edges){
      const [x1,y1]=this.nodes[u].pos;
      const [x2,y2]=this.nodes[v].pos;
      g.lineBetween(x1,y1,x2,y2);
    }
    for(const id in this.nodes){
      const n=this.nodes[id];
      const [x,y]=n.pos;
      const col=TYPE_COLOR[n.type];
      g.fillStyle(col,1); g.fillCircle(x,y,12);
      g.lineStyle(2,0x000000); g.strokeCircle(x,y,12);
    }
  }
  drawPlayers(){
    const g=this.playerG; g.clear();
    for(let i=0;i<this.players.length;i++){
      const p=this.players[i];
      const [x,y]=this.nodes[p.pos].pos;
      g.fillStyle(p.color,1); g.fillCircle(x,y,10);
      g.lineStyle(2,0x000000); g.strokeCircle(x,y,10);
      if(i===this.activeIdx) g.strokeCircle(x,y,14);
    }
  }
  rollDice(){
    const d1=quantumWalkRoll();
    const d2=quantumWalkRoll();
    this.pendingRolls=[d1,d2];
    this.stepsRemaining=d1+d2;
    this.moving=true; this.moveTimer=0; this.awaitingChoice=false; this.branchOptions=[];
    this.updateHUD();
  }
  movePlayer(){
    if(this.stepsRemaining<=0){this.endMove(); return;}
    const player=this.players[this.activeIdx];
    const succ=this.edges.filter(e=>e[0]==player.pos).map(e=>e[1]);
    if(succ.length==0){this.endMove(); return;}
    if(succ.length==1){
      player.pos=succ[0];
      this.checkStar(player.pos,player);
      this.stepsRemaining--; this.moveTimer=0.5;
    }else{
      this.awaitingChoice=true;
      this.branchOptions=succ; this.branchIndex=0;
      this.updateHUD();
      return;
    }
  }
  chooseBranch(){
    const player=this.players[this.activeIdx];
    player.pos=this.branchOptions[this.branchIndex];
    this.checkStar(player.pos,player);
    this.stepsRemaining--; this.awaitingChoice=false; this.moveTimer=0.5;
    this.updateHUD();
  }
  checkStar(node,player){
    if(this.nodes[node].type==4){
      player.stars++;
      this.nodes[node].type=1;
      const cands=Object.keys(this.nodes).filter(id=>this.nodes[id].type==1 && id!=node);
      const newStar=cands[Math.floor(Math.random()*cands.length)];
      this.nodes[newStar].type=4;
      this.drawBoard();
    }
  }
  endMove(){
    this.moving=false; this.activeIdx=(this.activeIdx+1)%this.players.length;
    this.updateHUD();
  }
  updateHUD(){
    let hud=`Turn: ${this.players[this.activeIdx].name}`;
    if(this.pendingRolls.length) hud+=`  |  Roll: ${this.pendingRolls.join('+')}=${this.stepsRemaining}`;
    hud+=`\n${this.players.map(p=>p.name+': '+p.stars+'*').join('  ')}`;
    if(this.awaitingChoice){
      hud+=`\nChoose path: `+this.branchOptions.map((n,i)=>i==this.branchIndex?`[${n}]`:n).join(' ');
    }
    this.text.setText(hud);
  }
  update(time,dt){
    if(this.moving && !this.awaitingChoice){
      this.moveTimer-=dt/1000;
      if(this.moveTimer<=0){
        this.movePlayer();
      }
    }
    this.drawPlayers();
  }
}
const config={type:Phaser.AUTO,width:WIDTH,height:HEIGHT,backgroundColor:'#ffffff',scene:GameScene};
new Phaser.Game(config);
