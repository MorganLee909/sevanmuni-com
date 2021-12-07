(() => {
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // views/js/admin/profile.js
  var require_profile = __commonJS({
    "views/js/admin/profile.js"(exports, module) {
      module.exports = {
        save: function() {
          let oldPassword = document.getElementById("oldPassword");
          let newPassword = document.getElementById("newPassword");
          let confirmPassword = document.getElementById("confirmPassword");
          let data = {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value
          };
          if (!data.newPassword)
            return;
          if (data.newPassword !== data.confirmPassword)
            return controller.createBanner("Passwords do not match", "error");
          if (data.newPassword && !data.oldPassword)
            return controller.createBanner("Please enter your current password", "error");
          if (data.newPassword.length < 10)
            return controller.createBanner("Password must contain at least 10 characters", "error");
          fetch("/admin/update", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }).then((r) => r.json()).then((response) => {
            if (typeof response === "string") {
              controller.createBanner(response, "error");
            } else {
              controller.createBanner("Profile updated", "success");
              oldPassword.value = "";
              newPassword.value = "";
              confirmPassword.value = "";
            }
          }).catch((err) => {
            controller.createBanner("An error occurred, please refresh the page");
          });
        }
      };
    }
  });

  // views/js/admin/admin.js
  var profile = require_profile();
  controller = {
    pages: document.querySelectorAll(".page"),
    banner: document.getElementById("banner"),
    changePage: function(page) {
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].style.display = "none";
      }
      document.getElementById(page).style.display = "flex";
    },
    createBanner(text, type) {
      this.banner.children[0].innerText = text;
      this.banner.classList.add(`${type}Banner`);
      this.banner.style.display = "block";
      setTimeout(() => {
        this.banner.classList.remove(`${type}Banner`);
        this.banner.style.display = "none";
      }, 1e4);
    }
  };
  document.getElementById("editAccountBtn").onclick = () => {
    controller.changePage("editAccount");
  };
  document.getElementById("searchUsersBtn").onclick = () => {
    controller.changepage("searchUsers");
  };
  document.getElementById("eaSave").onclick = () => {
    profile.save();
  };
  document.getElementById("eaBack").onclick = () => {
    controller.changePage("main");
  };
})();
