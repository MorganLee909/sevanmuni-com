module.exports = {
    display: function(){
        hideSections();
        document.getElementById("permitting").style.display = "flex";
    },

    next: function(){
        let permits = document.getElementById("permitBody").children;
        data.applicablePermits = [];
        
        for(let i = 0; i < permits.length; i++){
            data.applicablePermits.push({
                permit: permits[i].children[0].innerText,
                sequence: permits[i].children[1].children[0].value,
                requirements: permits[i].children[5].children[0].value,
                applicationFees: parseFloat(permits[i].children[2].children[0].value),
                permitFees: parseFloat(permits[i].children[3].children[0].value),
                reviewTime: parseFloat(permits[i].children[4].children[0].value)
            });
        }

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
                console.log(err);
                showBanner("Something went wrong, please refresh the page", "error");
            })
    }
}