const currentWeather =
    document.querySelector("#current-weather");

const weatherForecast =
    document.querySelector("#weather-forecast");

const spotlightContainer =
    document.querySelector("#spotlight-container");

const apiKey = "0c359efdafa29363372b76f9a1699ef2";

const latitude = 33.666774;
const longitude = -112.023245;

const currentWeatherURL =
   `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`

const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`

const memberURL = "data/members.json";

async function getWeather() {
    try {
        const currentResponse = await fetch(currentWeatherURL);

        if (!currentResponse.ok) {
            throw new Error(
                `Current weather error: ${currentResponse.status}`
            );
        }

        const forecastResponse = await fetch(forecastURL);

        if (!forecastResponse.ok) {
            throw new Error(
                `Forecast error: ${forecastResponse.status}`
            );
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather error:", error);

        currentWeather.innerHTML = `
            <p class="error-message">
                Current weather information is unavailable.
            </p>
        `;

        weatherForecast.innerHTML = `
            <p class="error-message">
                The weather forecast cannot be loaded.
            </p>
        `;
    }
}

function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    
    const description = capitalizeWords(
        data.weather[0].description
    );

    const iconCode = data.weather[0].icon;

    const iconURL =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    currentWeather.innerHTML = `
        <div class="current-weather-display">
            <img
                src="${iconURL}"
                alt="${description}"
                width="100"
                height="100"
            >

            <div>
                <p class="current-temperature">
                    ${temperature}&deg;F
                </p>

                <p class="weather-description">
                    ${description}
                </p>
            </div>
        </div>
    `;
}



function displayForecast(data) {
    const selectedForecasts =
        selectThreeDailyForecasts(data.list);
    
    weatherForecast.innerHTML = "";

    selectedForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const dayName = new Intl.DateTimeFormat(
            "en-US",
            {
                weekday: "long"
            }
        ).format(date);

        const temperature = Math.round(
            forecast.main.temp
        );

        const description = capitalizeWords(
            forecast.weather[0].description
        );

        const forecastCard =
            document.createElement("div");
        
        forecastCard.classList.add("forecast-day");

        forecastCard.innerHTML = `
            <h4>${dayName}</h4>

            <p class="forecast-temperature">
                ${temperature}&deg;F
            </p>

            <p>${description}</p>
        `;

        weatherForecast.appendChild(forecastCard);
    });
}

function selectThreeDailyForecasts(forecastList) {
    const selectedForecasts = [];
    const usedDates = new Set();

    for(const forecast of forecastList) {
        const date = new Date(forecast.dt * 1000);

        const dateKey =
            date.toISOString().split("T")[0];
        
        const hour = date.getHours();

        if (
            !usedDates.has(dateKey) &&
            hour >= 11 &&
            hour <= 15
        ) {
            selectedForecasts.push(forecast);
            usedDates.add(dateKey);
        }

        if (selectedForecasts.length === 3) {
            break;
        }
    }

    if (selectedForecasts.length < 3) {
        for (const forecast of forecastList) {
            const date = new Date(
                forecast.dt * 1000
            );

            const dateKey =
                date.toISOString().split("T")[0];
            
            if (!usedDates.has(dateKey)) {
                selectedForecasts.push(forecast);
                usedDates.add(dateKey);
            }

            if (selectedForecasts.length === 3) {
                break;
            }
        }
    }

    return selectedForecasts;
}

function capitalizeWords(text) {
    return text
        .split(" ")
        .map((word) => {
            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );
        })
        .join(" ");
}

async function getSpotlights() {
    try {
        const response = await fetch(memberURL);

        if (!response.ok) {
            throw new Error(
                `Member data error: ${response.status}`
            );
        }

        const data = await response.json();

        const eligibleMembers = data.members.filter(
            (member) => {
                return (
                    member.membershiplevel === 2 ||
                    member.membershiplevel === 3
                );
            }
        );

        if (eligibleMembers.length < 2) {
            throw new Error(
                "At least two Silver or Gold members are required."
            );
        }

        const shuffledMembers =
            shuffleArray (eligibleMembers);
        
        const spotlightCount =
            shuffledMembers.length >= 3 ? 3 : 2;
        
        const selectedMembers =
            shuffledMembers.slice(0, spotlightCount);
        
        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error("Spotlight error:", error);

        spotlightContainer.innerHTML = `
            <p class="error-message">
                Member spotlights could not be loaded.
            </p>
        `;
    }
}

function shuffleArray(array) {
    const shuffled = [...array];

    for (
        let index = shuffled.length - 1;
        index > 0;
        index -= 1
    ) {
        const randomIndex = Math.floor(
            Math.random() * (index + 1)
        );
        [
            shuffled[index],
            shuffled[randomIndex]
        ] = [
                shuffled[randomIndex],
                shuffled[index]
            ];
    }
    return shuffled;
}

function displaySpotlights(members) {
    spotlightContainer.innerHTML = "";

    members.forEach((member) => {
        const membershipName =
            getMembershipName(
                member.membershiplevel
            );
        const spotlight =
            document.createElement("article");
        
        spotlight.classList.add("spotlight-card");

        spotlight.innerHTML = `
            <div class="spotlight-logo">
                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    width="160"
                    height="120:
                    loading="lazy"
                >
            </div>

            <div class="spotlight-details">
                <span
                    class="membership-badge
                    ${membershipName.toLowerCase()}"
                >
                    ${membershipName} Member
                </span>

                <h3>${member.name}</h3>

                <address>
                    ${member.address}<br>
                    ${member.city},
                    ${member.state}
                    ${member.zip}
                </address>

                <p>
                    <a
                        href="tel:${formatPhone(member.phone)}"
                    >
                        ${member.phone}
                    </a>
                </p>

                <p>
                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </p>
            </div>
        `;
        spotlightContainer.appendChild(spotlight);
    });
}

function getMembershipName(level) {
    if (level === 3) {
        return "Gold";
    }

    if (level === 2) {
        return "Silver";
    }
    return "Member";
}

function formatPhone(phoneNumber) {
    return phoneNumber.replace(/[^\d+]/g, "");
}

getWeather();
getSpotlights();