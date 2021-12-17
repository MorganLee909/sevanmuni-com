module.exports = {
    save: function(){
        let oldPassword = document.getElementById("oldPassword");
        let newPassword = document.getElementById("newPassword");
        let confirmPassword = document.getElementById("confirmPassword");

        let data = {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value
        };

        if(!data.newPassword) return;
        if(data.newPassword !== data.confirmPassword) return controller.createBanner("Passwords do not match", "error");
        if(data.newPassword && !data.oldPassword) return controller.createBanner("Please enter your current password", "error");
        if(data.newPassword.length < 10) return controller.createBanner("Password must contain at least 10 characters", "error");

        fetch("/admin/update", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(r=>r.json())
            .then((response)=>{
                if(typeof(response) === "string"){
                    controller.createBanner(response, "error");
                }else{
                    controller.createBanner("Profile updated", "success");
                    oldPassword.value = "";
                    newPassword.value = "";
                    confirmPassword.value = "";
                }
            })
            .catch((err)=>{
                controller.createBanner("An error occurred, please refresh the page")
            });
    }
}