import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';

/// Main localization class for OVU System
class AppLocalizations {
  final Locale locale;
  late Map<String, dynamic> _localizedStrings;

  AppLocalizations(this.locale);

  // Static member to access the delegate from MaterialApp/CupertinoApp
  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  // Helper method to get the current instance
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  // Supported languages
  static const List<Locale> supportedLocales = [
    Locale('he', 'IL'), // Hebrew (Israel) - RTL
    Locale('en', 'US'), // English (US) - LTR
    Locale('ar', 'SA'), // Arabic (Saudi Arabia) - RTL
    Locale('ru', 'RU'), // Russian - LTR
    Locale('fr', 'FR'), // French - LTR
  ];

  // Check if locale is RTL
  static bool isRTL(String languageCode) {
    return ['he', 'ar', 'fa', 'ur'].contains(languageCode);
  }

  // Get text direction for current locale
  TextDirection get textDirection {
    return isRTL(locale.languageCode) ? TextDirection.rtl : TextDirection.ltr;
  }

  // Load translations from JSON
  Future<bool> load() async {
    String jsonString = await rootBundle.loadString(
      'assets/i18n/${locale.languageCode}.json',
    );
    Map<String, dynamic> jsonMap = json.decode(jsonString);
    
    _localizedStrings = jsonMap.map((key, value) {
      return MapEntry(key, value.toString());
    });

    return true;
  }

  // Get translated string
  String translate(String key, {Map<String, String>? params}) {
    String translation = _localizedStrings[key] ?? key;
    
    // Replace parameters if provided
    if (params != null) {
      params.forEach((paramKey, paramValue) {
        translation = translation.replaceAll('{$paramKey}', paramValue);
      });
    }
    
    return translation;
  }

  // Convenience method
  String get(String key, {Map<String, String>? params}) => translate(key, params: params);

  // Common translations - getters for easy access
  String get appName => translate('app_name');
  String get login => translate('login');
  String get logout => translate('logout');
  String get register => translate('register');
  String get email => translate('email');
  String get password => translate('password');
  String get confirmPassword => translate('confirm_password');
  String get forgotPassword => translate('forgot_password');
  String get resetPassword => translate('reset_password');
  String get dashboard => translate('dashboard');
  String get users => translate('users');
  String get settings => translate('settings');
  String get profile => translate('profile');
  String get save => translate('save');
  String get cancel => translate('cancel');
  String get delete => translate('delete');
  String get edit => translate('edit');
  String get add => translate('add');
  String get search => translate('search');
  String get loading => translate('loading');
  String get error => translate('error');
  String get success => translate('success');
  String get warning => translate('warning');
  String get info => translate('info');
  String get yes => translate('yes');
  String get no => translate('no');
  String get confirm => translate('confirm');
  String get back => translate('back');
  String get next => translate('next');
  String get finish => translate('finish');
  String get home => translate('home');
  String get welcome => translate('welcome');
  String get language => translate('language');
  String get theme => translate('theme');
  String get darkMode => translate('dark_mode');
  String get lightMode => translate('light_mode');
  String get systemDefault => translate('system_default');
  
  // Date & Time
  String get today => translate('today');
  String get yesterday => translate('yesterday');
  String get tomorrow => translate('tomorrow');
  String get week => translate('week');
  String get month => translate('month');
  String get year => translate('year');
  
  // Validation messages
  String get required => translate('required');
  String get invalidEmail => translate('invalid_email');
  String get passwordTooShort => translate('password_too_short');
  String get passwordsDoNotMatch => translate('passwords_do_not_match');
  
  // Error messages
  String get networkError => translate('network_error');
  String get serverError => translate('server_error');
  String get unknownError => translate('unknown_error');
  String get sessionExpired => translate('session_expired');
  String get accessDenied => translate('access_denied');
}

// Localization delegate
class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'he', 'ar', 'ru', 'fr'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    AppLocalizations localizations = AppLocalizations(locale);
    await localizations.load();
    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

/// Extension for easy localization
extension LocalizationExtension on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this);
  
  String tr(String key, {Map<String, String>? params}) {
    return AppLocalizations.of(this).translate(key, params: params);
  }
  
  bool get isRTL {
    return AppLocalizations.isRTL(
      AppLocalizations.of(this).locale.languageCode
    );
  }
  
  TextDirection get textDirection {
    return AppLocalizations.of(this).textDirection;
  }
}
