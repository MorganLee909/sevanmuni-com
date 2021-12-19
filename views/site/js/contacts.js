module.exports = {
    display: function(addresses){
        hideSections();
        document.getElementById("contacts").style.display = "flex";
    },

    addContact: function(){
        let container = document.getElementById("contactsContainer");
        let template = document.getElementById("contactTemplate").content.children[0];

        let contact = template.cloneNode(true);
        container.appendChild(contact);
    },

    next: function(nextPage){
        let contacts = document.getElementById("contactsContainer").children;
        let contactsTemp = [];

        for(let i = 0; i < contacts.length; i++){
            let phone = contacts[i].querySelector(".contactPhone").value;
            let email = contacts[i].querySelector(".contactEmail").value;

            if(phone === "" && email === ""){
                showBanner("Must have phone or email address for each contact", "error");
                return;
            }

            contactsTemp.push({
                department: contacts[i].querySelector(".contactDepartment").value,
                title: contacts[i].querySelector(".contactTitle").value,
                address: contacts[i].querySelector(".contactAddress").value,
                phone: phone,
                email: email
            });
        }

        data.contacts = contactsTemp;

        nextPage.display();
    }
}