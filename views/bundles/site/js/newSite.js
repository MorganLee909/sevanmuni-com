(() => {
  // views/site/js/newSite.js
  var data = {};
  document.getElementById("projectInfoForm").onsubmit = () => {
    event.preventDefault();
    try {
      data.propertyType = document.querySelector("input[name='propertyType']:checked").value;
    } catch (e) {
      return;
    }
    data.projectName = document.getElementById("projectName").value;
    data.projectAddress = document.getElementById("projectAddress").value;
    data.patioFootage = document.getElementById("patioFootage").value;
    data.diningFootage = document.getElementById("diningFootage").value;
    data.totalFootage = document.getElementById("totalFootage").value;
    data.footageMethod = document.getElementById("footageMethod").value;
  };
})();
