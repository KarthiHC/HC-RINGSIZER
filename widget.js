function initialize() {
    let app_url = document.getElementById("ring-sizer")?.getAttribute("data-domain");
    if (!app_url) {
        app_url = "https://karthihc.github.io/HC-RINGSIZER/ring-sizer";
    }

    let backdrop = document.createElement("div");
    backdrop.id = "backdrop_ring_sizer";
    backdrop.style.overflow = "hidden";
    backdrop.style.display = "none";
    backdrop.style.position = "fixed";
    backdrop.style.zIndex = "9999999999";
    backdrop.style.left = "0";
    backdrop.style.top = "0";
    backdrop.style.right = "0";
    backdrop.style.bottom = "0";
    backdrop.style.backgroundColor = "#00000055";

    let wrapper = document.createElement("div");
    wrapper.id = "wrapper_ring_sizer";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "fixed";
    wrapper.style.left = "0%";
    wrapper.style.top = "0%";
    wrapper.style.right = "0%";
    wrapper.style.bottom = "0%";
    if (window.innerWidth <= 768) {
        wrapper.style.height = "100%";
    } else {
        wrapper.style.height = "660px";
    }
    // wrapper.style.maxWidth = "1100px";
    wrapper.style.margin = "auto";
    wrapper.style.borderRadius = "5px";
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.boxShadow = "0px 0px 10px 5px #22222255";

    let iframe = document.createElement("iframe");
    iframe.id = "ifrm_ring_sizer";
    iframe.name = "ifrm_ring_sizer";
    iframe.frameBorder = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.display = "block";
    iframe.style.margin = "auto";

    document.getElementById("ring-sizer")?.addEventListener("click", open_iframe, false);
    backdrop.appendChild(wrapper);
    wrapper.appendChild(iframe);
    document.body.appendChild(backdrop);

    function open_iframe() {
        iframe.src = app_url;
        backdrop.style.display = "block";
    }

    window.close_iframe = function() {
        iframe.src = "";
        backdrop.style.display = "none";
    };
}

initialize();

document.addEventListener("DOMContentLoaded", () => {
    // Select the element by its ID
    let selectedWrapper = document.getElementById("wrapper_ring_sizer");

    // Function to set the wrapper height dynamically based on the ratio
    const setWrapperSize = () => {
        let width = window.innerWidth <= 1100 ? window.innerWidth : 1100; // Max width is 1100px
        let height = width / (1100 / 560); // Maintain 1100:560 ratio
        selectedWrapper.style.width = `${width}px`;
        selectedWrapper.style.height = `${height}px`;
        selectedWrapper.style.margin = "0 auto"; // Center the wrapper horizontally
    };

    // Set the size initially
    setWrapperSize();

    // Update the size on window resize
    window.addEventListener("resize", setWrapperSize);
});



var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function (e) {
    // Directly check if the message is 'close_iframe'
    if (e.data == "close_iframe") {
        // Call the global close_iframe function
        window.close_iframe();
    }
}, false);
