const userID = "1020301464704397402"; // Change this to your Discord user ID

const elements = {
    statusBox: document.getElementById("status"),
    statusImage: document.getElementById("status-image"),
    avatarImage: document.getElementById("avatar-image"),
    avatarDecoration: document.getElementById("avatar-decoration"),
    bannerImage: document.getElementById("banner-image"),
    bannerColor: document.querySelector(".banner"),
    displayName: document.querySelector(".display-name"),
    username: document.querySelector(".username"),
    customStatus: document.querySelector(".custom-status"),
    customStatusText: document.querySelector(".custom-status-text"),
    customStatusEmoji: document.getElementById("custom-status-emoji"),
    audio: document.getElementById("background-music"),  // Music element
    playPauseButton: document.getElementById("play-pause"),
    volumeControl: document.getElementById("volume-control")
};

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userID}`);
        const lanyardData = await response.json();

        const { discord_status, activities, discord_user } = lanyardData.data;

        elements.displayName.innerHTML = discord_user.display_name;
        elements.username.innerHTML = discord_user.username;

        let imagePath;
        switch (discord_status) {
            case "online":
                imagePath = "./public/status/online.svg";
                break;
            case "idle":
                imagePath = "./public/status/idle.svg";
                break;
            case "dnd":
                imagePath = "./public/status/dnd.svg";
                break;
            case "offline":
                imagePath = "./public/status/offline.svg";
                break;
            default:
                imagePath = "./public/status/offline.svg";
                break;
        }

        if (activities && activities.length && activities[0].type === 1 &&
            (activities[0].url.includes("twitch.tv") || activities[0].url.includes("youtube.com"))) {
            imagePath = "./public/status/streaming.svg";
        }

        elements.statusImage.src = imagePath;
        elements.statusImage.alt = `Discord status: ${discord_status}`;

        elements.customStatusText.innerHTML = activities[0]?.state || "Not doing anything!";

        if (activities[0]?.emoji == null) {
            elements.customStatusEmoji.style.display = "none";
        } else {
            elements.customStatusEmoji.src = `https://cdn.discordapp.com/emojis/${activities[0].emoji.id}?format=webp&size=24&quality=lossless`;
            elements.customStatusEmoji.style.marginRight = "5px";
        }

        if (!activities[0]?.state && !activities[0]?.emoji) {
            elements.customStatus.style.display = "none";
        } else {
            elements.customStatus.style.display = "flex";
        }
    } catch (error) {
        console.error("Unable to retrieve Discord status:", error);
    }
}

// Add event listener for play/pause button
elements.playPauseButton.addEventListener('click', () => {
    if (elements.audio.paused) {
        elements.audio.play();
        elements.playPauseButton.innerText = "Pause";
    } else {
        elements.audio.pause();
        elements.playPauseButton.innerText = "Play";
    }
});

// Add event listener for volume control
elements.volumeControl.addEventListener('input', function () {
    elements.audio.volume = elements.volumeControl.value;
});

// Logic for tooltips
const tooltips = document.querySelectorAll(".tooltip");
tooltips.forEach((tooltip) => {
    tooltip.addEventListener("mouseenter", () => {
        const ariaLabel = tooltip.getAttribute("aria-label");
        tooltip.setAttribute("data-tooltip-content", ariaLabel);
    });

    tooltip.addEventListener("mouseleave", () => {
        tooltip.removeAttribute("data-tooltip-content");
    });
});

// Set title attributes on anchor links
const anchors = document.getElementsByTagName("a");
for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    const href = anchor.getAttribute("href");
    if (href) {
        anchor.setAttribute("title", href);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', createRippleEffect);

    // Fetch Discord status on page load
    fetchDiscordStatus();
    // Fetch Discord status every 6 seconds
    setInterval(fetchDiscordStatus, 6000);
});

function createRippleEffect(event) {
    const ripple = document.createElement('div');
    ripple.className = 'click-effect';

    const x = event.clientX;
    const y = event.clientY;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    // Remove the ripple after the animation ends
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}