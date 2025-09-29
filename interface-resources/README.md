# Interface Resources - ספריית רכיבי UI משותפת

## 🎨 מטרת הספרייה
ספרייה מרכזית לכל רכיבי הממשק המשותפים לכל המיקרו-שירותים במערכת OVU.
כל רכיב חדש נבנה פעם אחת ומשמש את כל השירותים.

## 📋 עקרונות
1. **Consistency** - עקביות בעיצוב ובחוויית משתמש
2. **Reusability** - כל רכיב ניתן לשימוש חוזר
3. **Customization** - גמישות בהתאמות לצרכים ספציפיים
4. **Performance** - רכיבים מהירים ומאופטמים
5. **Accessibility** - נגישות מלאה
6. **RTL Support** - תמיכה מלאה בעברית

## 🗂️ מבנה הספרייה

### Flutter Components
```
flutter/
├── widgets/              # רכיבי UI
│   ├── buttons/         # כפתורים
│   ├── forms/           # טפסים
│   ├── cards/           # כרטיסיות
│   ├── dialogs/         # דיאלוגים
│   ├── navigation/      # ניווט
│   └── data_display/    # תצוגת נתונים
├── themes/              # ערכות נושא
│   ├── colors.dart      # פלטת צבעים
│   ├── typography.dart  # טיפוגרפיה
│   ├── spacing.dart     # ריווח
│   └── themes.dart      # ערכות נושא מלאות
└── assets/              # משאבים
    ├── icons/           # אייקונים
    ├── images/          # תמונות
    └── animations/      # אנימציות
```

### React Components
```
react/
├── components/          # רכיבי UI
│   ├── Button/
│   ├── Form/
│   ├── Card/
│   ├── Modal/
│   ├── Navigation/
│   └── DataTable/
├── styles/              # סגנונות
│   ├── variables.css    # משתנים
│   ├── mixins.scss      # Mixins
│   ├── base.css         # סגנון בסיס
│   └── themes/          # ערכות נושא
└── assets/              # משאבים
    ├── icons/           # אייקונים
    ├── images/          # תמונות
    └── fonts/           # גופנים
```

## 🎨 Design System

### Color Palette
```css
--primary: #1976D2
--secondary: #DC004E
--success: #4CAF50
--warning: #FF9800
--error: #F44336
--info: #2196F3

--text-primary: #212121
--text-secondary: #757575
--text-disabled: #9E9E9E

--background: #FFFFFF
--surface: #F5F5F5
--divider: #E0E0E0
```

### Typography Scale
```css
--h1: 2.5rem (40px)
--h2: 2rem (32px)
--h3: 1.75rem (28px)
--h4: 1.5rem (24px)
--h5: 1.25rem (20px)
--h6: 1.125rem (18px)
--body1: 1rem (16px)
--body2: 0.875rem (14px)
--caption: 0.75rem (12px)
```

### Spacing System
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-xxl: 48px
```

### Border Radius
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px
```

## 📦 שימוש ברכיבים

### Flutter Example
```dart
import 'package:interface_resources/widgets/buttons/primary_button.dart';
import 'package:interface_resources/themes/app_theme.dart';

class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Theme(
      data: AppTheme.lightTheme,
      child: Scaffold(
        body: PrimaryButton(
          text: 'לחץ כאן',
          onPressed: () => print('Button clicked'),
          icon: Icons.arrow_forward,
        ),
      ),
    );
  }
}
```

### React Example
```jsx
import { PrimaryButton } from '@shared/interface-resources/react/components/Button';
import { useTheme } from '@shared/interface-resources/react/hooks/useTheme';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <PrimaryButton
      onClick={() => console.log('Button clicked')}
      icon="arrow-forward"
      theme={theme}
    >
      לחץ כאן
    </PrimaryButton>
  );
}
```

## 🔄 תהליך הוספת רכיב חדש

1. **בדיקה** - האם הרכיב קיים כבר?
2. **תכנון** - איך הרכיב צריך להיראות ולעבוד?
3. **יצירה** - בניית הרכיב בספרייה המתאימה (Flutter/React)
4. **תיעוד** - הוספת דוגמאות ותיעוד
5. **בדיקה** - בדיקת הרכיב בסביבות שונות
6. **פרסום** - עדכון גרסה ופרסום לכל השירותים

## 📚 רכיבים זמינים

### Core Components
- [ ] Button (Primary, Secondary, Text, Icon)
- [ ] TextField (Standard, Outlined, Filled)
- [ ] Select/Dropdown
- [ ] Checkbox
- [ ] Radio Button
- [ ] Switch
- [ ] Slider
- [ ] DatePicker
- [ ] TimePicker

### Layout Components
- [ ] Container
- [ ] Grid
- [ ] Stack
- [ ] Spacer
- [ ] Divider
- [ ] AppBar
- [ ] Drawer
- [ ] BottomNavigation
- [ ] TabBar

### Feedback Components
- [ ] Alert
- [ ] Snackbar/Toast
- [ ] Dialog/Modal
- [ ] Progress (Linear, Circular)
- [ ] Skeleton
- [ ] Spinner

### Data Display
- [ ] Table
- [ ] List
- [ ] Card
- [ ] Avatar
- [ ] Badge
- [ ] Chip
- [ ] Tooltip
- [ ] Accordion

### Navigation
- [ ] Breadcrumb
- [ ] Stepper
- [ ] Pagination
- [ ] Menu
- [ ] Tabs

## 🛠️ Development Guidelines

### Flutter Guidelines
- Use `const` constructors where possible
- Follow Flutter naming conventions
- Implement proper state management
- Support both Material and Cupertino styles
- Add proper documentation with `///`

### React Guidelines
- Use TypeScript for type safety
- Follow React hooks best practices
- Implement proper prop validation
- Support SSR (Server-Side Rendering)
- Add JSDoc comments

## 📄 Version Management
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Changelog for all updates
- Breaking changes in major versions only
- Backward compatibility when possible
