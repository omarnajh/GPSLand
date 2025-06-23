// GPS Coordinate Plotter Application
// Modular structure with proper error handling and security

(function() {
    'use strict';

    // Configuration validation
    if (!window.APP_CONFIG) {
        console.error('APP_CONFIG not found. Please check configuration.');
        return;
    }

    // Main Application Class
    class GPSPlotterApp {
        constructor() {
            this.config = window.APP_CONFIG;
            this.state = {
                map: null,
                polygons: [], // Array to store multiple polygons
                currentPolygonId: null, // Currently selected polygon
                markers: [], // All markers for all polygons
                colorPath: '#ff0000',
                farmerName: '',
                polygonOpacity: 0.35,
                geocoder: null,
                activeInfoWindow: null,
                isDrawingLine: false,
                currentLine: null,
                lineCoordinates: [],
                lineMarkers: [],
                lineDistance: 0,
                history: [], // For undo/redo functionality
                historyIndex: -1,
                polygonCounter: 0 // Counter for unique polygon IDs
            };
            
            this.validators = new Validators();
            this.coordinateConverter = new CoordinateConverter(this.config.UTM_ZONE);
            this.dataManager = new DataManager();
            this.uiManager = new UIManager();
            
            this.init();
        }

        init() {
            try {
                this.initMap();
                this.bindEvents();
                this.loadSavedData();
                this.updateCoordinateFormatHelp(); // Set initial coordinate format help
                this.uiManager.showToast('تم تحميل التطبيق بنجاح', 'success');
            } catch (error) {
                console.error('Initialization error:', error);
                this.uiManager.showToast('خطأ في تحميل التطبيق', 'error');
            }
        }

        // Initialize Google Maps
        initMap() {
            const mapOptions = {
                zoom: 10,
                center: { lat: 31.9539, lng: 35.9106 }, // Jordan center
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                gestureHandling: 'cooperative'
            };

            this.state.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            this.state.geocoder = new google.maps.Geocoder();

            // Add map click listener for coordinates display
            this.state.map.addListener('click', (event) => {
                this.displayCurrentCoordinates(event.latLng);
            });

            // Add right-click listener for line drawing
            this.state.map.addListener('rightclick', (event) => {
                this.handleRightClick(event);
            });
        }

        // Bind event listeners
        bindEvents() {
            // Form inputs
            document.getElementById('farmerName').addEventListener('input', (e) => {
                this.state.farmerName = this.validators.sanitizeInput(e.target.value);
            });

            document.getElementById('polygonColor').addEventListener('change', (e) => {
                this.state.colorPath = e.target.value;
            });

            document.getElementById('polygonOpacity').addEventListener('input', (e) => {
                this.state.polygonOpacity = parseFloat(e.target.value);
                document.getElementById('opacityValue').textContent = Math.round(this.state.polygonOpacity * 100) + '%';
            });

            // Map type selector
            document.querySelectorAll('input[name="mapType"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.state.map.setMapTypeId(e.target.value);
                });
            });

            // Coordinate system selector
            document.querySelectorAll('input[name="coordinateSystem"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateCoordinateFormatHelp();
                    // Clear input when switching coordinate systems
                    document.getElementById('coordinateInput').value = '';
                    this.uiManager.showToast(`تم التبديل إلى نظام الإحداثيات: ${e.target.value.toUpperCase()}`, 'info');
                });
            });

            // Buttons
            document.getElementById('drawPolygon').addEventListener('click', () => {
                this.drawPolygonFromInput();
            });

            document.getElementById('clearInput').addEventListener('click', () => {
                this.clearCoordinateInput();
            });

            document.getElementById('loadSample').addEventListener('click', () => {
                this.loadSampleCoordinates();
            });

            document.getElementById('exportData').addEventListener('click', () => {
                this.exportData();
            });

            document.getElementById('printMap').addEventListener('click', () => {
                window.print();
            });

            document.getElementById('undoAction').addEventListener('click', () => {
                this.undoAction();
            });

            document.getElementById('redoAction').addEventListener('click', () => {
                this.redoAction();
            });

            document.getElementById('clearLine').addEventListener('click', () => {
                this.clearCurrentLine();
            });

            document.getElementById('clearMap').addEventListener('click', () => {
                this.clearMap();
            });

            // Global error handler
            window.addEventListener('error', (e) => this.handleGlobalError(e));
            window.addEventListener('resize', () => this.handleResize());
        }

        // Display current coordinates
        displayCurrentCoordinates(latLng) {
            const coordinateDisplay = document.getElementById('currentCoordinates');
            if (coordinateDisplay) {
                coordinateDisplay.innerHTML = `
                    <span><strong>Lat:</strong> ${latLng.lat().toFixed(8)}</span><br>
                    <span><strong>Lng:</strong> ${latLng.lng().toFixed(8)}</span>
                `;
            }
        }

        // Handle right click for line drawing
        handleRightClick(event) {
            if (!this.state.isDrawingLine) {
                // Start drawing line
                this.state.isDrawingLine = true;
                this.state.lineCoordinates = [event.latLng];
                
                // Create start marker
                const startMarker = new google.maps.Marker({
                    position: event.latLng,
                    map: this.state.map,
                    label: {
                        text: 'بداية',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#28a745',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });
                
                this.state.lineMarkers.push(startMarker);
                this.state.markers.push(startMarker);
                
                this.uiManager.showToast('انقر مرة أخرى لإنهاء الخط', 'info');
            } else {
                // End drawing line
                this.state.isDrawingLine = false;
                this.state.lineCoordinates.push(event.latLng);
                
                // Create end marker
                const endMarker = new google.maps.Marker({
                    position: event.latLng,
                    map: this.state.map,
                    label: {
                        text: 'نهاية',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#dc3545',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });
                
                this.state.lineMarkers.push(endMarker);
                this.state.markers.push(endMarker);
                
                // Draw line
                this.state.currentLine = new google.maps.Polyline({
                    path: this.state.lineCoordinates,
                    strokeColor: '#007bff',
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    geodesic: true
                });
                
                this.state.currentLine.setMap(this.state.map);
                
                // Calculate distance
                this.state.lineDistance = google.maps.geometry.spherical.computeDistanceBetween(
                    this.state.lineCoordinates[0],
                    this.state.lineCoordinates[1]
                );
                
                // Add distance label
                const midPoint = new google.maps.LatLng(
                    (this.state.lineCoordinates[0].lat() + this.state.lineCoordinates[1].lat()) / 2,
                    (this.state.lineCoordinates[0].lng() + this.state.lineCoordinates[1].lng()) / 2
                );
                
                const distanceMarker = new google.maps.Marker({
                    position: midPoint,
                    map: this.state.map,
                    label: {
                        text: `${this.state.lineDistance.toFixed(2)} م`,
                        color: '#007bff',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0
                    }
                });
                
                this.state.lineMarkers.push(distanceMarker);
                this.state.markers.push(distanceMarker);
                
                this.uiManager.showToast(`تم رسم خط بطول ${this.state.lineDistance.toFixed(2)} متر`, 'success');
            }
        }

        // Clear current line
        clearCurrentLine() {
            if (this.state.currentLine) {
                this.state.currentLine.setMap(null);
                this.state.currentLine = null;
            }
            
            this.state.lineMarkers.forEach(marker => {
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);
            });
            
            this.state.lineMarkers = [];
            this.state.lineCoordinates = [];
            this.state.isDrawingLine = false;
            this.state.lineDistance = 0;
            
            this.uiManager.showToast('تم مسح الخط', 'info');
        }

        // Change map type
        changeMapType(mapType) {
            this.state.map.setMapTypeId(mapType);
            this.uiManager.showToast(`تم تغيير نوع الخريطة إلى: ${this.getMapTypeName(mapType)}`, 'info');
        }

        // Get map type name in Arabic
        getMapTypeName(mapType) {
            const mapTypes = {
                'roadmap': 'الطرق',
                'satellite': 'الأقمار الصناعية',
                'hybrid': 'الهجين',
                'terrain': 'التضاريس'
            };
            return mapTypes[mapType] || mapType;
        }

        // Update map type display
        updateMapTypeDisplay() {
            const currentMapType = this.state.map.getMapTypeId();
            document.querySelector(`input[value="${currentMapType}"]`).checked = true;
        }

        // Get city name from coordinates
        getCityFromLatLng(latLng) {
            if (!this.state.geocoder) return;
            
            this.state.geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const cityName = results[0].formatted_address.split(',')[0];
                    const locationDisplay = document.getElementById('locationDisplay');
                    const cityNameSpan = document.getElementById('cityName');
                    
                    if (locationDisplay && cityNameSpan) {
                        cityNameSpan.textContent = cityName;
                        locationDisplay.style.display = 'block';
                    }
                }
            });
        }

        // Draw polygon from input coordinates
        drawPolygonFromInput() {
            this.uiManager.showLoading(true);
            
            try {
                const coordinateInput = document.getElementById('coordinateInput').value.trim();
                if (!coordinateInput) {
                    throw new Error('يرجى إدخال الإحداثيات أولاً');
                }

                // Parse coordinates
                const coordinates = this.parseCoordinates(coordinateInput);
                if (coordinates.length < 3) {
                    throw new Error('يجب إدخال 3 نقاط على الأقل لرسم المضلع');
                }

                // Convert to Lat/Lng based on selected coordinate system
                const latLngCoordinates = this.convertToLatLng(coordinates);

                // Create new polygon object
                const polygonId = this.generatePolygonId();
                const polygonData = {
                    id: polygonId,
                    coordinates: coordinates,
                    latLngCoordinates: latLngCoordinates,
                    coordinateSystem: this.getSelectedCoordinateSystem(),
                    farmerName: this.state.farmerName,
                    color: this.state.colorPath,
                    opacity: this.state.polygonOpacity,
                    polygon: null,
                    markers: [],
                    area: 0,
                    perimeter: 0,
                    timestamp: new Date().toISOString()
                };

                // Draw polygon
                this.drawPolygon(polygonData);
                
                // Add markers
                this.addMarkers(polygonData);
                
                // Calculate results
                this.calculatePolygonResults(polygonData);
                
                // Add to polygons array
                this.state.polygons.push(polygonData);
                this.state.currentPolygonId = polygonId;
                
                // Update polygon list UI
                this.updatePolygonList();
                
                // Display GPS coordinates for printing
                this.displayGpsCoordinates(polygonData.coordinates, polygonData.latLngCoordinates, polygonData.coordinateSystem);
                
                // Update city name based on polygon center
                this.getCityFromLatLng(this.getPolygonCenter(polygonData.latLngCoordinates));
                
                // Show results section
                this.uiManager.showSection('resultsSection', true);
                this.uiManager.showSection('coordinatesSection', true);
                
                this.uiManager.showToast(`تم رسم المضلع ${polygonData.farmerName || 'الجديد'} بنجاح!`, 'success');
                
                // Save to history
                this.saveToHistory();
                
            } catch (error) {
                this.uiManager.showToast(error.message, 'error');
                console.error('Error drawing polygon:', error);
            } finally {
                this.uiManager.showLoading(false);
            }
        }

        // Generate unique polygon ID
        generatePolygonId() {
            return `polygon_${++this.state.polygonCounter}_${Date.now()}`;
        }

        // Draw polygon on map
        drawPolygon(polygonData) {
            polygonData.polygon = new google.maps.Polygon({
                path: polygonData.latLngCoordinates,
                strokeColor: polygonData.color,
                strokeOpacity: 1.0,
                strokeWeight: 3,
                fillColor: polygonData.color,
                fillOpacity: polygonData.opacity,
                geodesic: true
            });
            
            polygonData.polygon.setMap(this.state.map);
            
            // Add click listener for polygon selection
            polygonData.polygon.addListener('click', () => {
                this.selectPolygon(polygonData.id);
            });
            
            // Fit map to polygon bounds
            const bounds = new google.maps.LatLngBounds();
            polygonData.latLngCoordinates.forEach(coord => bounds.extend(coord));
            this.state.map.fitBounds(bounds);
        }

        // Add markers to map for specific polygon
        addMarkers(polygonData) {
            // Close any active info window when drawing new markers
            if (this.state.activeInfoWindow) {
                this.state.activeInfoWindow.close();
                this.state.activeInfoWindow = null;
            }

            polygonData.latLngCoordinates.forEach((coord, index) => {
                const utm = polygonData.coordinates[index];
                const marker = new google.maps.Marker({
                    position: coord,
                    map: this.state.map,
                    label: {
                        text: `${polygonData.id}_${index + 1}`,
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: polygonData.color,
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });

                // Safe info window content
                const infoWindowContent = this.uiManager.createSafeInfoWindow(`
                    <div style="font-family: 'Courier New', monospace; font-size: 0.9rem; text-align: left; direction: ltr; line-height: 1.5;">
                        <strong>${polygonData.farmerName || 'Polygon'} - Point ${index + 1}</strong>
                        <hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;">
                        <strong>UTM:</strong><br>
                        E ${utm.easting.toFixed(4)}<br>
                        N ${utm.northing.toFixed(4)}<br>
                        <hr style="margin: 4px 0; border: none; border-top: 1px solid #ccc;">
                        <strong>Lat/Lng:</strong><br>
                        ${coord.lat().toFixed(8)},<br>
                        ${coord.lng().toFixed(8)}
                    </div>
                `);

                const infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });

                marker.addListener('click', () => {
                    if (this.state.activeInfoWindow) {
                        this.state.activeInfoWindow.close();
                    }
                    infoWindow.open({
                        anchor: marker,
                        map: this.state.map,
                    });
                    this.state.activeInfoWindow = infoWindow;
                });
                
                polygonData.markers.push(marker);
                this.state.markers.push(marker);
            });
            
            // Add farmer name marker at center
            if (polygonData.farmerName && polygonData.latLngCoordinates.length > 0) {
                const center = this.getPolygonCenter(polygonData.latLngCoordinates);
                const nameMarker = new google.maps.Marker({
                    position: center,
                    map: this.state.map,
                    label: {
                        text: polygonData.farmerName,
                        color: polygonData.color,
                        fontSize: '16px',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 0
                    }
                });
                
                polygonData.markers.push(nameMarker);
                this.state.markers.push(nameMarker);
            }
        }

        // Calculate results for specific polygon
        calculatePolygonResults(polygonData) {
            try {
                // Calculate area
                const area = google.maps.geometry.spherical.computeArea(polygonData.latLngCoordinates);
                polygonData.area = area / this.config.DUNUM_CONVERSION;
                
                // Calculate perimeter
                polygonData.perimeter = google.maps.geometry.spherical.computeLength(polygonData.latLngCoordinates);
                
                // Calculate distances between consecutive points
                const distances = [];
                for (let i = 0; i < polygonData.latLngCoordinates.length; i++) {
                    const nextIndex = (i + 1) % polygonData.latLngCoordinates.length;
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(
                        polygonData.latLngCoordinates[i], 
                        polygonData.latLngCoordinates[nextIndex]
                    );
                    distances.push({
                        from: i + 1,
                        to: nextIndex + 1,
                        distance: distance
                    });
                }
                
                polygonData.distances = distances;
                
                // Update UI for current polygon
                if (this.state.currentPolygonId === polygonData.id) {
                    this.uiManager.updateResults(polygonData.area, polygonData.perimeter, polygonData.latLngCoordinates.length);
                    this.uiManager.updateDistanceResults(distances);
                }
                
            } catch (error) {
                console.error('Error calculating polygon results:', error);
                this.uiManager.showToast('خطأ في حساب النتائج', 'error');
            }
        }

        // Select a polygon
        selectPolygon(polygonId) {
            this.state.currentPolygonId = polygonId;
            const polygonData = this.state.polygons.find(p => p.id === polygonId);
            
            if (polygonData) {
                // Update UI with selected polygon data
                this.uiManager.updateResults(polygonData.area, polygonData.perimeter, polygonData.latLngCoordinates.length);
                this.uiManager.updateDistanceResults(polygonData.distances);
                this.displayGpsCoordinates(polygonData.coordinates, polygonData.latLngCoordinates, polygonData.coordinateSystem);
                
                // Update form fields
                const farmerInput = document.getElementById('farmerName');
                const colorInput = document.getElementById('polygonColor');
                const opacityInput = document.getElementById('polygonOpacity');
                
                if (farmerInput) farmerInput.value = polygonData.farmerName;
                if (colorInput) colorInput.value = polygonData.color;
                if (opacityInput) {
                    opacityInput.value = polygonData.opacity;
                    document.getElementById('opacityValue').textContent = Math.round(polygonData.opacity * 100) + '%';
                }
                
                this.uiManager.showToast(`تم تحديد المضلع: ${polygonData.farmerName || 'غير محدد'}`, 'info');
            }
        }

        // Update polygon list UI
        updatePolygonList() {
            const polygonListContainer = document.getElementById('polygonList');
            if (!polygonListContainer) return;
            
            polygonListContainer.innerHTML = '';
            
            this.state.polygons.forEach(polygonData => {
                const polygonItem = document.createElement('div');
                polygonItem.className = 'polygon-item';
                polygonItem.innerHTML = `
                    <div class="polygon-info">
                        <span class="polygon-name">${polygonData.farmerName || 'مضلع غير محدد'}</span>
                        <span class="polygon-area">${polygonData.area.toFixed(4)} دنم</span>
                        <span class="polygon-points">${polygonData.latLngCoordinates.length} نقطة</span>
                    </div>
                    <div class="polygon-actions">
                        <button class="btn btn-sm btn-primary" onclick="app.selectPolygon('${polygonData.id}')">
                            <i class="fas fa-eye"></i> عرض
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deletePolygon('${polygonData.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                `;
                polygonListContainer.appendChild(polygonItem);
            });
            
            // Update summary
            this.updatePolygonSummary();
        }

        // Update polygon summary
        updatePolygonSummary() {
            const totalPolygonsElement = document.getElementById('totalPolygons');
            const totalAreaElement = document.getElementById('totalAreaAll');
            
            if (totalPolygonsElement) {
                totalPolygonsElement.textContent = this.state.polygons.length;
            }
            
            if (totalAreaElement) {
                const totalArea = this.state.polygons.reduce((sum, polygon) => sum + polygon.area, 0);
                totalAreaElement.textContent = `${totalArea.toFixed(4)} دنم`;
            }
            
            // Show/hide polygon list section
            const polygonListSection = document.getElementById('polygonListSection');
            if (polygonListSection) {
                polygonListSection.style.display = this.state.polygons.length > 0 ? 'block' : 'none';
            }
        }

        // Delete a polygon
        deletePolygon(polygonId) {
            const polygonIndex = this.state.polygons.findIndex(p => p.id === polygonId);
            if (polygonIndex === -1) return;
            
            const polygonData = this.state.polygons[polygonIndex];
            
            // Remove polygon from map
            if (polygonData.polygon) {
                polygonData.polygon.setMap(null);
            }
            
            // Remove markers from map
            polygonData.markers.forEach(marker => {
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);
            });
            
            // Remove from arrays
            this.state.polygons.splice(polygonIndex, 1);
            this.state.markers = this.state.markers.filter(marker => !polygonData.markers.includes(marker));
            
            // Update current polygon selection
            if (this.state.currentPolygonId === polygonId) {
                this.state.currentPolygonId = this.state.polygons.length > 0 ? this.state.polygons[0].id : null;
            }
            
            // Update UI
            this.updatePolygonList();
            
            if (this.state.polygons.length === 0) {
                this.uiManager.showSection('resultsSection', false);
                this.uiManager.showSection('coordinatesSection', false);
            }
            
            this.uiManager.showToast(`تم حذف المضلع: ${polygonData.farmerName || 'غير محدد'}`, 'success');
        }

        // Enhanced clearMap with multiple polygon support
        clearMap() {
            // Clear all polygons
            this.state.polygons.forEach(polygonData => {
                if (polygonData.polygon) {
                    polygonData.polygon.setMap(null);
                }
            });
            this.state.polygons = [];
            
            // Clear all markers
            this.state.markers.forEach(marker => {
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);
            });
            this.state.markers = [];

            // Close info window
            if (this.state.activeInfoWindow) {
                this.state.activeInfoWindow.close();
                this.state.activeInfoWindow = null;
            }
            
            // Clear any drawn lines
            this.clearCurrentLine();
            
            // Reset current polygon
            this.state.currentPolygonId = null;
            
            // Hide sections
            this.uiManager.showSection('resultsSection', false);
            this.uiManager.showSection('coordinatesSection', false);
            
            // Clear coordinate list
            const coordinateList = document.getElementById('coordinateList');
            if (coordinateList) {
                coordinateList.innerHTML = '';
            }
            
            // Clear polygon list
            this.updatePolygonList();
            
            this.uiManager.showToast('تم مسح جميع المضلعات', 'info');
        }

        // Enhanced exportData with multiple polygon support
        exportData() {
            if (this.state.polygons.length === 0) {
                this.uiManager.showToast('لا توجد بيانات للتصدير', 'error');
                return;
            }
            
            try {
                const exportData = {
                    polygons: this.state.polygons.map(polygonData => ({
                        id: polygonData.id,
                        farmerName: polygonData.farmerName,
                        color: polygonData.color,
                        coordinates: polygonData.coordinates,
                        area: `${polygonData.area.toFixed(4)} دنم`,
                        perimeter: `${polygonData.perimeter.toFixed(4)} متر`,
                        pointCount: polygonData.latLngCoordinates.length,
                        timestamp: polygonData.timestamp
                    })),
                    totalPolygons: this.state.polygons.length,
                    totalArea: this.state.polygons.reduce((sum, p) => sum + p.area, 0),
                    exportTimestamp: new Date().toISOString()
                };
                
                // Export JSON
                const dataStr = JSON.stringify(exportData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = `gps_data_multiple_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                
                // Export CSV
                const csvData = this.dataManager.exportMultiplePolygonsToCSV(exportData);
                const csvBlob = new Blob([csvData], { type: 'text/csv' });
                const csvLink = document.createElement('a');
                csvLink.href = URL.createObjectURL(csvBlob);
                csvLink.download = `gps_data_multiple_${new Date().toISOString().split('T')[0]}.csv`;
                csvLink.click();
                
                this.uiManager.showToast(`تم تصدير ${this.state.polygons.length} مضلع بنجاح`, 'success');
                
            } catch (error) {
                console.error('Export error:', error);
                this.uiManager.showToast('خطأ في تصدير البيانات', 'error');
            }
        }

        // Print map
        printMap() {
            window.print();
            this.uiManager.showToast('جاري إعداد الطباعة...', 'info');
        }

        // Prepare for printing
        prepareForPrint() {
            if (this.state.map && this.state.currentPolygon) {
                const center = this.state.map.getCenter();
                const zoom = this.state.map.getZoom();
                
                // This is a common trick to force map re-rendering for print
                google.maps.event.trigger(this.state.map, 'resize');
                this.state.map.setCenter(center);
                this.state.map.setZoom(zoom);
            }
        }

        // After printing
        afterPrint() {
            // No specific action needed right now, but good to have.
        }

        // Show loading overlay
        showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');
            overlay.style.display = show ? 'flex' : 'none';
        }

        // Show toast notification
        showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            // Set message and type
            toastMessage.textContent = message;
            
            // Update toast style based on type
            toast.className = `toast toast-${type}`;
            
            // Show toast
            toast.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }

        // Error handling for Google Maps API
        handleGlobalError(e) {
            if (e.message.includes('Google Maps')) {
                this.showToast('خطأ في تحميل خرائط Google. يرجى التحقق من اتصال الإنترنت.', 'error');
            }
        }

        // Handle window resize
        handleResize() {
            if (this.state.map) {
                google.maps.event.trigger(this.state.map, 'resize');
            }
        }

        displayGpsCoordinates(coords, latLngCoords, coordinateSystem) {
            const coordinateList = document.getElementById('coordinateList');
            if (!coordinateList) return;
            coordinateList.innerHTML = ''; // Clear previous list

            coords.forEach((coord, index) => {
                const latLng = latLngCoords[index];
                const listItem = document.createElement('div');
                listItem.className = 'coordinate-list-item';

                let coordDisplay = '';
                if (coordinateSystem === 'utm') {
                    coordDisplay = `
                        <strong>النقطة ${index + 1}:</strong><br>
                        <span>UTM: ${coord.easting.toFixed(4)}, ${coord.northing.toFixed(4)}</span><br>
                        <span>Lat/Lng: ${latLng.lat().toFixed(8)}, ${latLng.lng().toFixed(8)}</span>
                    `;
                } else {
                    coordDisplay = `
                        <strong>النقطة ${index + 1}:</strong><br>
                        <span>Lat/Lng: ${coord.lat.toFixed(8)}, ${coord.lon.toFixed(8)}</span><br>
                        <span>UTM: ${this.coordinateConverter.latLngToUTM(coord.lat, coord.lon).join(', ')}</span>
                    `;
                }

                listItem.innerHTML = coordDisplay;
                coordinateList.appendChild(listItem);
            });
        }

        // Parse coordinate input with validation
        parseCoordinates(input) {
            try {
                if (!input || typeof input !== 'string') {
                    throw new Error('يرجى إدخال الإحداثيات');
                }

                const coordinateSystem = this.getSelectedCoordinateSystem();
                const lines = input.split('\n').filter(line => line.trim());
                const coordinates = [];
                
                for (const line of lines) {
                    const points = line.split('*');
                    for (const point of points) {
                        const coords = point.split(',').map(coord => coord.trim());
                        if (coords.length === 2) {
                            if (coordinateSystem === 'utm') {
                                const validatedCoords = this.validators.validateUTMCoordinates(coords[0], coords[1]);
                                coordinates.push(validatedCoords);
                            } else {
                                const validatedCoords = this.validators.validateLatLonCoordinates(coords[0], coords[1]);
                                coordinates.push(validatedCoords);
                            }
                        }
                    }
                }
                
                return this.validators.validatePolygonPoints(coordinates);
            } catch (error) {
                throw new Error(`خطأ في تحليل الإحداثيات: ${error.message}`);
            }
        }

        // Get selected coordinate system
        getSelectedCoordinateSystem() {
            const selectedRadio = document.querySelector('input[name="coordinateSystem"]:checked');
            return selectedRadio ? selectedRadio.value : 'utm';
        }

        // Convert coordinates to Lat/Lng based on selected system
        convertToLatLng(coordinates) {
            const coordinateSystem = this.getSelectedCoordinateSystem();
            
            if (coordinateSystem === 'utm') {
                return coordinates.map(coord => {
                    const latLng = this.utmToLatLng(coord.easting, coord.northing);
                    return new google.maps.LatLng(latLng[1], latLng[0]);
                });
            } else {
                return coordinates.map(coord => {
                    return new google.maps.LatLng(coord.lat, coord.lon);
                });
            }
        }

        // Update coordinate format help based on selected system
        updateCoordinateFormatHelp() {
            const coordinateSystem = this.getSelectedCoordinateSystem();
            const helpElement = document.getElementById('coordinateFormatHelp');
            const textarea = document.getElementById('coordinateInput');
            
            if (coordinateSystem === 'utm') {
                helpElement.innerHTML = `
                    <li>UTM: <code>Easting,Northing</code></li>
                    <li>مثال: <code>123456.78,9876543.21</code></li>
                    <li>يمكن إدخال عدة نقاط مفصولة بـ <code>*</code></li>
                `;
                textarea.placeholder = `أدخل الإحداثيات هنا...
مثال:
123456.78,9876543.21
234567.89,9876544.32*345678.90,9876545.43`;
            } else {
                helpElement.innerHTML = `
                    <li>Lat/Lon: <code>Latitude,Longitude</code></li>
                    <li>مثال: <code>31.9539,35.9106</code></li>
                    <li>يمكن إدخال عدة نقاط مفصولة بـ <code>*</code></li>
                `;
                textarea.placeholder = `أدخل الإحداثيات هنا...
مثال:
31.9539,35.9106
31.9540,35.9107*31.9541,35.9108`;
            }
        }

        // Load sample coordinates based on selected system
        loadSampleCoordinates() {
            const coordinateSystem = this.getSelectedCoordinateSystem();
            const sampleCoords = this.config.SAMPLE_COORDINATES[coordinateSystem.toUpperCase()];
            document.getElementById('coordinateInput').value = sampleCoords;
            this.uiManager.showToast(`تم تحميل الإحداثيات التجريبية (${coordinateSystem.toUpperCase()})`, 'info');
        }

        // Load saved data from localStorage
        loadSavedData() {
            try {
                const savedData = this.dataManager.loadData();
                if (savedData && savedData.length > 0) {
                    // Restore last saved state
                    const lastData = savedData[savedData.length - 1];
                    this.state.farmerName = lastData.farmerName || '';
                    this.state.colorPath = lastData.color || '#ff0000';
                    
                    // Update UI
                    const farmerInput = document.getElementById('farmerName');
                    const colorInput = document.getElementById('polygonColor');
                    if (farmerInput) farmerInput.value = this.state.farmerName;
                    if (colorInput) colorInput.value = this.state.colorPath;
                    
                    this.uiManager.showToast('تم استعادة البيانات المحفوظة', 'info');
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }

        // Save current state to history
        saveToHistory() {
            const currentState = {
                polygons: this.state.polygons.map(p => ({ ...p })),
                currentPolygonId: this.state.currentPolygonId,
                farmerName: this.state.farmerName,
                colorPath: this.state.colorPath,
                polygonOpacity: this.state.polygonOpacity
            };
            
            // Remove future history if we're not at the end
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
            }
            
            this.state.history.push(currentState);
            this.state.historyIndex = this.state.history.length - 1;
            
            // Limit history size
            if (this.state.history.length > 20) {
                this.state.history.shift();
                this.state.historyIndex--;
            }
        }

        // Undo action
        undoAction() {
            if (this.state.historyIndex > 0) {
                this.state.historyIndex--;
                this.restoreFromHistory();
                this.uiManager.showToast('تم التراجع عن الإجراء السابق', 'info');
            } else {
                this.uiManager.showToast('لا توجد إجراءات للتراجع عنها', 'warning');
            }
        }

        // Redo action
        redoAction() {
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.historyIndex++;
                this.restoreFromHistory();
                this.uiManager.showToast('تم إعادة الإجراء', 'info');
            } else {
                this.uiManager.showToast('لا توجد إجراءات لإعادة تنفيذها', 'warning');
            }
        }

        // Restore state from history
        restoreFromHistory() {
            const state = this.state.history[this.state.historyIndex];
            if (!state) return;
            
            // Clear current state
            this.clearMap();
            
            // Restore state
            this.state.farmerName = state.farmerName;
            this.state.colorPath = state.colorPath;
            this.state.polygonOpacity = state.polygonOpacity;
            this.state.currentPolygonId = state.currentPolygonId;
            
            // Update UI
            const farmerInput = document.getElementById('farmerName');
            const colorInput = document.getElementById('polygonColor');
            const opacityInput = document.getElementById('polygonOpacity');
            
            if (farmerInput) farmerInput.value = this.state.farmerName;
            if (colorInput) colorInput.value = this.state.colorPath;
            if (opacityInput) {
                opacityInput.value = this.state.polygonOpacity;
                document.getElementById('opacityValue').textContent = 
                    Math.round(this.state.polygonOpacity * 100) + '%';
            }
            
            // Restore polygons
            if (state.polygons && state.polygons.length > 0) {
                state.polygons.forEach(polygonData => {
                    // Recreate polygon objects
                    const restoredPolygon = {
                        ...polygonData,
                        polygon: null,
                        markers: []
                    };
                    
                    this.drawPolygon(restoredPolygon);
                    this.addMarkers(restoredPolygon);
                    this.calculatePolygonResults(restoredPolygon);
                    
                    this.state.polygons.push(restoredPolygon);
                });
                
                this.updatePolygonList();
                this.uiManager.showSection('resultsSection', true);
                this.uiManager.showSection('coordinatesSection', true);
            }
        }

        // Sample coordinates getter
        get SAMPLE_COORDINATES() {
            return this.config.SAMPLE_COORDINATES;
        }

        // Convert UTM to Lat/Lng
        utmToLatLng(easting, northing) {
            try {
                const validatedCoords = this.validators.validateUTMCoordinates(easting, northing);
                return this.coordinateConverter.utmToLatLng(validatedCoords.easting, validatedCoords.northing);
            } catch (error) {
                throw new Error(`خطأ في تحويل الإحداثيات: ${error.message}`);
            }
        }

        // Get polygon center
        getPolygonCenter(coordinates) {
            const bounds = new google.maps.LatLngBounds();
            coordinates.forEach(coord => bounds.extend(coord));
            return bounds.getCenter();
        }

        // Clear coordinate input
        clearCoordinateInput() {
            document.getElementById('coordinateInput').value = '';
            this.uiManager.showToast('تم مسح الإحداثيات', 'info');
        }
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        new GPSPlotterApp();
    });

    // Validators Class - Input validation and sanitization
    class Validators {
        constructor() {
            this.coordinateRanges = {
                utm: {
                    easting: { min: 0, max: 1000000 },
                    northing: { min: 0, max: 10000000 }
                },
                lat: { min: -90, max: 90 },
                lng: { min: -180, max: 180 }
            };
        }

        sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            return input.replace(/[<>\"'&]/g, '').trim();
        }

        validateUTMCoordinates(easting, northing) {
            const eastingNum = parseFloat(easting);
            const northingNum = parseFloat(northing);
            
            if (isNaN(eastingNum) || isNaN(northingNum)) {
                throw new Error('الإحداثيات يجب أن تكون أرقام صحيحة');
            }
            
            if (eastingNum < this.coordinateRanges.utm.easting.min || 
                eastingNum > this.coordinateRanges.utm.easting.max) {
                throw new Error(`قيمة Easting يجب أن تكون بين ${this.coordinateRanges.utm.easting.min} و ${this.coordinateRanges.utm.easting.max}`);
            }
            
            if (northingNum < this.coordinateRanges.utm.northing.min || 
                northingNum > this.coordinateRanges.utm.northing.max) {
                throw new Error(`قيمة Northing يجب أن تكون بين ${this.coordinateRanges.utm.northing.min} و ${this.coordinateRanges.utm.northing.max}`);
            }
            
            return { easting: eastingNum, northing: northingNum };
        }

        validateLatLonCoordinates(lat, lon) {
            try {
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                
                if (isNaN(latitude) || isNaN(longitude)) {
                    throw new Error('الإحداثيات يجب أن تكون أرقام صحيحة');
                }
                
                if (latitude < this.coordinateRanges.lat.min || latitude > this.coordinateRanges.lat.max) {
                    throw new Error(`خط العرض يجب أن يكون بين ${this.coordinateRanges.lat.min} و ${this.coordinateRanges.lat.max}`);
                }
                
                if (longitude < this.coordinateRanges.lng.min || longitude > this.coordinateRanges.lng.max) {
                    throw new Error(`خط الطول يجب أن يكون بين ${this.coordinateRanges.lng.min} و ${this.coordinateRanges.lng.max}`);
                }
                
                return {
                    lat: latitude,
                    lon: longitude
                };
            } catch (error) {
                throw new Error(`خطأ في إحداثيات Lat/Lon: ${error.message}`);
            }
        }

        validatePolygonPoints(coordinates) {
            if (!Array.isArray(coordinates) || coordinates.length < 3) {
                throw new Error('يجب إدخال 3 نقاط على الأقل لرسم المضلع');
            }
            
            if (coordinates.length > 1000) {
                throw new Error('الحد الأقصى للنقاط هو 1000 نقطة');
            }
            
            return coordinates;
        }
    }

    // Coordinate Converter Class - Safe coordinate transformations
    class CoordinateConverter {
        constructor(utmZone = 38) {
            this.utmZone = utmZone;
            this.setupProjections();
        }

        setupProjections() {
            try {
                proj4.defs(`EPSG:326${this.utmZone}`, 
                    `+proj=utm +zone=${this.utmZone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`);
                proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
            } catch (error) {
                console.error('Error setting up projections:', error);
                throw new Error('خطأ في إعداد نظام الإحداثيات');
            }
        }

        utmToLatLng(easting, northing) {
            try {
                const utmCoords = [Number(easting), Number(northing)];
                const latLngCoords = proj4(`EPSG:326${this.utmZone}`, 'EPSG:4326', utmCoords);
                
                if (!latLngCoords || latLngCoords.length !== 2) {
                    throw new Error('خطأ في تحويل الإحداثيات');
                }
                
                return latLngCoords;
            } catch (error) {
                console.error('UTM to LatLng conversion error:', error);
                throw new Error('خطأ في تحويل الإحداثيات من UTM إلى Lat/Lng');
            }
        }

        // Convert Lat/Lng to UTM
        latLngToUTM(lat, lng) {
            try {
                proj4.defs('EPSG:32638', '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
                proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
                
                const latLngCoords = [Number(lng), Number(lat)];
                const utmCoords = proj4('EPSG:4326', 'EPSG:32638', latLngCoords);
                
                return [utmCoords[0], utmCoords[1]];
            } catch (error) {
                throw new Error(`خطأ في تحويل Lat/Lng إلى UTM: ${error.message}`);
            }
        }
    }

    // Data Manager Class - Data persistence and management
    class DataManager {
        constructor() {
            this.storageKey = 'gps_plotter_data';
            this.maxHistorySize = 50;
        }

        saveData(data) {
            try {
                const existingData = this.loadData() || [];
                existingData.push({
                    ...data,
                    timestamp: new Date().toISOString(),
                    id: this.generateId()
                });
                
                // Keep only recent data
                if (existingData.length > this.maxHistorySize) {
                    existingData.splice(0, existingData.length - this.maxHistorySize);
                }
                
                localStorage.setItem(this.storageKey, JSON.stringify(existingData));
                return true;
            } catch (error) {
                console.error('Error saving data:', error);
                return false;
            }
        }

        loadData() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Error loading data:', error);
                return null;
            }
        }

        clearData() {
            try {
                localStorage.removeItem(this.storageKey);
                return true;
            } catch (error) {
                console.error('Error clearing data:', error);
                return false;
            }
        }

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        exportToCSV(data) {
            try {
                let csv = 'Farmer Name,Color,Area,Perimeter,Point Count,Timestamp\n';
                csv += `${data.farmerName || 'Unknown'},${data.color},${data.area},${data.perimeter},${data.pointCount},${data.timestamp}\n`;
                
                csv += '\nCoordinates (UTM):\n';
                csv += 'Point,Easting,Northing\n';
                data.coordinates.forEach((coord, index) => {
                    csv += `${index + 1},${coord.easting},${coord.northing}\n`;
                });
                
                return csv;
            } catch (error) {
                console.error('Error creating CSV:', error);
                throw new Error('خطأ في إنشاء ملف CSV');
            }
        }

        exportToKML(data) {
            try {
                let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>${data.farmerName || 'GPS Plot'}</name>
<description>Generated by GPS Coordinate Plotter</description>
<Placemark>
<name>${data.farmerName || 'Polygon'}</name>
<description>Area: ${data.area}, Perimeter: ${data.perimeter}</description>
<Style>
<LineStyle>
<color>${this.hexToKMLColor(data.color)}</color>
<width>3</width>
</LineStyle>
<PolyStyle>
<color>${this.hexToKMLColor(data.color)}</color>
<fill>1</fill>
<outline>1</outline>
</PolyStyle>
</Style>
<Polygon>
<outerBoundaryIs>
<LinearRing>
<coordinates>`;
                
                // Convert UTM coordinates to LatLng for KML
                data.coordinates.forEach(coord => {
                    const latLng = proj4(`EPSG:32638`, 'EPSG:4326', [coord.easting, coord.northing]);
                    kml += `${latLng[0]},${latLng[1]},0 `;
                });
                
                kml += `</coordinates>
</LinearRing>
</outerBoundaryIs>
</Polygon>
</Placemark>
</Document>
</kml>`;
                
                return kml;
            } catch (error) {
                console.error('Error creating KML:', error);
                throw new Error('خطأ في إنشاء ملف KML');
            }
        }

        exportMultiplePolygonsToCSV(data) {
            try {
                let csv = 'Polygon Summary\n';
                csv += 'Total Polygons,Total Area (Dunum),Export Timestamp\n';
                csv += `${data.totalPolygons},${data.totalArea.toFixed(4)},${data.exportTimestamp}\n\n`;
                
                csv += 'Individual Polygons\n';
                csv += 'ID,Farmer Name,Color,Area (Dunum),Perimeter (m),Point Count,Timestamp\n';
                
                data.polygons.forEach(polygon => {
                    csv += `${polygon.id},${polygon.farmerName || 'Unknown'},${polygon.color},${polygon.area},${polygon.perimeter},${polygon.pointCount},${polygon.timestamp}\n`;
                });
                
                csv += '\nCoordinates by Polygon\n';
                data.polygons.forEach((polygon, polygonIndex) => {
                    csv += `\nPolygon ${polygonIndex + 1}: ${polygon.farmerName || 'Unknown'}\n`;
                    csv += 'Point,Easting,Northing\n';
                    polygon.coordinates.forEach((coord, index) => {
                        csv += `${index + 1},${coord.easting},${coord.northing}\n`;
                    });
                });
                
                return csv;
            } catch (error) {
                console.error('Error creating multiple polygons CSV:', error);
                throw new Error('خطأ في إنشاء ملف CSV للمضلعات المتعددة');
            }
        }

        hexToKMLColor(hex) {
            // Convert hex color to KML format (AABBGGRR)
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            return `ff${b.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${r.toString(16).padStart(2, '0')}`;
        }
    }

    // UI Manager Class - User interface management
    class UIManager {
        constructor() {
            this.toastTimeout = null;
        }

        showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            if (!toast || !toastMessage) return;
            
            // Clear existing timeout
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }
            
            // Set message and type
            toastMessage.textContent = this.sanitizeHTML(message);
            toast.className = `toast toast-${type}`;
            
            // Show toast
            toast.style.display = 'block';
            
            // Hide after 3 seconds
            this.toastTimeout = setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }

        showLoading(show) {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = show ? 'flex' : 'none';
            }
        }

        updateResults(area, perimeter, pointCount) {
            const elements = {
                'totalArea': `${area.toFixed(4)} دنم`,
                'perimeter': `${perimeter.toFixed(4)} متر`,
                'pointCount': pointCount
            };
            
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        }

        updateDistanceResults(distances) {
            const distanceResults = document.getElementById('distanceResults');
            if (!distanceResults) return;
            
            distanceResults.innerHTML = '';
            
            distances.forEach((item) => {
                const distanceItem = document.createElement('div');
                distanceItem.className = 'distance-item';
                distanceItem.innerHTML = `
                    <span class="distance-label">النقطة ${item.from} إلى ${item.to}:</span>
                    <span class="distance-value">${item.distance.toFixed(4)} متر</span>
                `;
                distanceResults.appendChild(distanceItem);
            });
        }

        showSection(sectionId, show = true) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = show ? 'block' : 'none';
            }
        }

        sanitizeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        createSafeInfoWindow(content) {
            const div = document.createElement('div');
            div.innerHTML = this.sanitizeHTML(content);
            return div;
        }
    }

    // Global error handler for Google Maps API
    window.handleGoogleMapsError = function() {
        const errorMessage = 'خطأ في تحميل خرائط Google. يرجى التحقق من اتصال الإنترنت وإعدادات API.';
        console.error(errorMessage);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8d7da;
            color: #721c24;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h3>خطأ في التطبيق</h3>
            <p>${errorMessage}</p>
            <button onclick="location.reload()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">إعادة تحميل الصفحة</button>
        `;
        document.body.appendChild(errorDiv);
    };

})(); 
