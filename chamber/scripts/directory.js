const memberDirectory = document.querySelector("#member-directory");
const memberCount = document.querySelector("#member-count");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

const membersURL = "data/members.json";

async function getMembers() {
    try {
        const response = await fetch(membersURL);

        if (!response.ok) {
            throw new Error(
                'Unable to retrieve member data. Status: ${response.status}'
            );
        }

        const data = await response.json();

        displayMembers(data.members);
    } catch (error) {
        console.error("Directory error:", error);

        memberDirectory.innerHTML = `
            <p class="status-message error-message">
                The business directory could not be loaded.
                Please try refreshing the page 
            </p>
        `;
        memberCount.textContent = "Member information is unavailable.";
    }
}

function getMembershipName(level) {
    const membershipLevels = {
        1: "Member",
        2: "Silver",
        3: "Gold"
    };

    return membershipLevels[level] || "Member";
}

function displayMembers(members) {
    memberDirectory.innerHTML = "";

    memberCount.textContent =
        `${members.length} chamber members displayed`;
    
    members.forEach((member) => {
        const membershipName = getMembershipName(
            member.membershipLevel
        );
        const card = document.createElement("article");
        card.classList.add("member-card");

        const logoContainer = document.createElement("div");
        logoContainer.classList.add("member-logo-container");

        const logo = document.createElement("img");
        logo.classList.add("member-logo");
        logo.setAttribute(
            "src",
            `images/${member.image}`
        );
        logo.setAttribute(
            "alt",
            `${member.name} logo`
        );
        logo.setAttribute("loading", "lazy");
        logo.setAttribute("width", "150");
        logo.setAttribute("height", "120");

        logoContainer.appendChild(logo);

        const information = document.createElement("div");
        information.classList.add("member-information");

        information.innerHTML = `
            <div>
                <span
                    class="membership-badge ${membershipName.toLowerCase()}"
                >
                    ${membershipName} Member
                </span>

                <h3>${member.name}</h3>

                <p class="member-tagline">
                    ${member.tagline}
                </p>
            </div>

            <address>
                ${member.address}<br>
                ${member.city}, ${member.state} ${member.zip}
            </address>

            <p>
                <a href="tel:${formatPhoneLink(member.phone)}">
                    ${member.phone}
                </a>
            </p>

            <p> 
                <a
                    href=${member.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit Website
                </a>
            </p>
        `;

        card.appendChild(logoContainer);
        card.appendChild(information);
        memberDirectory.appendChild(card);
    });
}

function formatPhoneLink(phoneNumber) {
    return phoneNumber.replace(/[^\d+]/g, "");
}

function showGridView() {
    memberDirectory.classList.add("grid-view");
    memberDirectory.classList.remove("list-view");

    gridButton.classList.add("active-view");
    listButton.classList.remove("active-view");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");

    localStorage.setItem("directoryView", "grid");
}

function showListView() {
    memberDirectory.classList.add("list-view");
    memberDirectory.classList.remove("grid-view");

    listButton.classList.add("active-view");
    gridButton.classList.remove("active-view");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");

    localStorage.setItem("directoryView", "list");

}

function loadSavedView() {
    const savedView = localStorage.getItem("directoryView");

    if (savedView === "list") {
        showListView();
    } else {
        showGridView();
    }
}

gridButton.addEventListener("click", showGridView);
listButton.addEventListener("click", showListView);

loadSavedView();
getMembers();