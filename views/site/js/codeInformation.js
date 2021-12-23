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
    },

    next: function(nextPage){
        data.codes = {};

        let codes = document.querySelectorAll(".aCode");
        for(let i = 0; i < codes.length; i++){
            let name = codes[i].querySelector(".codeAddBtn").getAttribute("code");
            data.codes[name] = [];

            for(let j = 1; j < codes[i].children.length; j++){
                data.codes[name].push(codes[i].children[j].value);
            }
        }

        let adaCodes = document.getElementById("adaCodes");
        data.requirementsADA = [];
        for(let i = 1; i < adaCodes.children.length; i++){
            data.requirementsADA.push(adaCodes.children[i].value);
        }

        let adaIssues = document.getElementById("adaIssuesCodes");
        data.reviewIssuesADA = [];
        for(let i = 1; i < adaIssues.children.length; i++){
            data.reviewIssuesADA.push(adaIssues.children[i].value);
        }

        data.existingWC = {
            men: {
                occupancyCount: parseInt(document.getElementById("occMen").value),
                lavatories: parseInt(document.getElementById("lavMen").value),
                toilets: parseInt(document.getElementById("toilMen").value),
                urinals: parseInt(document.getElementById("urinMen").value)
            },
            women: {
                occupancyCount: parseInt(document.getElementById("occWomen").value),
                lavatories: parseInt(document.getElementById("lavWomen").value),
                toilets: parseInt(document.getElementById("toilWomen").value),
                urinals: parseInt(document.getElementById("urinWomen").value)
            },
            unisex: {
                occupancyCount: parseInt(document.getElementById("occUnisex").value),
                lavatories: parseInt(document.getElementById("lavUnisex").value),
                toilets: parseInt(document.getElementById("toilUnisex").value),
                urinals: parseInt(document.getElementById("urinUnisex").value)
            },
            employee: {
                occupancyCount: parseInt(document.getElementById("occEmployee").value),
                lavatories: parseInt(document.getElementById("lavEmployee").value),
                toilets: parseInt(document.getElementById("toilEmployee").value),
                urinals: parseInt(document.getElementById("urinEmployee").value)
            }
        }

        let adaConcerns = document.getElementById("adaConcernsCodes");
        data.concernsADA = [];
        for(let i = 1; i < adaConcerns.children.length; i++){
            data.concernsADA.push(adaConcerns.children[i].value);
        }

        nextPage.display();
    }
}