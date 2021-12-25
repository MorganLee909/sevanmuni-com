module.exports = {
    display: function(){
        hideSections();
        document.getElementById("permitting").style.display = "flex";
    },

    next: function(){
        let permits = document.getElementById("permitBody").children;
        data.applicablePermits = [];
        
        for(let i = 0; i < permits.length; i++){
            let sequence = permits[i].children[1].children[0].value;
            let requirements = permits[i].children[5].children[0].value;
            let applicationFees = parseFloat(permits[i].children[2].children[0].value);
            let permitFees = parseFloat(permits[i].children[3].children[0].value);
            let reviewTime = parseFloat(permits[i].children[4].children[0].value);
            
            if(
                !sequence &&
                !requirements &&
                !applicationFees &&
                !permitFees &&
                !reviewTime
            ) continue;

            applicationFees = applicationFees === "" ? 0 : applicationFees;
            permitFees = permitFees === "" ? 0 : permitFees;
            reviewTime = reviewTime === "" ? 0 : reviewTime;

            data.applicablePermits.push({
                permit: permits[i].children[0].innerText,
                sequence: sequence,
                requirements: requirements,
                applicationFees: applicationFees,
                permitFees: permitFees,
                reviewTime: reviewTime
            });
        }

        let thirdParty = document.getElementById("thirdPartyReviewCodes").children;
        data.thirdPartyReviews = [];
        for(let i = 1; i < thirdParty.length; i++){
            data.thirdPartyReviews.push(thirdParty[i].value);
        }

        return;

        fetch("/site/new", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(r=>r.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    showBanner(response, "error");
                }else{
                    window.location.href = `/site/${response.id}`;
                }
            })
            .catch((err)=>{
                showBanner("Something went wrong, please refresh the page", "error");
            })
    }
}