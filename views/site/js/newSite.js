const projectInformation = require("./projectInformation.js");

data = {};
interval = {};

showBanner = (message, type)=>{
    let banner = document.getElementById("banner");

    banner.style.display = "flex";
    banner.children[0].innerText = message;
    
    if(type === "error" || type === "warning" || type === "success"){
        banner.classList.add(`${type}Banner`);

        setTimeout(()=>{
            banner.style.display = "none";
            banner.children[0].innerText = "";
        }, 10000);
    }else if(type === "awaiting"){
        banner.classList.add("successBanner");
        let counter = ".";

        interval = setInterval(()=>{
            banner.children[0].innerText = `${message}${counter}`;

            counter = (counter.length >= 10) ? "." : `${counter}.`;
        }, 500);
    }
}

document.getElementById("projectInfoForm").onsubmit = ()=>{
    event.preventDefault();
    projectInformation();
    
}