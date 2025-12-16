# ⚡ البدء السريع - نشر ميلادك V2

## 🚀 خطوة واحدة للنشر

```powershell
# افتح PowerShell كمدير وشغل:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-to-vercel.ps1
```

## 📋 قائمة المراجعة السريعة

### ✅ قبل النشر

- [ ] Git مثبت على الجهاز
- [ ] Node.js مثبت على الجهاز
- [ ] حساب GitHub: `mrhussein00100-dotcom`
- [ ] حساب Vercel: `mrhussein00100-6276`

### ✅ بعد تشغيل السكريبت

- [ ] الكود مرفوع على GitHub
- [ ] ربط Vercel بالمستودع الجديد
- [ ] إنشاء قاعدة بيانات Postgres في Vercel
- [ ] إضافة متغيرات البيئة
- [ ] ترحيل البيانات: `.\migrate-data.ps1`

### ✅ التحقق النهائي

- [ ] الموقع يعمل: https://miladak.com
- [ ] الأدوات تعمل: https://miladak.com/tools
- [ ] المقالات تظهر: https://miladak.com/articles
- [ ] لوحة الإدارة: https://miladak.com/admin

---

## 🔧 إذا واجهت مشاكل

### Git غير مثبت

```powershell
# تحميل من: https://git-scm.com/download/win
```

### خطأ في الرفع

```powershell
git config --global user.name "mrhussein00100-dotcom"
git config --global user.email "mr.hussein00100@gmail.com"
```

### قاعدة البيانات فارغة

```powershell
# تأكد من تشغيل:
.\migrate-data.ps1
```

---

## 📞 الدعم

إذا واجهت أي مشكلة، راجع:

- `DEPLOYMENT_README.md` - دليل مفصل
- `DEPLOYMENT_TASKS.md` - قائمة المهمات
- `GITHUB_VERCEL_DEPLOYMENT.md` - دليل GitHub و Vercel

---

**🎉 مبروك! موقعك جاهز للعالم!**
