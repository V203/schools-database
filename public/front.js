var error = document.querySelector(".error");
var success = document.querySelector(".success");

console.log(error)
// error.style.visibility ="hidden"

let show_error = () => {
    if (error.innerHTML !== "") {
        setTimeout(() => error.classList.add("fade-out") , 3000)


    }
}


let show_success = ()=>{
    if(show_success !== ""){
        setTimeout (()=> success.classList.add("fade-out"), 3000)
        
    }

}

var box = document.querySelector(".box");

setInterval(()=> box.classList.add("fade-out"),3000  )




show_success();
show_error();