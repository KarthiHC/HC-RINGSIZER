function initialize() {
    // Device detection and screen size configuration
    const deviceConfig = {
        // iPhone 13 and newer dimensions (accounting for different models)
        iPhoneSizes: {
            mini: { width: 375, height: 812 },  // iPhone 13 mini
            regular: { width: 390, height: 844 }, // iPhone 13/14
            plus: { width: 428, height: 926 },    // iPhone 13/14 Pro Max
            current: null
        },
        // Common laptop screen sizes (focusing on 13")
        laptopSizes: {
            size13: { width: 1280, height: 800 }, // Common 13" resolution
            size13Retina: { width: 2560, height: 1600 }, // Retina 13"
            current: null
        }
    };

    // Detect device type and screen configuration
    function detectDevice() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Check if device is mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Detect iPhone model based on screen dimensions
            if (width <= 375) deviceConfig.iPhoneSizes.current = 'mini';
            else if (width <= 390) deviceConfig.iPhoneSizes.current = 'regular';
            else deviceConfig.iPhoneSizes.current = 'plus';
            
            return 'mobile';
        } else {
            // Detect laptop screen size
            const actualWidth = width * pixelRatio;
            if (actualWidth >= 2560) deviceConfig.laptopSizes.current = 'size13Retina';
            else deviceConfig.laptopSizes.current = 'size13';
            
            return 'laptop';
        }
    }

    // Get optimal dimensions based on device
    function getOptimalDimensions() {
        const deviceType = detectDevice();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        if (deviceType === 'mobile') {
            return {
                width: screenWidth * 0.95, // 95% of screen width
                height: screenHeight * 0.9, // 90% of screen height
                borderRadius: '12px',
                padding: '10px',
                marginTop: '5%'
            };
        } else {
            // Laptop optimizations
            return {
                width: Math.min(1100, screenWidth * 0.85), // Max 1100px or 85% of screen
                height: Math.min(660, screenHeight * 0.85), // Max 660px or 85% of screen
                borderRadius: '16px',
                padding: '20px',
                marginTop: '0'
            };
        }
    }

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
    backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    let wrapper = document.createElement("div");
    wrapper.id = "wrapper_ring_sizer";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "fixed";
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)";
    
    // Close button with improved mobile touch target
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "×";
    closeButton.style.position = "absolute";
    closeButton.style.right = "10px";
    closeButton.style.top = "10px";
    closeButton.style.width = "44px"; // Larger touch target
    closeButton.style.height = "44px";
    closeButton.style.border = "none";
    closeButton.style.background = "rgba(0, 0, 0, 0.1)";
    closeButton.style.borderRadius = "50%";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "#666";
    closeButton.style.zIndex = "2";
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
    closeButton.onclick = window.close_iframe;

    let iframe = document.createElement("iframe");
    iframe.id = "ifrm_ring_sizer";
    iframe.name = "ifrm_ring_sizer";
    iframe.frameBorder = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.display = "block";
    iframe.style.margin = "auto";
    iframe.style.borderRadius = "inherit";

    // Apply device-specific styles
    function applyResponsiveStyles() {
        const dimensions = getOptimalDimensions();
        const deviceType = detectDevice();
        
        wrapper.style.width = dimensions.width + 'px';
        wrapper.style.height = dimensions.height + 'px';
        wrapper.style.borderRadius = dimensions.borderRadius;
        wrapper.style.padding = dimensions.padding;
        
        if (deviceType === 'mobile') {
            wrapper.style.left = '50%';
            wrapper.style.top = dimensions.marginTop;
            wrapper.style.transform = 'translateX(-50%)';
            
            // Add safe area insets for modern iPhones
            wrapper.style.paddingTop = 'env(safe-area-inset-top)';
            wrapper.style.paddingBottom = 'env(safe-area-inset-bottom)';
            
            // Optimize touch interactions
            wrapper.style.WebkitOverflowScrolling = 'touch';
            closeButton.style.width = '44px';
            closeButton.style.height = '44px';
        } else {
            wrapper.style.left = '50%';
            wrapper.style.top = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
            closeButton.style.width = '36px';
            closeButton.style.height = '36px';
        }
    }

    document.getElementById("ring-sizer")?.addEventListener("click", open_iframe, false);
    backdrop.appendChild(wrapper);
    wrapper.appendChild(closeButton);
    wrapper.appendChild(iframe);
    document.body.appendChild(backdrop);

    // Handle orientation changes and resize
    window.addEventListener("resize", applyResponsiveStyles);
    window.addEventListener("orientationchange", applyResponsiveStyles);

    function open_iframe() {
        iframe.src = app_url;
        backdrop.style.display = "block";
        applyResponsiveStyles();
        
        // Prevent background scrolling on mobile
        document.body.style.overflow = 'hidden';
        
        // Add safe-area-inset meta tag for modern iPhones
        if (!document.querySelector('meta[name="viewport"][content*="viewport-fit=cover"]')) {
            const viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
            document.head.appendChild(viewportMeta);
        }
    }

    window.close_iframe = function() {
        iframe.src = "";
        backdrop.style.display = "none";
        document.body.style.overflow = '';
    };

    // Initial setup
    applyResponsiveStyles();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}

// Simple message handler for iframe close
window.addEventListener("message", function(event) {
    if (event.data === "close_iframe") {
        window.close_iframe();
    }
}, false);
