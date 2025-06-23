// GPS Coordinate Plotter Configuration
// Replace 'YOUR_API_KEY_HERE' with your actual Google Maps API key

window.APP_CONFIG = {
    // Google Maps API Configuration
    GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    
    // Coordinate System Configuration
    UTM_ZONE: 38, // UTM Zone for Iraq/Middle East
    DUNUM_CONVERSION: 2500, // Square meters per dunum (regional standard)
    
    // Map Configuration
    DEFAULT_ZOOM: 18,
    MAX_ZOOM: 22,
    DEFAULT_CENTER: { 
        lat: 34.979977081647554, 
        lng: 43.362018079789166 
    }, // Iraq region
    
    // Application Settings
    MAX_POINTS: 1000, // Maximum number of coordinate points
    MAX_HISTORY_SIZE: 20, // Maximum undo/redo history size
    TOAST_DURATION: 3000, // Toast notification duration in milliseconds
    
    // Coordinate Validation Ranges
    COORDINATE_RANGES: {
        UTM: {
            EASTING: { min: 0, max: 1000000 },
            NORTHING: { min: 0, max: 10000000 }
        },
        LAT: { min: -90, max: 90 },
        LNG: { min: -180, max: 180 }
    },
    
    // Sample Coordinates for testing
    SAMPLE_COORDINATES: {
        UTM: `357846,3867702*357706,3867583
357522,3867753*357578,3867819
357506,3867904*357618,3867982`,
        
        LATLON: `31.9539,35.9106
31.9540,35.9107*31.9541,35.9108
31.9542,35.9109*31.9543,35.9110`
    },
    
    // Export Settings
    EXPORT_FORMATS: ['json', 'csv', 'kml'],
    AUTO_SAVE: true,
    
    // UI Settings
    DEFAULT_COLOR: '#ff0000',
    DEFAULT_OPACITY: 0.35,
    
    // Error Messages (Arabic)
    ERROR_MESSAGES: {
        API_LOAD_ERROR: 'خطأ في تحميل خرائط Google. يرجى التحقق من اتصال الإنترنت وإعدادات API.',
        COORDINATE_PARSE_ERROR: 'خطأ في تحليل الإحداثيات',
        CONVERSION_ERROR: 'خطأ في تحويل الإحداثيات',
        VALIDATION_ERROR: 'خطأ في التحقق من صحة البيانات',
        EXPORT_ERROR: 'خطأ في تصدير البيانات',
        SAVE_ERROR: 'خطأ في حفظ البيانات'
    },
    
    // Success Messages (Arabic)
    SUCCESS_MESSAGES: {
        APP_LOADED: 'تم تحميل التطبيق بنجاح!',
        POLYGON_DRAWN: 'تم رسم المضلع بنجاح!',
        LINE_DRAWN: 'تم رسم الخط بنجاح!',
        DATA_EXPORTED: 'تم تصدير البيانات بنجاح',
        DATA_SAVED: 'تم حفظ البيانات بنجاح',
        UNDO_SUCCESS: 'تم التراجع عن الإجراء السابق',
        REDO_SUCCESS: 'تم إعادة الإجراء'
    },
    
    // Warning Messages (Arabic)
    WARNING_MESSAGES: {
        NO_UNDO: 'لا توجد إجراءات للتراجع عنها',
        NO_REDO: 'لا توجد إجراءات لإعادة تنفيذها',
        NO_DATA_EXPORT: 'لا توجد بيانات للتصدير',
        INSUFFICIENT_POINTS: 'يجب إدخال 3 نقاط على الأقل لرسم المضلع'
    }
};

// Configuration validation
(function() {
    'use strict';
    
    // Check if API key is set
    if (!APP_CONFIG.GOOGLE_MAPS_API_KEY || APP_CONFIG.GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Google Maps API key not configured. Please set your API key in config.js');
        
        // Show warning to user
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ffeaa7;
            z-index: 10000;
            max-width: 300px;
            font-family: 'Cairo', sans-serif;
            direction: rtl;
        `;
        warningDiv.innerHTML = `
            <strong>تحذير:</strong><br>
            مفتاح API خرائط Google غير مُعد. يرجى إعداده في ملف config.js
        `;
        document.body.appendChild(warningDiv);
        
        // Remove warning after 10 seconds
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.parentNode.removeChild(warningDiv);
            }
        }, 10000);
    }
    
    // Validate configuration
    if (APP_CONFIG.UTM_ZONE < 1 || APP_CONFIG.UTM_ZONE > 60) {
        console.error('❌ Invalid UTM zone configuration');
    }
    
    if (APP_CONFIG.DUNUM_CONVERSION <= 0) {
        console.error('❌ Invalid dunum conversion factor');
    }
    
    if (APP_CONFIG.MAX_POINTS < 3) {
        console.error('❌ Maximum points must be at least 3');
    }
    
    console.log('✅ Configuration loaded successfully');
})(); 