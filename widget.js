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
            sizeLarger: { width: 1920, height: 1080 }, // Base size for larger screens
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
            // Detect screen size category
            const actualWidth = width * pixelRatio;
            if (actualWidth <= 1280) deviceConfig.laptopSizes.current = 'size13';
            else if (actualWidth <= 2560) deviceConfig.laptopSizes.current = 'size13Retina';
            else deviceConfig.laptopSizes.current = 'sizeLarger';
            
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
                width: screenWidth,
                height: screenHeight,
                borderRadius: '0',
                padding: '0',
                marginTop: '0'
            };
        } else {
            // For all desktop screens, use percentage-based sizing
            const targetWidth = Math.min(screenWidth * 0.9, 1800); // 90% of screen width, max 1800px
            const targetHeight = Math.min(screenHeight * 0.9, targetWidth * 0.6); // 90% of height or maintain ratio
            
            return {
                width: Math.round(targetWidth),
                height: Math.round(targetHeight),
                borderRadius: '16px',
                padding: '0px',
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
        wrapper.style.boxShadow = deviceType === 'mobile' ? 'none' : "0 10px 25px rgba(0, 0, 0, 0.2)";
        
        if (deviceType === 'mobile') {
            wrapper.style.left = '0';
            wrapper.style.top = '0';
            wrapper.style.transform = 'none';
            wrapper.style.maxWidth = '100%';
            wrapper.style.maxHeight = '100%';
            wrapper.style.paddingTop = '0';
            wrapper.style.paddingBottom = '0';
            wrapper.style.WebkitOverflowScrolling = 'touch';
        } else {
            wrapper.style.left = '50%';
            wrapper.style.top = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
        }
    }

    document.getElementById("ring-sizer")?.addEventListener("click", open_iframe, false);
    backdrop.appendChild(wrapper);
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
