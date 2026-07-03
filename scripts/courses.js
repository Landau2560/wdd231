const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to programming",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with classes",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Fronted Development 1",
        credits: 2,
        completed: false
    }
];

const courseList = document.querySelector("#course-list");
const totalCredits = document.querySelector("#total-credits");

function displayCourses(filteredCourses) {
    courseList.innerHTML = "";

    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");

        if (course.completed) {
            card.classList.add("completed");
        }

        card.textContent = `${course.subject} ${course.number}`;
        courseList.appendChild(card);
    });

    const credits = filteredCourses.reduce((total, course) => {
        return total + course.credits;
    }, 0);

    totalCredits.textContent = credits;
}

document.querySelector("#all").addEventListener("click", () => {
    displayCourses(courses);
});

document.querySelector("#wdd").addEventListener("click", () => {
    const wddCourses = courses.filter(course => course.subject === "WDD");
    displayCourses(wddCourses);
});

document.querySelector("#cse").addEventListener("click", () => {
    const cseCourses = courses.filter(course.subject === "CSE");
    displayCourses(cseCourses);
});

displayCourses(courses);