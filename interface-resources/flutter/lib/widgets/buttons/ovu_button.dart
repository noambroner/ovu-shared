import 'package:flutter/material.dart';
import '../../themes/app_colors.dart';

enum OvuButtonType { primary, secondary, text, outlined }
enum OvuButtonSize { small, medium, large }

/// Base button widget for OVU System
class OvuButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final OvuButtonType type;
  final OvuButtonSize size;
  final IconData? icon;
  final bool isLoading;
  final bool isFullWidth;
  final Color? customColor;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? padding;

  const OvuButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.type = OvuButtonType.primary,
    this.size = OvuButtonSize.medium,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.customColor,
    this.borderRadius,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SizedBox(
      width: isFullWidth ? double.infinity : null,
      height: _getHeight(),
      child: _buildButton(theme),
    );
  }

  Widget _buildButton(ThemeData theme) {
    switch (type) {
      case OvuButtonType.primary:
        return _buildPrimaryButton(theme);
      case OvuButtonType.secondary:
        return _buildSecondaryButton(theme);
      case OvuButtonType.text:
        return _buildTextButton(theme);
      case OvuButtonType.outlined:
        return _buildOutlinedButton(theme);
    }
  }

  Widget _buildPrimaryButton(ThemeData theme) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: customColor ?? AppColors.primary,
        foregroundColor: Colors.white,
        padding: padding ?? _getPadding(),
        shape: RoundedRectangleBorder(
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
        elevation: 2,
      ),
      child: _buildChild(theme, Colors.white),
    );
  }

  Widget _buildSecondaryButton(ThemeData theme) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: customColor ?? AppColors.secondary,
        foregroundColor: Colors.white,
        padding: padding ?? _getPadding(),
        shape: RoundedRectangleBorder(
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
        elevation: 2,
      ),
      child: _buildChild(theme, Colors.white),
    );
  }

  Widget _buildTextButton(ThemeData theme) {
    return TextButton(
      onPressed: isLoading ? null : onPressed,
      style: TextButton.styleFrom(
        foregroundColor: customColor ?? AppColors.primary,
        padding: padding ?? _getPadding(),
        shape: RoundedRectangleBorder(
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
      ),
      child: _buildChild(theme, customColor ?? AppColors.primary),
    );
  }

  Widget _buildOutlinedButton(ThemeData theme) {
    return OutlinedButton(
      onPressed: isLoading ? null : onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: customColor ?? AppColors.primary,
        side: BorderSide(
          color: customColor ?? AppColors.primary,
          width: 1.5,
        ),
        padding: padding ?? _getPadding(),
        shape: RoundedRectangleBorder(
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
      ),
      child: _buildChild(theme, customColor ?? AppColors.primary),
    );
  }

  Widget _buildChild(ThemeData theme, Color color) {
    if (isLoading) {
      return SizedBox(
        width: _getIconSize(),
        height: _getIconSize(),
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(color),
        ),
      );
    }

    final textWidget = Text(
      text,
      style: _getTextStyle(theme, color),
      textAlign: TextAlign.center,
    );

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: _getIconSize(), color: color),
          const SizedBox(width: 8),
          Flexible(child: textWidget),
        ],
      );
    }

    return textWidget;
  }

  double _getHeight() {
    switch (size) {
      case OvuButtonSize.small:
        return 32;
      case OvuButtonSize.medium:
        return 40;
      case OvuButtonSize.large:
        return 48;
    }
  }

  EdgeInsetsGeometry _getPadding() {
    switch (size) {
      case OvuButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
      case OvuButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
      case OvuButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
    }
  }

  TextStyle _getTextStyle(ThemeData theme, Color color) {
    double fontSize;
    switch (size) {
      case OvuButtonSize.small:
        fontSize = 14;
        break;
      case OvuButtonSize.medium:
        fontSize = 16;
        break;
      case OvuButtonSize.large:
        fontSize = 18;
        break;
    }

    return theme.textTheme.labelLarge!.copyWith(
      fontSize: fontSize,
      fontWeight: FontWeight.w600,
      color: color,
    );
  }

  double _getIconSize() {
    switch (size) {
      case OvuButtonSize.small:
        return 16;
      case OvuButtonSize.medium:
        return 20;
      case OvuButtonSize.large:
        return 24;
    }
  }
}

/// Primary Button - Main actions
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isLoading;
  final bool isFullWidth;
  final OvuButtonSize size;

  const PrimaryButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.size = OvuButtonSize.medium,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OvuButton(
      text: text,
      onPressed: onPressed,
      type: OvuButtonType.primary,
      size: size,
      icon: icon,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
    );
  }
}

/// Secondary Button - Alternative actions
class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isLoading;
  final bool isFullWidth;
  final OvuButtonSize size;

  const SecondaryButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.icon,
    this.isLoading = false,
    this.isFullWidth = false,
    this.size = OvuButtonSize.medium,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OvuButton(
      text: text,
      onPressed: onPressed,
      type: OvuButtonType.secondary,
      size: size,
      icon: icon,
      isLoading: isLoading,
      isFullWidth: isFullWidth,
    );
  }
}
