module.exports = {
    display: function(){
        hideSections();
        document.getElementById("projectInfo").style.display = "flex";
    },
    
    submit: function(nextPage){
        event.preventDefault();

        try{
            data.propertyType = document.querySelector("input[name='propertyType']:checked").value;
        }catch(e){
            showBanner("Please choose a property type", "error");
            return;
        }
        data.projectName = document.getElementById("projectName").value;
        data.projectAddress = document.getElementById("projectAddress").value;
        data.projectNumber = document.getElementById("projectNumber").value;
        data.phone = document.getElementById("phone").value;
        data.parkingSpaces = document.getElementById("parkingSpaces").value;
        data.squareFootage = {
            patio: document.getElementById("patioFootage").value,
            diningRoom: document.getElementById("diningFootage").value,
            total: document.getElementById("totalFootage").value,
            verificationMethod: document.getElementById("footageMethod").value
        };
        data.surveyDate = document.getElementById("surveyDate").valueAsDate;
        data.preparedBy = {
            date: document.getElementById("preparedByDate").valueAsDate,
            architectName: document.getElementById("preparedByArchitect").value,
            engineerName: document.getElementById("preparedByEngineer").value
        }

        showBanner("Searching for sites, please wait", "awaiting");
        fetch("/site/address", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({address: data.projectAddress})
        })
            .then(r=>r.json())
            .then((addresses)=>{
                if(typeof(addresses) === "string"){
                    showBanner(addresses, "error");
                }else if(addresses.length === 0){
                    showBanner("No matching sites found", "warning");
                    nextPage.display();
                }else{
                    nextPage.display();
                    showBanner("Matching sites found", "success");
                }
            })
            .catch((err)=>{
                showBanner("An error occurred, please refresh the page", "error");
            })
            .finally(()=>{
                clearInterval(interval);
            });
    }
}