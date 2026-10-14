export const mazes=[
  ['#######','#.....#','###.#.#','#...#.#','#.###.#','#.....#','#######'],
  ['#######','#.#...#','#.#.#.#','#...#.#','###.#.#','#.....#','#######'],
  ['#######','#...#.#','#.#.#.#','#.#...#','#.###.#','#.....#','#######'],
]
export function nextMazePosition(map:string[],position:number,dx:number,dy:number){
  const x=position%7+dx,y=Math.floor(position/7)+dy
  return y>=0&&y<7&&x>=0&&x<7&&map[y][x]!=='#'?y*7+x:position
}
