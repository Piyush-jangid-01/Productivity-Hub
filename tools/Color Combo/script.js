let boxes = document.querySelector(".container").children
const btn = document.getElementById("btn");

function randomColor(){
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return `rgb(${r} ${g} ${b})`;
}

btn.addEventListener("click", () => {
  Array.from(boxes).forEach(e => {
  e.style.backgroundColor = randomColor();
  e.style.color = randomColor();
 })
});
