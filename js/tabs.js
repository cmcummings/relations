const sidebarTabs = document.getElementById("sidebar-tabs");
const sidebarContent = document.getElementById("sidebar-content");

function openTab(buttonClicked, tabName) {
    // Hide all tabs
    const content = sidebarContent.children;
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }

    // Lighten all tab buttons
    const tabs = sidebarTabs.children;
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    buttonClicked.className += " active";
}

document.getElementById("default-tab").click();