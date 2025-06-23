# تطبيق تحديد الإحداثيات - GPS Coordinate Plotter

A modern, secure, and feature-rich web application for plotting GPS coordinates on Google Maps and calculating land areas. Designed specifically for agricultural land mapping with Arabic interface support.

## 🌟 Enhanced Features

### 🗺️ **Interactive Mapping**
- **Multiple Map Types**: Roadmap, Satellite, Hybrid, and Terrain views
- **Real-time Coordinate Display**: Right-click anywhere on the map to see coordinates
- **UTM & Lat/Lng Conversion**: Automatic coordinate system conversion with validation
- **Line Drawing**: Right-click to draw lines and measure distances
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 📍 **Advanced Coordinate Management**
- **Flexible Input Format**: Accepts UTM coordinates in various formats
- **Input Validation**: Comprehensive validation with error messages
- **Batch Processing**: Handle multiple coordinate points at once
- **Sample Data**: Built-in sample coordinates for testing
- **Coordinate Sanitization**: XSS protection and input cleaning

### 🎨 **Visual Customization**
- **Custom Colors**: Choose any color for polygon and markers
- **Opacity Control**: Adjust polygon fill transparency
- **Farmer Name Labels**: Display owner/farmer names on the map
- **Numbered Markers**: Clear point identification with numbered markers
- **Safe Info Windows**: XSS-protected coordinate information display

### 📊 **Advanced Calculations**
- **Area Calculation**: Automatic area computation in dunums (2500 m²)
- **Perimeter Measurement**: Total boundary length calculation
- **Distance Between Points**: Individual segment measurements
- **Real-time Updates**: Instant calculation updates
- **Validation**: Coordinate range validation and error handling

### 💾 **Enhanced Data Management**
- **Multiple Export Formats**: JSON, CSV, and KML export
- **Data Persistence**: Automatic localStorage saving and restoration
- **Undo/Redo**: Full history management with undo/redo functionality
- **Print Support**: Print maps and calculations
- **Auto-save**: Automatic data saving with history management

### 🎯 **User Experience**
- **Arabic Interface**: Full RTL support with Arabic text
- **Toast Notifications**: Real-time feedback and status updates
- **Loading Indicators**: Visual feedback during processing
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Layout**: Optimized for all screen sizes
- **Keyboard Shortcuts**: Enhanced accessibility

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Internet connection (for Google Maps API)
- Google Maps API key (required for production use)

### Installation

#### 1. **Get Google Maps API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API and Geometry Library
4. Create credentials (API Key)
5. Set up billing (required for API usage)

#### 2. **Configure the Application**
1. Open `config.js`
2. Replace `'YOUR_API_KEY_HERE'` with your actual Google Maps API key
3. Adjust other settings as needed (UTM zone, center coordinates, etc.)

#### 3. **Run the Application**
1. Open `index.html` in your web browser
2. The application will load with configuration validation
3. Start plotting coordinates!

### Basic Usage

#### 1. **Enter Coordinates**
```
Format: Easting,Northing
Example: 123456.78,9876543.21

Multiple points:
123456.78,9876543.21
234567.89,9876544.32
345678.90,9876545.43
```

#### 2. **Draw Lines**
- **Right-click** to start drawing a line
- **Right-click** again to end the line and see distance

#### 3. **Customize Appearance**
- Set farmer/owner name
- Choose polygon color
- Adjust transparency level

#### 4. **Draw Polygon**
- Click "رسم المضلع" (Draw Polygon)
- View results automatically

#### 5. **Export Data**
- Click "تصدير البيانات" (Export Data)
- Download JSON and CSV files with all information

#### 6. **Undo/Redo**
- Use "تراجع" (Undo) and "إعادة" (Redo) buttons
- Full history management for all actions

## 📋 Coordinate Format

### Supported Formats
- **UTM Coordinates**: `Easting,Northing`
- **Multiple Points**: One coordinate pair per line
- **Separators**: Use `*` to separate multiple points on same line

### Validation Rules
- **Easting**: 0 to 1,000,000 meters
- **Northing**: 0 to 10,000,000 meters
- **Minimum Points**: 3 points for polygon
- **Maximum Points**: 1,000 points per polygon

### Examples
```
Single point:
123456.78,9876543.21

Multiple points:
123456.78,9876543.21
234567.89,9876544.32
345678.90,9876545.43

Multiple points with separator:
123456.78,9876543.21*234567.89,9876544.32
345678.90,9876545.43*456789.01,9876546.54
```

## 🛠️ Technical Details

### Architecture
- **Modular Design**: Class-based architecture with separation of concerns
- **Security**: Input validation, XSS protection, and error handling
- **Performance**: Optimized DOM manipulation and memory management
- **Maintainability**: Clean code structure with proper documentation

### Coordinate System
- **UTM Zone**: 38N (WGS84) - configurable
- **Projection**: EPSG:32638
- **Area Unit**: Dunum (2500 m²) - configurable
- **Distance Unit**: Meters

### Dependencies
- **Google Maps API**: Interactive mapping and geometry calculations
- **proj4.js**: Coordinate system conversion
- **Font Awesome**: Icons and visual elements
- **Cairo Font**: Arabic typography

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized map controls
- Responsive layout
- Mobile-optimized buttons and inputs

## 🎨 Customization

### Configuration Options
All settings are configurable in `config.js`:
- API keys and endpoints
- Coordinate system parameters
- UI settings and defaults
- Error and success messages
- Export formats and options

### Colors and Styling
- Modern gradient backgrounds
- Card-based layout
- Smooth animations
- Custom button styles
- Toast notifications

### Language Support
- Primary: Arabic (RTL)
- Secondary: English labels
- Extensible for other languages

## 🔧 Configuration

### Google Maps API
To use your own API key:
1. Get a Google Maps API key from Google Cloud Console
2. Replace `YOUR_API_KEY_HERE` in `config.js`
3. Enable Maps JavaScript API and Geometry Library
4. Set up billing for API usage

### Default Settings
- **Map Center**: Iraq region (34.98°N, 43.36°E)
- **Default Zoom**: 18
- **Map Type**: Satellite
- **UTM Zone**: 38N
- **Dunum Conversion**: 2500 m²

## 📊 Output Data

### Export Formats

#### JSON Export
```json
{
  "farmerName": "اسم الفلاح",
  "color": "#ff0000",
  "coordinates": [...],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "area": "25.50 دنم",
  "perimeter": "1250.75 متر",
  "pointCount": 5
}
```

#### CSV Export
```csv
Farmer Name,Color,Area,Perimeter,Point Count,Timestamp
اسم الفلاح,#ff0000,25.50 دنم,1250.75 متر,5,2024-01-01T12:00:00.000Z

Coordinates (UTM):
Point,Easting,Northing
1,123456.78,9876543.21
2,234567.89,9876544.32
```

#### KML Export
- Google Earth compatible format
- Includes styling and metadata
- Ready for GIS applications

### Calculations
- **Area**: Automatically converted to dunums
- **Perimeter**: Total boundary length in meters
- **Distances**: Individual segment measurements
- **Point Count**: Total number of coordinate points

## 🔒 Security Features

### Input Validation
- Coordinate range validation
- Input sanitization
- XSS protection
- Error handling

### Data Protection
- Safe HTML rendering
- Input cleaning
- Secure data storage
- Memory leak prevention

### API Security
- Proper API key management
- Error handling for API failures
- Graceful degradation

## 🐛 Troubleshooting

### Common Issues

#### Map Not Loading
- Check internet connection
- Verify Google Maps API key in `config.js`
- Ensure billing is set up for Google Cloud project
- Clear browser cache

#### Coordinates Not Plotting
- Verify coordinate format
- Check for minimum 3 points
- Ensure valid UTM coordinates within ranges
- Check browser console for error messages

#### Export Not Working
- Ensure polygon is drawn first
- Check browser download settings
- Verify file permissions
- Check available disk space

#### Undo/Redo Not Working
- Ensure actions have been performed first
- Check browser console for errors
- Verify localStorage is enabled

### Error Messages
- **API Load Error**: Check API key and internet connection
- **Coordinate Parse Error**: Verify coordinate format
- **Conversion Error**: Check coordinate ranges
- **Validation Error**: Ensure data meets requirements

### Performance Issues
- Clear browser cache and cookies
- Close unnecessary browser tabs
- Check available memory
- Update browser to latest version

## 🔄 Version History

### v2.0.0 (Current)
- **Security**: Complete input validation and XSS protection
- **Architecture**: Modular class-based design
- **Features**: Undo/redo, multiple export formats, data persistence
- **Performance**: Optimized DOM manipulation and memory management
- **Configuration**: External configuration file with validation

### v1.0.0 (Previous)
- Basic coordinate plotting
- Simple area calculations
- JSON export only
- Basic error handling

## 📄 License

This project is developed by Omar Najh. For support and questions, contact: omarnajh@gmail.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support, feature requests, or bug reports:
- **Email**: omarnajh@gmail.com
- **Developer**: Omar Najh

---

**Note**: This application requires a valid Google Maps API key for full functionality. Please ensure you have proper billing set up for your Google Cloud project. 