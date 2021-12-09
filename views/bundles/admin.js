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

  // views/js/admin/userSearch.js
  var require_userSearch = __commonJS({
    "views/js/admin/userSearch.js"(exports, module) {
      module.exports = {
        search: function() {
          let searchString = document.getElementById("userSearch").value;
          fetch("/admin/user/search", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ searchString })
          }).then((r) => r.json()).then((response) => {
            if (typeof response === "string") {
              controller.createBanner(response, "error");
            } else if (response.length === 0) {
              controller.createBanner("No users match that search", "error");
            } else {
              this.populateUsers(response);
            }
          }).catch((err) => {
            controller.createBanner("Unable to display users", "error");
          });
        },
        populateUsers: function(users) {
          let container = document.getElementById("userContainer");
          let template = document.getElementById("user").content.children[0];
          while (container.children.length > 0) {
            container.removeChild(container.firstChild);
          }
          for (let i = 0; i < users.length; i++) {
            let date = new Date(users[i].createdAt);
            let user = template.cloneNode(true);
            user.querySelector(".userEmail").innerText = users[i].email;
            user.querySelector(".userDate").innerText = `Joined ${date.toLocaleDateString()}`;
            user.querySelector(".userStatus").innerText = users[i].status.length === 0 ? "Active" : "Suspended";
            container.appendChild(user);
          }
        }
      };
    }
  });

  // views/js/admin/admin.js
  var profile = require_profile();
  var userSearch = require_userSearch();
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
    controller.changePage("searchUsers");
  };
  document.getElementById("eaSave").onclick = () => {
    profile.save();
  };
  document.getElementById("eaBack").onclick = () => {
    controller.changePage("main");
  };
  document.getElementById("userSearch").onkeyup = (event) => {
    if (event.keyCode === 13)
      userSearch.search();
  };
  document.getElementById("userSearchBtn").onclick = () => {
    userSearch.search();
  };
  document.getElementById("suBack").onclick = () => {
    controller.changePage("main");
  };
})();
