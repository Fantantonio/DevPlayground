
const windowTerminal = document.getElementById("window-terminal");
let offsetX, offsetY;

const show = function (element_id) {
    document.getElementById(element_id).classList.remove("hidden");
    document.getElementById("nav-open-terminal").classList.remove("hidden");
};

const hide = function (element_id) {
    document.getElementById(element_id).classList.add("hidden");
};

const maximize = function (element_id) {
    const element = document.getElementById(element_id);
    const icon = element.querySelector(".window-maximize-icon");
    if (element.getAttribute("data-maximized") === "true") {
        element.classList.remove("maximized");
        element.setAttribute("data-maximized", "false");
        element.setAttribute("style", "");
        icon.src = "img/icons/window-maximize-symbolic.svg";
    } else {
        element.classList.add("maximized");
        element.setAttribute("data-maximized", "true");
        element.setAttribute("style", "");
        icon.src = "img/icons/window-restore-symbolic.svg";
    }
};

const minimize = function (element_id) {
    hide(element_id);
    show("nav-open-terminal");
};

const closeWindow = function (element_id) {
    hide(element_id);
    hide("nav-open-terminal");
};

const getCurrentDayName = function () {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const currentDate = new Date();
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayIndex = currentDate.getDay();
    return days[dayIndex].toUpperCase();
};

const getCurrentDateFormat = function () {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = months[monthIndex].toUpperCase();
    return `${day} ${monthName} ${year}`;
};

const getCurrentTimeFormat = function () {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${
        minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
    return `- ${formattedTime} -`;
};

const handleMouseDown = function (e) {
    // Store the initial mouse position
    offsetX = e.clientX - windowTerminal.getBoundingClientRect().left;
    offsetY = e.clientY - windowTerminal.getBoundingClientRect().top;

    // Add event listeners for mouse move and mouse up events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = function (e) {
    // Calculate new window position based on mouse movement
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    // Set the new window position
    windowTerminal.style.left = newX + "px";
    windowTerminal.style.top = newY + "px";
};

const handleMouseUp = function () {
    // Remove event listeners for mouse move and mouse up events
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
};

const timeElapsed = function (datetimeString) {
    const [dateStr, timeStr] = datetimeString.split(" ");
    const [day, month, year] = dateStr.split("/");
    const [_hours, _minutes, _seconds] = timeStr.split(":").map(Number);

    const givenDatetime = new Date(
        year,
        month - 1,
        day,
        _hours,
        _minutes,
        _seconds
    );
    const currentDatetime = new Date();

    let timeDiff = currentDatetime - givenDatetime;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    timeDiff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDiff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(timeDiff / (1000 * 60));
    timeDiff -= minutes * (1000 * 60);
    const seconds = Math.floor(timeDiff / 1000);

    let result = "";
    if (days > 0) {
        result += `${days} day${days > 1 ? "s" : ""}, `;
    }
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? "s" : ""}, `;
    }
    if (minutes > 0) {
        result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (days === 0 && hours === 0 && minutes === 0) {
        result += `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return result;
};

const getBrowserInfo = function () {
    var userAgent = window.navigator.userAgent;
    var browsers = {
        Chrome: /(?:Chrome|CriOS)\/([\d\.]+)/,
        Edge: /Edge\/([\d\.]+)/,
        Firefox: /Firefox\/([\d\.]+)/,
        IE: /MSIE\s([\d\.]+)/,
        Opera: /(?:Opera|OPR)\/([\d\.]+)/,
        Safari: /Version\/([\d\.]+).*Safari/,
    };
    for (var browser in browsers) {
        var match = userAgent.match(browsers[browser]);
        if (match) {
            return {
                name: browser,
                version: match[1],
            };
        }
    }
    return {
        name: "Unknown",
        version: "Unknown",
    };
};

document.getElementById("datetime-day").innerText = getCurrentDayName();
document.getElementById("datetime-date").innerText =
    getCurrentDateFormat();
document.getElementById("datetime-time").innerText =
    getCurrentTimeFormat();
windowTerminal
    .querySelector(".window-top-bar")
    .addEventListener("mousedown", handleMouseDown);

document.getElementById("time-elapsed").innerText = timeElapsed(
    "14/05/2024 14:00:00"
);
const browser_info = getBrowserInfo();
document.getElementById("browser-info").innerText = browser_info.name;
document.getElementById("browser-version").innerText =
    browser_info.version;
document.getElementById("browser-codename").innerText =
    navigator.appCodeName;
document.getElementById("browser-language").innerText =
    navigator.language;
document.getElementById("client-platform").innerText = navigator.platform;
document.getElementById("client-OS").innerText = navigator.appVersion;
document.getElementById("user-agent").innerText = navigator.userAgent;
document.getElementById("client-java").innerText =
    navigator.javaEnabled();
document.getElementById("time-zone").innerText =
    Intl.DateTimeFormat().resolvedOptions().timeZone;