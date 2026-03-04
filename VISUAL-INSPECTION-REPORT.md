# تقرير الفحص البصري — Seel Transport

تم فحص هيكل الواجهة من الكود. افتح الموقع في المتصفح (مثلاً `http://localhost:3003`) وتأكد من المطابقة.

---

## 1. الشريط العلوي (Top Bar)
- **اللون:** أزرق داكن (navy-800)
- **المحتوى:** رقم الهاتف +49 160 7746966، البريد info@seeltransport.de، ونص "24/7 für Sie erreichbar"
- **يُخفى على الموبايل** (hidden md:block)

## 2. شريط التنقل الرئيسي (Navbar)
- **ثابت عند التمرير** (sticky)
- **الشعار:** صورة من `/images/logo.jpeg` + نص "SEEL" و "Transport & Reinigung"
- **الروابط:** Startseite | Leistungen | Jetzt buchen | Für Unternehmen | Kontakt
- **زر "Jetzt buchen":** لون teal مع ظل
- **قائمة موبايل:** أيقونة قائمة تفتح/تُغلق القائمة

## 3. الصفحة الرئيسية (/)

### Hero
- خلفية navy متدرجة
- عنوان: "Zuverlässige **Umzüge** und gründliche **Reinigung**" (الكلمات المميزة بلون teal)
- نص ترحيبي + زر "Jetzt Angebot erhalten" وزر "Anrufen"
- صورة الشاحنة من `/images/truck.jpeg` (على الشاشات الكبيرة)
- تقييم 5 نجوم + "500+ zufriedene Kunden"

### بطاقات الخدمات (5)
- Umzüge & Möbeltransporte (أزرق)
- Büroumzüge (teal)
- Schulumzüge (برتقالي)
- Reinigungsservice (أخضر)
- Entrümpelung (أحمر)
كل بطاقة لها أيقونة، عنوان، وصف، ورابط "Mehr erfahren"

### كيف يعمل (3 خطوات)
- Service wählen → Termin buchen → Wir erledigen den Rest
- أرقام 1، 2، 3 داخل دوائر teal

### إحصائيات
- 500+ Erfolgreiche Umzüge
- 98% Kundenzufriedenheit
- 24/7 Erreichbarkeit
- 10+ Jahre Erfahrung
- عداد متحرك (Counter) عند الظهور في الشاشة

### آراء العملاء
- 3 بطاقات: Maria S.، Thomas K.، Sandra M. مع 5 نجوم ونص قصير

### قسم B2B
- خلفية navy مع نص "Maßgeschneiderte Lösungen für Ihr Unternehmen"
- زر "Mehr erfahren" و "Kontakt aufnehmen"

### FAQ
- 5 أسئلة قابلة للفتح/الإغلاق (accordion)

### CTA أخير
- "Bereit für Ihren Umzug?" مع زر "Jetzt Angebot anfordern" ورقم الهاتف

## 4. صفحة الحجز (/buchen)
- **شريط التقدّم:** 6 خطوات (Service → Adressen → Zugang → Umfang → Termin → Übersicht)
- **الخطوة 1:** 5 بطاقات لاختيار الخدمة (Umzug, Büroumzug, Schulumzug, Reinigung, Entrümpelung)
- **الخطوة 2:** حقول عناوين (من/إلى) مع PLZ ومدينة
- **الخطوة 3:** الطابق، مصعد، موقف سيارات
- **الخطوة 4:** حجم m³ أو مساحة m²، عدد العمال، ساعات، خيارات إضافية (تغليف، تركيب، إزالة)
- **الخطوة 5:** تاريخ، فترة زمنية، مرونة
- **الخطوة 6:** بيانات الاتصال، طريقة الدفع (Stripe / Rechnung)، تأمين، قبول AGB
- **الشريط الجانبي:** عرض تفصيل السعر يتحدث فوراً مع تغيير الخيارات

## 5. التذييل (Footer)
- خلفية navy
- الشعار + روابط الخدمات + روابط سريعة (AGB, Impressum, Datenschutz)
- بيانات الاتصال (هاتفان، بريد، WhatsApp)
- حقوق النشر

## 6. عناصر إضافية
- **زر WhatsApp عائم** أسفل يمين الصفحة (أخضر)
- **بانر الكوكيز** أسفل الصفحة مع "Akzeptieren" و "Ablehnen"

---

## قائمة تحقق سريعة عند الفتح في المتصفح

- [ ] الشعار وصورة الشاحنة تظهران بدون كسر
- [ ] الألوان: navy و teal و silver واضحة ومتناسقة
- [ ] القائمة على الموبايل تفتح وتغلق
- [ ] روابط "Jetzt buchen" و "Leistungen" تعمل
- [ ] صفحة الحجز: اختيار خدمة يفعّل "Weiter" ويظهر السعر في الشريط الجانبي
- [ ] لا توجد أخطاء في Console (F12)
- [ ] البانر والزر العائم لا يغطيان المحتوى بشكل مزعج

---

*تم إنشاء التقرير من هيكل الكود. للفحص الفعلي شغّل `npm run dev` وافتح الرابط المعروض في المتصفح.*
