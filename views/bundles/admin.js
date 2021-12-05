(() => {
  // views/js/admin/admin.js
  controller = {
    pages: document.querySelectorAll("page"),
    changePage: function(page) {
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].style.display = "none";
      }
      document.getElementById(page).style.display = "flex";
    }
  };
  document.getElementById("editAccountBtn").onclick = () => {
    controller.changePage("editAccount");
  };
  document.getElementById("searchUsersBtn").onclick = () => {
    controller.changepage("searchUsers");
  };
})();
