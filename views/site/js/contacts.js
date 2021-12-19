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
    }
}