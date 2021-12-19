const projectInformation = require("./projectInformation.js");
const contacts = require("./contacts.js");
const codeInformation = require("./codeInformation.js");

data = {};
interval = {};

hideSections = ()=>{
    let sections = document.querySelectorAll("section");

    for(let i = 0; i < sections.length; i++){
        sections[i].style.display = "none";
    }
}

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

document.getElementById("projectInfoForm").onsubmit = ()=>{projectInformation.submit(contacts)};

document.getElementById("addContactButton").onclick = ()=>{contacts.addContact()};
document.getElementById("contactsBack").onclick = ()=>{projectInformation.display()};
document.getElementById("contactsNext").onclick = ()=>{contacts.next(codeInformation)};
document.getElementById("codeInfoBack").onclick = ()=>{contacts.display()};