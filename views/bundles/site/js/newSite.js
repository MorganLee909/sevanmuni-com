(() => {
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // views/site/js/projectInformation.js
  var require_projectInformation = __commonJS({
    "views/site/js/projectInformation.js"(exports, module) {
      module.exports = {
        display: function() {
          hideSections();
          document.getElementById("projectInfo").style.display = "flex";
        },
        submit: function(nextPage) {
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
          showBanner("Searching for sites, please wait", "awaiting");
          fetch("/site/address", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: data.projectAddress })
          }).then((r) => r.json()).then((addresses) => {
            if (typeof addresses === "string") {
              showBanner(addresses, "error");
            } else if (addresses.length === 0) {
              showBanner("No matching sites found", "warning");
              nextPage.display();
            } else {
              nextPage.display();
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

  // views/site/js/contacts.js
  var require_contacts = __commonJS({
    "views/site/js/contacts.js"(exports, module) {
      module.exports = {
        display: function(addresses) {
          hideSections();
          document.getElementById("contacts").style.display = "flex";
        },
        addContact: function() {
          let container = document.getElementById("contactsContainer");
          let template = document.getElementById("contactTemplate").content.children[0];
          let contact = template.cloneNode(true);
          contact.querySelector(".contactRemove").onclick = () => {
            contact.parentElement.removeChild(contact);
          };
          container.appendChild(contact);
        },
        next: function(nextPage) {
          let contacts2 = document.getElementById("contactsContainer").children;
          let contactsTemp = [];
          for (let i = 0; i < contacts2.length; i++) {
            let phone = contacts2[i].querySelector(".contactPhone").value;
            let email = contacts2[i].querySelector(".contactEmail").value;
            if (phone === "" && email === "") {
              showBanner("Must have phone or email address for each contact", "error");
              return;
            }
            contactsTemp.push({
              department: contacts2[i].querySelector(".contactDepartment").value,
              title: contacts2[i].querySelector(".contactTitle").value,
              address: contacts2[i].querySelector(".contactAddress").value,
              phone,
              email
            });
          }
          data.contacts = contactsTemp;
          nextPage.display();
        }
      };
    }
  });

  // views/site/js/codeInformation.js
  var require_codeInformation = __commonJS({
    "views/site/js/codeInformation.js"(exports, module) {
      module.exports = {
        display: function() {
          hideSections();
          document.getElementById("codeInfo").style.display = "flex";
        },
        addCode: function(type) {
          let container = document.getElementById(`${type}Codes`);
          let input = document.createElement("textarea");
          input.classList.add("codeInput");
          container.appendChild(input);
        },
        next: function(nextPage) {
          data.codes = {};
          let codes = document.querySelectorAll(".aCode");
          for (let i = 0; i < codes.length; i++) {
            let name = codes[i].querySelector(".codeAddBtn").getAttribute("code");
            data.codes[name] = [];
            for (let j = 1; j < codes[i].children.length; j++) {
              data.codes[name].push(codes[i].children[j].value);
            }
          }
          let adaCodes = document.getElementById("adaCodes");
          data.requirementsADA = [];
          for (let i = 1; i < adaCodes.children.length; i++) {
            data.requirementsADA.push(adaCodes.children[i].value);
          }
          let adaIssues = document.getElementById("adaIssuesCodes");
          data.reviewIssuesADA = [];
          for (let i = 1; i < adaIssues.children.length; i++) {
            data.reviewIssuesADA.push(adaIssues.children[i].value);
          }
          data.existingWC = {
            men: {
              occupancyCount: parseInt(document.getElementById("occMen").value),
              lavatories: parseInt(document.getElementById("lavMen").value),
              toilets: parseInt(document.getElementById("toilMen").value),
              urinals: parseInt(document.getElementById("urinMen").value)
            },
            women: {
              occupancyCount: parseInt(document.getElementById("occWomen").value),
              lavatories: parseInt(document.getElementById("lavWomen").value),
              toilets: parseInt(document.getElementById("toilWomen").value),
              urinals: parseInt(document.getElementById("urinWomen").value)
            },
            unisex: {
              occupancyCount: parseInt(document.getElementById("occUnisex").value),
              lavatories: parseInt(document.getElementById("lavUnisex").value),
              toilets: parseInt(document.getElementById("toilUnisex").value),
              urinals: parseInt(document.getElementById("urinUnisex").value)
            },
            employee: {
              occupancyCount: parseInt(document.getElementById("occEmployee").value),
              lavatories: parseInt(document.getElementById("lavEmployee").value),
              toilets: parseInt(document.getElementById("toilEmployee").value),
              urinals: parseInt(document.getElementById("urinEmployee").value)
            }
          };
          let adaConcerns = document.getElementById("adaConcernsCodes");
          data.concernsADA = [];
          for (let i = 1; i < adaConcerns.children.length; i++) {
            data.concernsADA.push(adaConcerns.children[i].value);
          }
          nextPage.display();
        }
      };
    }
  });

  // views/site/js/permitting.js
  var require_permitting = __commonJS({
    "views/site/js/permitting.js"(exports, module) {
      module.exports = {
        display: function() {
          hideSections();
          document.getElementById("permitting").style.display = "flex";
        }
      };
    }
  });

  // views/site/js/newSite.js
  var projectInformation = require_projectInformation();
  var contacts = require_contacts();
  var codeInformation = require_codeInformation();
  var permitting = require_permitting();
  data = {};
  interval = {};
  hideSections = () => {
    let sections = document.querySelectorAll("section");
    for (let i = 0; i < sections.length; i++) {
      sections[i].style.display = "none";
    }
  };
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
    projectInformation.submit(contacts);
  };
  document.getElementById("addContactButton").onclick = () => {
    contacts.addContact();
  };
  document.getElementById("contactsBack").onclick = () => {
    projectInformation.display();
  };
  document.getElementById("contactsNext").onclick = () => {
    contacts.next(codeInformation);
  };
  document.getElementById("codeInfoBack").onclick = () => {
    contacts.display();
  };
  document.getElementById("codeInfoNext").onclick = () => {
    codeInformation.next(permitting);
  };
  document.getElementById("permittingBack").onclick = () => {
    codeInformation.display();
  };
  var codeButtons = document.querySelectorAll(".codeSection");
  for (let i = 0; i < codeButtons.length; i++) {
    let addButton = codeButtons[i].querySelector(".codeAddBtn");
    let type = addButton.getAttribute("code");
    addButton.onclick = () => {
      codeInformation.addCode(type);
    };
  }
})();
