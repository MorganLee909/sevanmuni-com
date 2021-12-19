module.exports = {
    submit: function(data){
        try{
            data.propertyType = document.querySelector("input[name='propertyType']:checked").value;
        }catch(e){
            return;
        }
        data.projectName = document.getElementById("projectName").value;
        data.projectAddress = document.getElementById("projectAddress").value;
        data.patioFootage = document.getElementById("patioFootage").value;
        data.diningFootage = document.getElementById("diningFootage").value;
        data.totalFootage = document.getElementById("totalFootage").value;
        data.footageMethod = document.getElementById("footageMethod").value;
    
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
                }else{
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