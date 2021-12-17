const profile = require("./profile.js");
const userSearch = require("./userSearch.js");

controller = {
    pages: document.querySelectorAll(".page"),
    banner: document.getElementById("banner"),

    changePage: function(page){
        for(let i = 0; i < this.pages.length; i++){
            this.pages[i].style.display = "none";
        }

        document.getElementById(page).style.display = "flex";
    },

    createBanner(text, type){
        this.banner.children[0].innerText = text;
        this.banner.classList.add(`${type}Banner`);
        this.banner.style.display = "block";

        setTimeout(()=>{
            this.banner.classList.remove(`${type}Banner`);
            this.banner.style.display = "none";
        }, 10000)
    }
}

//Main
document.getElementById("editAccountBtn").onclick = ()=>{controller.changePage("editAccount")};
document.getElementById("searchUsersBtn").onclick = ()=>{controller.changePage("searchUsers")};
//Profile
document.getElementById("eaSave").onclick = ()=>{profile.save()};
document.getElementById("eaBack").onclick = ()=>{controller.changePage("main")};
//Search Users
document.getElementById("userSearch").onkeyup = (event)=>{if(event.keyCode === 13) userSearch.search()};
document.getElementById("userSearchBtn").onclick =  ()=>{userSearch.search()};
document.getElementById("suBack").onclick = ()=>{controller.changePage("main")};