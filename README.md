# 🇸🇦 الدليل باللغة العربية

تطبيق حديث وآمن وغني بالميزات لرسم إحداثيات GPS على خرائط Google وحساب مساحات الأراضي. مصمم خصيصًا لمسح الأراضي الزراعية مع دعم كامل للواجهة العربية.

## 🌟 الميزات المحسنة

### 🗺️ **رسم خرائط تفاعلي**
- **أنواع خرائط متعددة**: طرق، أقمار صناعية، هجينة، وتضاريس
- **عرض الإحداثيات في الوقت الفعلي**: انقر بزر الفأرة الأيمن في أي مكان على الخريطة لعرض الإحداثيات
- **تحويل تلقائي بين UTM و Lat/Lng** مع التحقق من صحة البيانات
- **رسم خطوط**: انقر بزر الفأرة الأيمن لرسم خط وقياس المسافة
- **تصميم متجاوب**: يعمل بشكل مثالي على الحاسوب والتابلت والجوال

### 🟦 **تحرير متقدم للمضلعات**
- **مضلعات قابلة للتحرير دائمًا**: لا حاجة لوضع خاص للتحرير
- **مؤشرات كبيرة قابلة للسحب**: اسحب النقاط بسهولة لتغيير شكل المضلع
- **انقر مزدوجًا لإضافة/إزالة نقاط**: انقر مزدوجًا على الحافة للإضافة أو على النقطة للإزالة (إذا كان هناك أكثر من 3 نقاط)
- **تحديثات فورية**: المساحة والمحيط والمسافات تتحدث مباشرة أثناء التحرير
- **إشعارات بصرية**: مؤشر يد/سحب ونصائح أثناء التحرير
- **تراجع/إعادة**: إدارة كاملة للتاريخ لجميع الإجراءات

### 🟩 **إدارة متعددة للمضلعات**
- **رسم وإدارة عدة مضلعات في نفس الوقت**
- **ألوان مميزة لكل مضلع**: تعيين تلقائي عند الاستيراد للتمييز
- **حسابات وتفاصيل منفصلة لكل مضلع**
- **تصدير جميع المضلعات معًا أو بشكل فردي (JSON, CSV, KML)**
- **استيراد عدة مضلعات دفعة واحدة**: كل ملف JSON يحصل على لون فريد
- **عرض تفاصيل أول مضلع مستورد تلقائيًا**

### 🧑‍🌾 **اسم المزارع ومؤشر المركز**
- **مؤشر مركز قابل للسحب**: حرك المضلع بالكامل بسحب مؤشر اسم المزارع
- **اسم المزارع/المالك**: يظهر على الخريطة لكل مضلع

### 🖌️ **تخصيص بصري**
- **ألوان مخصصة**: اختر أي لون للمضلع والمؤشرات
- **تحكم في الشفافية**: عدل شفافية تعبئة المضلع
- **واجهة حديثة**: تصميم بطاقات، حركات سلسة، وتجاوب كامل

### 📈 **حسابات متقدمة**
- **حساب المساحة**: حساب تلقائي للمساحة بالدونم (1 دونم = 2500 م²)
- **قياس المحيط**: حساب طول الحدود الكلي
- **المسافة بين النقاط**: قياس كل ضلع على حدة
- **التحقق من صحة البيانات**: التحقق من مدى الإحداثيات ومعالجة الأخطاء

### 💾 **إدارة بيانات محسنة**
- **تنسيقات تصدير متعددة**: تصدير بصيغ JSON, CSV, KML
- **حفظ تلقائي**: حفظ واسترجاع البيانات تلقائيًا من المتصفح
- **دعم الطباعة**: طباعة الخرائط والنتائج (A4)
- **حفظ تلقائي مع إدارة التاريخ**

### 🌐 **دعم اللغة**
- **دعم كامل للعربية (من اليمين لليسار) والإنجليزية**
- **تبديل فوري بين اللغتين**

### 👥 **عداد الزوار**
- **عداد زوار يظهر في التذييل (محلي لكل جهاز)**

### 🧑‍💻 **تجربة المستخدم**
- **إشعارات فورية**: رسائل حالة وتحديثات مباشرة
- **مؤشرات تحميل**: إشعارات بصرية أثناء المعالجة
- **معالجة الأخطاء**: رسائل شاملة للتحقق من الصحة
- **اختصارات لوحة المفاتيح**: وصول أسرع وأسهل

## 🚀 البدء السريع

### المتطلبات
- متصفح حديث (Chrome 60+، Firefox 55+، Safari 12+، Edge 79+)
- اتصال بالإنترنت (لاستخدام خرائط Google)
- مفتاح Google Maps API (مطلوب للاستخدام الفعلي)

### التثبيت

#### 1. **الحصول على مفتاح Google Maps API**
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروعًا جديدًا أو اختر مشروعًا موجودًا
3. فعّل Maps JavaScript API و Geometry Library
4. أنشئ بيانات اعتماد (API Key)
5. فعّل الفوترة (مطلوب للاستخدام)

#### 2. **إعداد التطبيق**
1. افتح ملف `config.js`
2. استبدل `'YOUR_API_KEY_HERE'` بمفتاحك الفعلي
3. عدل الإعدادات الأخرى حسب الحاجة (منطقة UTM، مركز الخريطة، ...)

#### 3. **تشغيل التطبيق**
1. افتح `index.html` في متصفحك
2. سيعمل التطبيق مع التحقق من الإعدادات
3. ابدأ برسم الإحداثيات!

### الاستخدام الأساسي

#### 1. **إدخال الإحداثيات**
```
الصيغة: Easting,Northing
مثال: 123456.78,9876543.21

عدة نقاط:
123456.78,9876543.21
234567.89,9876544.32
345678.90,9876545.43
```

#### 2. **رسم الخطوط**
- **انقر بزر الفأرة الأيمن** لبدء رسم خط
- **انقر بزر الفأرة الأيمن مرة أخرى** لإنهاء الخط وعرض المسافة

#### 3. **تخصيص المظهر**
- أدخل اسم المزارع/المالك
- اختر لون المضلع
- عدل مستوى الشفافية

#### 4. **رسم المضلع**
- انقر على "رسم المضلع"
- ستظهر النتائج تلقائيًا

#### 5. **تصدير البيانات**
- انقر على "تصدير البيانات"
- حمّل ملفات JSON وCSV بكل التفاصيل

#### 6. **تراجع/إعادة**
- استخدم أزرار "تراجع" و"إعادة"
- إدارة كاملة للتاريخ لكل إجراء

## 📋 صيغة الإحداثيات

### الصيغ المدعومة
- **إحداثيات UTM**: `Easting,Northing`
- **عدة نقاط**: كل زوج إحداثيات في سطر
- **فواصل**: استخدم `*` للفصل بين عدة نقاط في نفس السطر

### قواعد التحقق
- **Easting**: من 0 إلى 1,000,000 متر
- **Northing**: من 0 إلى 10,000,000 متر
- **الحد الأدنى للنقاط**: 3 نقاط لرسم مضلع
- **الحد الأقصى للنقاط**: 1,000 نقطة لكل مضلع

### أمثلة
```
نقطة واحدة:
123456.78,9876543.21

عدة نقاط:
123456.78,9876543.21
234567.89,9876544.32
345678.90,9876545.43

عدة نقاط بفاصل:
123456.78,9876543.21*234567.89,9876544.32
345678.90,9876545.43*456789.01,9876546.54
```

## 🛠️ تفاصيل تقنية

### الهيكلية
- **تصميم معياري**: بنية تعتمد على الفئات مع فصل المهام
- **الأمان**: تحقق من صحة المدخلات، حماية من XSS، ومعالجة الأخطاء
- **الأداء**: تحسين التعامل مع DOM وإدارة الذاكرة
- **سهولة الصيانة**: كود منظم ووثائق واضحة

### نظام الإحداثيات
- **منطقة UTM**: 38N (WGS84) - قابلة للتعديل
- **الإسقاط**: EPSG:32638
- **وحدة المساحة**: دونم (2500 م²) - قابلة للتعديل
- **وحدة المسافة**: متر

### الاعتمادات
- **Google Maps API**: رسم الخرائط وحساب المسافات
- **proj4.js**: تحويل أنظمة الإحداثيات
- **Font Awesome**: الأيقونات والعناصر البصرية
- **خط Cairo**: دعم الخط العربي

### دعم المتصفحات
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 دعم الجوال

التطبيق متجاوب بالكامل ومهيأ للأجهزة المحمولة:
- واجهة سهلة للمس
- تحكم محسن في الخريطة
- تصميم متجاوب
- أزرار ومدخلات مناسبة للجوال

## 🎨 التخصيص

### خيارات الإعداد
كل الإعدادات قابلة للتعديل في `config.js`:
- مفاتيح API ونقاط النهاية
- معلمات نظام الإحداثيات
- إعدادات وواجهات المستخدم الافتراضية
- رسائل الخطأ والنجاح
- تنسيقات وخيارات التصدير

### الألوان والتصميم
- خلفيات متدرجة حديثة
- تصميم بطاقات
- حركات سلسة
- أنماط أزرار مخصصة

## 🔧 الإعداد

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

# 🚦 كيفية استخدام التطبيق (How to Use)

## 🇸🇦 بالعربية
1. **انقر على الخريطة** لإضافة نقاط GPS. يمكنك إضافة أكثر من نقطتين لرسم مضلع.
2. **عند إضافة 3 نقاط أو أكثر**، انقر بزر الفأرة الأيمن على الخريطة لعرض قائمة منبثقة:
   - رسم مضلع وعرض البيانات
   - الحصول على جميع المسافات
   - نسخ نقاط GPS إلى المدخل
3. **تعديل المضلع:** اسحب النقاط أو انقر عليه ثم اضغط "تم" بعد الانتهاء.
4. **انقر بزر الفأرة الأيمن على أي مضلع** لعرض قائمة:
   - نسخ إحداثيات GPS إلى المدخل
   - حذف المضلع
5. **نتائج الحسابات والمسافات** تظهر في البطاقات أعلى الصفحة.
6. **تصدير/استيراد/طباعة:** استخدم الأزرار أسفل الصفحة.

## 🇬🇧 In English
1. **Click on the map** to add GPS points. You can add more than two points to draw a polygon.
2. **After adding 3 or more points**, right-click on the map to show a popup menu:
   - Draw Polygon & Show Data
   - Get All Distances
   - Copy GPS Points to Input
3. **Edit the polygon:** Drag points or click it, then press "Done" when finished.
4. **Right-click any polygon** to show a menu:
   - Copy GPS Coordinates to Input
   - Delete Polygon
5. **Calculation results and distances** appear in the cards at the top of the page.
6. **Export/Import/Print:** Use the buttons at the bottom of the page.

--- 