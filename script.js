const url = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";
const countContacts = 8;

let PendingInvitations = 0;
let numberOfNewContacts = 0;

const numberPendingInvitations = document.querySelector(
  "#count-pending-invitations"
);

const contactsContainer = document.querySelector("#contacts-container");

function getAllContacts(countContacts) {
  const allDataFromApi = fetch(url + countContacts)
    .then((response) => {
      //console.log(response.status);
      //console.log(response.ok);
      if (response.ok) {
        return response.json();
      } else {
        alert("No server connection");
      }
    })
    .then((dataComplete) => {
      //console.log(dataComplete);

      for (let i = 0; i < dataComplete.length; i++) {
        const contactComplete = document.createElement("article");
        const newContactId = i + numberOfNewContacts;

        //render image
        const imageContainer = document.createElement("picture");
        const contactImage = document.createElement("img");
        contactImage.src = dataComplete[i].picture;
        contactImage.setAttribute("class", "picture-person");
        imageContainer.appendChild(contactImage);

        contactComplete.appendChild(imageContainer);

        // render name
        const contactName = document.createElement("h2");
        contactName.innerText =
          dataComplete[i].name.first + " " + dataComplete[i].name.last;
        contactName.setAttribute("class", "name-person");

        contactComplete.appendChild(contactName);

        // render title
        const contactTitle = document.createElement("p");
        contactTitle.innerText = dataComplete[i].title;
        contactTitle.setAttribute("class", "text-person");

        contactComplete.appendChild(contactTitle);

        // render mutual connections
        const contactMutualConnections = document.createElement("p");
        contactMutualConnections.innerText =
          dataComplete[i].mutualConnections + " mutual connections";
        contactMutualConnections.setAttribute("class", "text-person");

        storePendingInvitations(PendingInvitations);

        // render connect button
        const contactConnectButton = document.createElement("button");
        contactConnectButton.innerText = "connect";
        contactConnectButton.setAttribute("value", "isPending");
        contactConnectButton.setAttribute("id", "connect-button-person");

        contactComplete.appendChild(contactConnectButton);

        // adds functions to connect button
        contactConnectButton.addEventListener("click", function (e) {
          //console.log(e.target.value);
          if (e.target.value === "isPending") {
            e.target.value = "isConnected";
            contactConnectButton.innerText = "pending";
            PendingInvitations++;
          } else {
            e.target.value = "isPending";
            contactConnectButton.innerText = "connect";
            PendingInvitations--;
          }
          numberPendingInvitations.innerText =
            PendingInvitations + " pending invitations";

          storePendingInvitations(PendingInvitations);
        });

        // render remove button
        contactRemoveButton = document.createElement("button");
        contactRemoveButton.innerText = "x";
        contactRemoveButton.setAttribute("id", "remove-button-person");

        contactComplete.appendChild(contactRemoveButton);
        contactRemoveButton.addEventListener("click", removePerson);

        // render background image
        if (dataComplete[i].backgroundImage.length > 0) {
          contactComplete.style.backgroundImage =
            "url(" + dataComplete[i].backgroundImage + ")";
        }

        // adds all items to the articel
        contactsContainer.appendChild(contactComplete);
      }
    });
}

// stores pending invitations into the local storage
function storePendingInvitations(PendingInvitations) {
  localStorage.setItem(
    "PendingInvitations",
    JSON.stringify(PendingInvitations)
  );
}

// gets pending invitations from local storage
function getStoredPendingInvitations() {
  const invitationNumber = JSON.parse(
    localStorage.getItem("PendingInvitations")
  );
  if (invitationNumber === null) {
    PendingInvitations = 0;
  } else {
    PendingInvitations = invitationNumber;
  }
}

// removes targeted person
function removePerson(event) {
  contactsContainer.removeChild(event.target.parentElement);
  getAllContacts(1);
}

getStoredPendingInvitations();
getAllContacts(countContacts);
