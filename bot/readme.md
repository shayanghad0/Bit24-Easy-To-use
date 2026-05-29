<div dir="rtl">

For More information read [Rule.md](https://github.com/shayanghad0/Bit24-Easy-To-use/blob/master/bot/rule.md)

# 📜 قوانین مشارکت در پروژه Bit24 Trading Bots

---

## 🏗️ ساختار ریپازیتوری‌ها

| ریپازیتوری | توضیح |
|------------|-------|
| **Bit24-Easy-To-use** | ریپازیتوری اصلی - همه ربات‌های نهایی و تایید شده در اینجا ذخیره می‌شوند |
| **bit24-bots-with-you** | ریپازیتوری تمرینی و مشارکتی - هر کسی می‌تواند ربات خود را بسازد |

---

## 📋 مراحل مشارکت (گام به گام)

### مرحله 1: ارائه ایده
قبل از هر کاری، یک **Issue** در ریپازیتوری `bit24-bots-with-you` باز کنید و ایده خود را بنویسید:

```
عنوان: [ایده] نام ربات - کاربرد آن
توضیحات:
- چه کاری انجام می‌دهد؟
- چه ارزهایی را پشتیبانی می‌کند؟
- چه نوع سفارشاتی (مارکت/لیمیت)؟
```

### مرحله 2: فورک کردن
ریپازیتوری `bit24-bots-with-you` را **فورک (Fork)** کنید.

### مرحله 3: نوشتن کد
کد خود را در مسیر زیر قرار دهید:

```
bot/codes/{نام-پروژه-شما}/
```

**مثال:**
```
bot/codes/martingale-bot/Your-code.{??}
...
bot/codes/simple-dca/README.md
```

### مرحله 4: درخواست Pull Request
یک **Pull Request** به ریپازیتوری `bit24-bots-with-you` بزنید.

### مرحله 5: بررسی و تایید
من (مدیر پروژه) کد شما را بررسی می‌کنم:
- ✅ اگر تایید شود → اجازه اضافه کردن به ریپازیتوری اصلی را می‌دهم
- ❌ اگر نیاز به تغییر باشد → نظر می‌دهم و شما اصلاح می‌کنید

### مرحله 6: انتقال به ریپازیتوری اصلی
بعد از تایید نهایی، ربات شما به **Bit24-Easy-To-use** منتقل می‌شود.

برای این کار:
1. ریپازیتوری **Bit24-Easy-To-use** را فورک کنید
2. کد تایید شده را در مسیر `bot/codes/{نام-پروژه}/` کپی کنید
3. یک Pull Request جدید به ریپازیتوری اصلی بزنید

---

## 🔄 دیباگ و پیشنهادات در هر دو ریپازیتوری

می‌توانید در هر دو ریپازیتوری:

| فعالیت | نحوه انجام |
|--------|-------------|
| 🐛 گزارش باگ | باز کردن Issue با برچسب `bug` |
| 💡 پیشنهاد بهبود | باز کردن Issue با برچسب `enhancement` |
| 🔧 رفع باگ | Pull Request با توضیح مشکل حل شده |
| 📚 بهبود مستندات | Pull Request برای فایل‌های README یا docs |

---

## 📁 ساختار نهایی ربات‌ها در ریپازیتوری اصلی

```
Bit24-Easy-To-use/
├── README.md
├── bot/
│   ├── codes/
       └── your-bot-name/
           ├── files
           ├── ...
           ├── README.md
           └── requirements.txt

```

---

## ✅ قوانین کدنویسی

| قانون | توضیح |
|-------|-------|
| 📝 مستندات | هر ربات حتماً باید فایل `README.md` داشته باشد |
| 🔑 امنیت | API Key و Secret Key هرگز در کد ذخیره نشود (از input استفاده شود) |
| 🧪 تست | کد قبل از Pull Request تست شده باشد |
| 📦 وابستگی‌ها | فایل `requirements.txt` برای کتابخانه‌های مورد نیاز |
| 💬 کامنت | کدها به زبان انگلیسی یا فارسی کامنت‌گذاری شوند |
| 🐍 PEP8 | رعایت استانداردهای PEP8 پایتون |

---

### زبان‌های مورد قبول

| زبان |
|------|
| Python |
| Go |
| Node.js |
###     

---

## 👥 نقش‌ها

| نقش | مسئولیت |
|-----|----------|
| **مدیر پروژه (من)** | بررسی Pull Requestها، تایید نهایی، مدیریت ریپازیتوری اصلی |
| **توسعه‌دهنده (شما)** | نوشتن کد، رفع باگ، ارائه ایده |
| **بازبین (Reviewer)** | بررسی کدهای دیگران، پیشنهاد بهبود |

---

## 🚫 چه کارهایی مجاز نیست؟

- ❌ قرار دادن API Key در کد
- ❌ کپی کردن کد دیگران بدون اجازه
- ❌ Pull Request بدون توضیح
- ❌ تغییر قوانین بدون هماهنگی

---

## 🎉 پاداش مشارکت

- ✅ نام شما در فایل `CONTRIBUTORS.md` ثبت می‌شود
- ✅ ربات شما در ریپازیتوری اصلی قرار می‌گیرد
- ✅ دیگران از کد شما استفاده می‌کنند و به آن امتیاز می‌دهند

---

## 📞 سوالات؟

هر سوالی دارید، در بخش **Issues** یک سوال باز کنید با برچسب `question`

---

**[🏠 بازگشت به صفحه اصلی](README.md)**

</div>

---

## English Version

# 📜 Participation Rules - Bit24 Trading Bots Project

---

## 🏗️ Repository Structure

| Repository | Description |
|------------|-------------|
| **Bit24-Easy-To-use** | Main repository - all final & approved bots are stored here |
| **bit24-bots-with-you** | Practice & collaboration repository - anyone can build their bot here |

---

## 📋 Participation Steps (Step by Step)

### Step 1: Share Your Idea
Open an **Issue** in `bit24-bots-with-you` repository with your idea:

```
Title: [Idea] Bot Name - What it does
Description:
- What does it do?
- Which coins does it support?
- What order types (market/limit)?
```

### Step 2: Fork
**Fork** the `bit24-bots-with-you` repository

### Step 3: Write Code
Place your code in:

```
bot/codes/{your-project-name}/
```

### Step 4: Pull Request
Submit a **Pull Request** to `bit24-bots-with-you`

### Step 5: Review & Approval
I (project manager) will review your code:
- ✅ If approved → permission to add to main repository
- ❌ If changes needed → feedback given, you fix it

### Step 6: Transfer to Main Repository
After final approval, your bot moves to **Bit24-Easy-To-use**

Process:
1. Fork **Bit24-Easy-To-use**
2. Copy approved code to `bot/codes/{project-name}/`
3. Submit Pull Request to main repository

---

## 🔄 Debugging & Suggestions on Both Repos

You can on BOTH repositories:

| Activity | How |
|----------|-----|
| 🐛 Report bug | Open Issue with `bug` label |
| 💡 Suggest improvement | Open Issue with `enhancement` label |
| 🔧 Fix bug | Pull Request explaining the fix |
| 📚 Improve docs | Pull Request for README or docs |

---

## ✅ Coding Rules

| Rule | Description |
|------|-------------|
| 📝 Documentation | Every bot must have `README.md` |
| 🔑 Security | Never store API keys in code (use `input()`) |
| 🧪 Testing | Code must be tested before Pull Request |
| 📦 Dependencies | Include `requirements.txt` |
| 💬 Comments | Code commented in Persian or English |
| 🐍 PEP8 | Follow Python PEP8 standards |

---

## 🚫 Not Allowed

- ❌ Storing API keys in code
- ❌ Copying others' code without permission
- ❌ Pull Request without description
- ❌ Changing rules without coordination

---

## 🎉 Contribution Rewards

- ✅ Your name in `CONTRIBUTORS.md`
- ✅ Your bot in the main repository
- ✅ Others use and star your code

---

## 📞 Questions?

Open an **Issue** with `question` label

---

**[🏠 Back to README](README.md)**
