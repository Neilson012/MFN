const navbar = document.querySelector("nav")

function setFullSize() {
    let container = document.querySelector(".h-screen")
    if (!navbar) {
        container.style.height = "100vh"
        return
    };
    container.style.height = `calc(100vh - ${navbar.offsetHeight}px)`
}

setFullSize()

window.addEventListener('resize', () => {
    setFullSize()
});

// alert

const urlParams = new URLSearchParams(window.location.search);

const msg = urlParams.get("msg")
const msgStatus = urlParams.get("status") || "error"

if(msg) {
    const alert = document.createElement("div");
    
    alert.classList.add("alert", "enter", msgStatus);
    alert.textContent = msg;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove("enter");
        alert.classList.add("leave");
    }, 2000);
}
