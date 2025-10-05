# 🎨 OVU Shared Components Library

ספריית רכיבים משותפים למערכות OVU עם תמיכה מלאה ב-RTL/LTR ותמות בהירות/כהות.

---

## 📦 רכיבים זמינים

### 1️⃣ **LoginPage** - דף התחברות מלא
### 2️⃣ **Layout** - מבנה אפליקציה עם Sidebar + Header
### 3️⃣ **Sidebar** - סרגל ניווט צידי
### 4️⃣ **Dashboard** - לוח בקרה עם סטטיסטיקות

---

## 🎯 עקרונות עיצוב

### ✅ **גדלים קבועים:**
- **Sidebar רגיל:** `280px` (קבוע)
- **Sidebar מכווץ:** `80px` (קבוע)
- **Header:** `70px` (קבוע)
- **כפתורי בקרה:** `32px` גובה (קבוע)

### ✅ **צבעים:**
- **ULM:** כחול (`#3b82f6` → `#60a5fa`)
- **AAM:** סגול (`#8b5cf6` → `#a78bfa`)

### ✅ **RTL/LTR:**
- הסיידבר עובר לצד הנכון אוטומטית
- כל הטקסטים מותאמים
- CSS Logical Properties

---

## 🚀 התקנה באפליקציה חדשה

### שלב 1: העתקת הקומפוננטים

\`\`\`bash
# מהשרת
cp -r /home/ploi/shared-components /path/to/your-app/src/
\`\`\`

### שלב 2: התקנת תלויות

\`\`\`bash
npm install react-router-dom axios
\`\`\`

### שלב 3: הגדרת CSS Variables

הוסף ל-\`index.css\` או \`App.css\`:

\`\`\`css
:root[data-theme="light"] {
  --bg-main: #f8fafc;
  --bg-card: #fafafa;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e5e7eb;
  --header-bg: #f8fafc;
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 8px 24px rgba(15, 23, 42, 0.12);
}

:root[data-theme="dark"] {
  --bg-main: #0f172a;
  --bg-card: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-color: #334155;
  --header-bg: #0f172a;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);
}
\`\`\`

---

## 📝 דוגמאות שימוש

### LoginPage

\`\`\`tsx
import { LoginPage } from ./shared-components/LoginPage/LoginPage;

const translations = {
  headerTitle: "מערכת ניהול",
  loginTitle: "התחברות למערכת",
  email: "אימייל",
  password: "סיסמה",
  loginBtn: "התחבר",
  langBtn: "EN",
  themeBtn: (theme) => theme === "light" ? "🌙" : "☀️",
};

<LoginPage
  theme={theme}
  language={language}
  translations={translations}
  logoIcon="👤"
  logoColor="blue"
  onLogin={async (username, password) => {
    // Your login logic
  }}
  onToggleTheme={() => setTheme(prev => prev === "light" ? "dark" : "light")}
  onToggleLanguage={() => setLanguage(prev => prev === "he" ? "en" : "he")}
  loading={loading}
  error={error}
/>
\`\`\`

---

### Layout + Sidebar + Dashboard

\`\`\`tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./shared-components/Layout/Layout";
import { Dashboard } from "./shared-components/Dashboard/Dashboard";

const menuItems = [
  {
    id: "dashboard",
    label: "לוח בקרה",
    labelEn: "Dashboard",
    icon: "📊",
    path: "/dashboard",
  },
  {
    id: "users",
    label: "משתמשים",
    labelEn: "Users",
    icon: "👥",
    path: "/users",
    subItems: [
      {
        id: "all-users",
        label: "כל המשתמשים",
        labelEn: "All Users",
        icon: "📋",
        path: "/users/all",
      },
    ],
  },
];

const stats = [
  {
    icon: "👥",
    label: "סה\\"כ משתמשים",
    labelEn: "Total Users",
    value: 1248,
    change: 12,
    color: "blue" as const,
  },
];

const activities = [
  {
    id: "1",
    icon: "👤",
    message: "משתמש חדש נרשם",
    messageEn: "New user registered",
    timestamp: "5 דקות",
  },
];

<Router>
  <Layout
    menuItems={menuItems}
    currentPath={location.pathname}
    language={language}
    theme={theme}
    userInfo={userInfo}
    headerTitle="מערכת ניהול"
    onNavigate={(path) => navigate(path)}
    onToggleTheme={toggleTheme}
    onToggleLanguage={toggleLanguage}
    onLogout={handleLogout}
    translations={{
      langBtn: "EN",
      themeBtn: (theme) => theme === "light" ? "🌙" : "☀️",
      logout: "התנתק",
    }}
  >
    <Routes>
      <Route path="/dashboard" element={
        <Dashboard
          language={language}
          theme={theme}
          stats={stats}
          activities={activities}
          quickActions={[]}
        />
      } />
      <Route path="/users/all" element={<div>All Users Page</div>} />
    </Routes>
  </Layout>
</Router>
\`\`\`

---

## 🎨 התאמה אישית

### שינוי צבעים

**לשינוי צבע הלוגו והכפתורים:**
\`\`\`tsx
<LoginPage logoColor="purple" /> // או "blue"
\`\`\`

**לשינוי צבעי Stat Cards:**
\`\`\`tsx
const stats = [
  { ..., color: "blue" as const },    // כחול
  { ..., color: "purple" as const },  // סגול
  { ..., color: "green" as const },   // ירוק
  { ..., color: "orange" as const },  // כתום
];
\`\`\`

---

## 🔧 טיפולוגיה

כל הטיפוסים מיוצאים מ-\`shared-components/types/index.ts\`:

\`\`\`typescript
import type {
  UserInfo,
  MenuItem,
  StatCardData,
  ActivityItem,
  QuickAction,
  Theme,
  Language,
  AppTranslations,
} from "./shared-components/types";
\`\`\`

---

## ⚡ ביצועים

- **Sidebar:** גודל קבוע, ללא reflow
- **Header:** גובה קבוע, ללא shift
- **Main Container:** scroll בתוך הקונטיינר בלבד
- **Transitions:** CSS transforms (GPU accelerated)

---

## 📱 Responsive

- **Desktop (> 768px):** סיידבר מלא (280px)
- **Mobile (≤ 768px):** סיידבר מוסתר, ניתן לפתיחה

---

## 🌍 תמיכה ב-RTL/LTR

הקומפוננטים משתמשים ב-\`dir\` attribute ו-CSS Logical Properties:

\`\`\`tsx
<div dir={language === "he" ? "rtl" : "ltr"}>
  {/* Content */}
</div>
\`\`\`

CSS משתמש ב:
- \`inset-inline-start\` / \`inset-inline-end\`
- \`margin-inline-start\` / \`margin-inline-end\`
- \`padding-inline-start\` / \`padding-inline-end\`

---

## 🚨 חשוב לדעת

### 1. גדלים קבועים
הסיידבר וההדר בגדלים קבועים. **אל תשנה את הגדלים האלה** בלי לעדכן גם את ה-margin של \`.main-layout\`.

### 2. CSS Variables
ודא ש-\`:root[data-theme]\` מוגדר לפני שימוש ברכיבים.

### 3. Router
Layout דורש \`react-router-dom\` להיות מותקן.

### 4. אחידות
כל אפליקציה חדשה צריכה להשתמש ברכיבים האלה כדי לשמור על אחידות.

---

## 📞 תמיכה

לשאלות או בעיות, צור issue או פנה למפתח הראשי.

---

**מעודכן:** אוקטובר 2025
**גרסה:** 1.0.0


---

## 📜 **Scrollbar עיצוב**

### ✅ **מיקום הScrollbar:**

ה-scrollbar מופיע **צמוד לאזור התוכן** ולא בקצה הדף:

```
┌─────────────────────────────────────┐
│ Sidebar │ Header          Controls│
│  280px  ├─────────────────────────┤
│         │                         │
│         │  Content Area      ║    │  ← Scrollbar כאן!
│         │                    ║    │
│         │                    ║    │
└─────────┴────────────────────║────┘
```

### 📝 **CSS חובה:**

הוסף ל-`App.css` או `index.css`:

```css
/* מניעת scroll על body */
html, body {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#root {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
```

### 🎨 **עיצוב Custom Scrollbar:**

ה-scrollbar מעוצב אוטומטית:
- ✅ רוחב: `12px`
- ✅ צבע: משתנה עם הערכה (בהיר/כהה)
- ✅ Border radius: `6px`
- ✅ Hover effect: צבע כהה יותר

---


---

## ⚠️ **חשוב: מדיניות גלילה**

### ✅ **גלילה ראשית בלבד:**

כל הגלילה מתבצעת ב-`.main-container` (או `.dashboard-container`) בלבד.

**אין גלילה פנימית** ברכיבים כמו:
- ❌ `.activity-list` (לא מוגבל ב-max-height)
- ❌ `.dashboard-section` (לא יוצר גלילה משלו)
- ❌ `.stats-grid` (לא יוצר גלילה משלו)

### 📝 **כלל חשוב:**

```css
/* ✅ נכון - גלילה רק בקונטיינר הראשי */
.main-container {
  overflow-y: auto;
}

/* ❌ לא נכון - אל תוסיף גלילה פנימית */
.activity-list {
  /* max-height: 500px; ← אל תעשה את זה! */
  /* overflow-y: auto; ← אל תעשה את זה! */
}
```

### 🎯 **תוצאה:**

כל התוכן נגלל ביחד, ופס הגלילה מופיע במקום אחד - צמוד לתוכן הראשי.

---

