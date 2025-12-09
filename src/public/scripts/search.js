const input = document.querySelector(".search")
const elements = document.querySelectorAll(".time, .jogador")
const register = document.querySelector("[class^='register-']")
const registerHeight = register.offsetHeight

console.log(registerHeight)
function filterElement(el) {
    const name = el.querySelector("h3").textContent
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const query = input.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    return !name.includes(query)
}

input.addEventListener("input", () => {
    elements.forEach(el => { el.style.display = "flex" })

    if(input.value == "") return;
    const result = Array.from(elements).filter(filterElement)
    
    result.forEach(el => { el.style.display = "none" })
    if(result.length == elements.length) register.style.height = `${registerHeight}px`
})

/* gambiarra */

if (elements.length == 0) {
    register.style.height = "150px"
}
