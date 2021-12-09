module.exports = {
    search: function(){
        let searchString = document.getElementById("userSearch").value;

        fetch("/admin/user/search", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({searchString: searchString})
        })
        .then(r=>r.json())
        .then((response)=>{
            if(typeof(response) === "string"){
                controller.createBanner(response, "error");
            }else if(response.length === 0){
                controller.createBanner("No users match that search", "error");
            }else{
                this.populateUsers(response);
            }
        })
        .catch((err)=>{
            console.log(err);
            controller.createBanner("Unable to display users", "error");
        })
    },

    populateUsers: function(users){
        let container = document.getElementById("userContainer");
        let template = document.getElementById("user").content.children[0];

        while(container.children.length > 0){
            container.removeChild(container.firstChild);
        }
        
        for(let i = 0; i < users.length; i++){
            let date = new Date(users[i].createdAt);
            let user = template.cloneNode(true);
            user.querySelector(".userEmail").innerText = users[i].email;
            user.querySelector(".userDate").innerText = `Joined ${date.toLocaleDateString()}`;
            user.querySelector(".userStatus").innerText = users[i].status.length === 0 ? "Active" : "Suspended";
            container.appendChild(user);
        }
    }
}