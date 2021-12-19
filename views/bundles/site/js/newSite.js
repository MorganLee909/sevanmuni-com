(() => {
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // views/site/js/projectInformation.js
  var require_projectInformation = __commonJS({
    "views/site/js/projectInformation.js"(exports, module) {
      module.exports = {
        submit: function(data2) {
          try {
            data2.propertyType = document.querySelector("input[name='propertyType']:checked").value;
          } catch (e) {
            return;
          }
          data2.projectName = document.getElementById("projectName").value;
          data2.projectAddress = document.getElementById("projectAddress").value;
          data2.patioFootage = document.getElementById("patioFootage").value;
          data2.diningFootage = document.getElementById("diningFootage").value;
          data2.totalFootage = document.getElementById("totalFootage").value;
          data2.footageMethod = document.getElementById("footageMethod").value;
          showBanner("Searching for sites, please wait", "awaiting");
          fetch("/site/address", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: data2.projectAddress })
          }).then((r) => r.json()).then((addresses) => {
            if (typeof addresses === "string") {
              showBanner(addresses, "error");
            } else if (addresses.length === 0) {
              showBanner("No matching sites found", "warning");
            } else {
              showBanner("Matching sites found", "success");
            }
          }).catch((err) => {
            showBanner("An error occurred, please refresh the page", "error");
          }).finally(() => {
            clearInterval(interval);
          });
        }
      };
    }
  });

  // views/site/js/newSite.js
  var projectInformation = require_projectInformation();
  data = {};
  interval = {};
  showBanner = (message, type) => {
    let banner = document.getElementById("banner");
    banner.style.display = "flex";
    banner.children[0].innerText = message;
    if (type === "error" || type === "warning" || type === "success") {
      banner.classList.add(`${type}Banner`);
      setTimeout(() => {
        banner.style.display = "none";
        banner.children[0].innerText = "";
      }, 1e4);
    } else if (type === "awaiting") {
      banner.classList.add("successBanner");
      let counter = ".";
      interval = setInterval(() => {
        banner.children[0].innerText = `${message}${counter}`;
        counter = counter.length >= 10 ? "." : `${counter}.`;
      }, 500);
    }
  };
  document.getElementById("projectInfoForm").onsubmit = () => {
    event.preventDefault();
    projectInformation();
  };
})();
