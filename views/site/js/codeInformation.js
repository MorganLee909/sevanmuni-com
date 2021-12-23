module.exports = {
    display: function(){
        hideSections();
        document.getElementById("codeInfo").style.display = "flex";
    },

    addCode: function(type){
        let container = document.getElementById(`${type}Codes`);

        let input = document.createElement("textarea");
        input.classList.add("codeInput");
        container.appendChild(input);
    }
}