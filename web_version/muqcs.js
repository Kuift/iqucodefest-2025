// Minimal muqcs.js subset used for quantum dice
class QuantumCircuit {
  constructor(n){
    this.n=n;
    this.state=new Array(1<<n).fill(0);
    this.state[0]=1;
  }
  h(q){
    const step=1<<(this.n-1-q);
    for(let i=0;i<this.state.length;i+=step*2){
      for(let j=0;j<step;j++){
        const a=this.state[i+j];
        const b=this.state[i+j+step];
        this.state[i+j]=(a+b)/Math.sqrt(2);
        this.state[i+j+step]=(a-b)/Math.sqrt(2);
      }
    }
  }
  measureBits(bits){
    const probs={};
    let total=0;
    for(let i=0;i<this.state.length;i++){
      let key="";
      for(const b of bits){ key+=((i>>(this.n-1-b))&1); }
      const p=this.state[i]*this.state[i];
      probs[key]=(probs[key]||0)+p; total+=p;
    }
    let r=Math.random()*total,c=0;
    for(const [k,v] of Object.entries(probs)){
      c+=v; if(r<c) return k;
    }
    return bits.map(()=>0).join('');
  }
}
function quantumWalkRoll(){
  while(true){
    const qc=new QuantumCircuit(3);
    qc.h(0); qc.h(1); qc.h(2);
    const bits=qc.measureBits([0,1,2]);
    const val=parseInt(bits,2);
    if(val<6) return val+1;
  }
}
