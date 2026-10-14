import {expect,it} from 'vitest'
import {mazes,nextMazePosition} from './maze'
it('all maze squares and the castle are reachable from the entrance',()=>{
  for(const map of mazes){expect(map).toHaveLength(7);map.forEach(row=>expect(row).toHaveLength(7));const visited=new Set([8]),queue=[8];while(queue.length){const p=queue.shift()!;for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){const n=nextMazePosition(map,p,dx,dy);if(!visited.has(n)){visited.add(n);queue.push(n)}}}expect(visited.has(40)).toBe(true);expect(visited.size).toBe(map.join('').split('').filter(c=>c==='.').length);expect(nextMazePosition(map,8,-1,0)).toBe(8);expect(nextMazePosition(map,8,0,-1)).toBe(8)}
})
