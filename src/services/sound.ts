class Sound {
  context:AudioContext|null=null
  muted=false
  interval:ReturnType<typeof setInterval>|null=null
  nodes=new Set<OscillatorNode>()
  constructor(){try{this.muted=localStorage.getItem('skeleton-muted')==='true'}catch{};document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop()})}
  unlock(){try{this.context??=new AudioContext();void this.context.resume().catch(()=>{})}catch{}}
  mute(value:boolean){this.muted=value;try{localStorage.setItem('skeleton-muted',String(value))}catch{};if(value){for(const o of this.nodes){try{o.stop()}catch{}}this.nodes.clear();void this.context?.suspend().catch(()=>{})}}
  tone(frequency:number,duration=.15,delay=0){if(this.muted||document.hidden)return;this.unlock();if(!this.context)return;try{const c=this.context,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type='triangle';o.frequency.value=frequency;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.09,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.start(t);o.stop(t+duration+.02);this.nodes.add(o);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect()}}catch{}}
  effect(kind:'pop'|'roll'|'spark'|'change'){({pop:[780,1100],roll:[130,190,260],spark:[523,659,784,1047],change:[659,880]}[kind]).forEach((f,i)=>this.tone(f,.15,i*.09))}
  dance(){this.stop();let beat=0;const next=()=>{const melody=[523,622,784,622,587,698,831,698];this.tone(melody[beat++%melody.length],.24)};next();this.interval=setInterval(next,400)}
  stop(){if(this.interval)clearInterval(this.interval);this.interval=null;for(const o of this.nodes){try{o.stop()}catch{}}this.nodes.clear();void this.context?.suspend().catch(()=>{})}
}
export const sound=new Sound()
