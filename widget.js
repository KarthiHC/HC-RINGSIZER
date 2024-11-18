function initialize() {
    let app_url = document.getElementById("ring-sizer")?.getAttribute("data-domain");
    if (!app_url) {
        app_url = "https://karthihc.github.io/HC-RINGSIZER/ring-sizer";
    }
    let backdrop = null;
    let wrapper = null;
    let iframe = null;
    let body = document.getElementsByTagName("body")[0];
    let store_code = document.getElementById("ring-sizer")?.getAttribute("data-store_code");
    let ring_sizer_url = app_url;
    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    backdrop = document.createElement("div");
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

    wrapper = document.createElement("div");
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
        wrapper.style.height = "560px";
    }
    wrapper.style.maxWidth = "1100px";
    wrapper.style.margin = "auto";
    wrapper.style.borderRadius = "5px";
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.boxShadow = "0px 0px 10px 5px #22222255";

    if (iOS) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (parseInt(v[1], 10) < 13) {
            wrapper.style.cssText += 'overflow:auto;-webkit-overflow-scrolling:touch';
        }
    }

    iframe = document.createElement("iframe");
    iframe.id = "ifrm_ring_sizer";
    iframe.name = "ifrm_ring_sizer";
    iframe.frameBorder = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.display = "block";
    iframe.style.margin = "auto";

    // Ensure open_iframe function exists and attach the event listener
    document.getElementById("ring-sizer")?.addEventListener("click", open_iframe, false);

    backdrop.appendChild(wrapper);
    wrapper.appendChild(iframe);
    body.appendChild(backdrop);

    function open_iframe() {
        iframe.src = ring_sizer_url;
        backdrop.style.display = "block";
    }

    // Define close_iframe function
    window.close_iframe = function() {
        iframe.src = "";
        backdrop.style.display = "none";
    };
}

initialize();

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function (e) {
    let app_url = document.getElementById("ring-sizer").getAttribute("data-domain");
    if (!app_url) {
        app_url = "karthihc.github.io";
    }
    var origin_url = e.origin.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];

    if (origin_url == app_url && e.data == "close_iframe") {
        var body = document.getElementsByTagName("body")[0];
        var iframe = document.getElementById("ifrm_ring_sizer");
        var wrapper = document.getElementById("wrapper_ring_sizer");
        var backdrop = document.getElementById("backdrop_ring_sizer");
        
        // Ensure the close_iframe function is triggered
        window.close_iframe();
    }
}, false);
