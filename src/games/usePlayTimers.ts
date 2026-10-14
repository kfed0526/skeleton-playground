import {useEffect,useRef} from 'react'
export function usePlayTimers(){
  const timers=useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(()=>()=>{timers.current.forEach(clearTimeout);timers.current.clear()},[])
  return (fn:()=>void,ms:number)=>{const timer=setTimeout(()=>{timers.current.delete(timer);fn()},ms);timers.current.add(timer)}
}
