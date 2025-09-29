import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// RTL-aware widget that automatically adjusts layout based on language
class RTLAwareWidget extends StatelessWidget {
  final Widget child;
  final bool forceRTL;
  final bool forceLTR;

  const RTLAwareWidget({
    Key? key,
    required this.child,
    this.forceRTL = false,
    this.forceLTR = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get current locale
    final locale = Localizations.localeOf(context);
    
    // Determine text direction
    TextDirection textDirection;
    if (forceRTL) {
      textDirection = TextDirection.rtl;
    } else if (forceLTR) {
      textDirection = TextDirection.ltr;
    } else {
      textDirection = _getTextDirection(locale.languageCode);
    }

    return Directionality(
      textDirection: textDirection,
      child: child,
    );
  }

  TextDirection _getTextDirection(String languageCode) {
    // RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'iw', 'ku'];
    return rtlLanguages.contains(languageCode)
        ? TextDirection.rtl
        : TextDirection.ltr;
  }
}

/// Responsive padding that adjusts for RTL
class RTLPadding extends StatelessWidget {
  final Widget child;
  final double? start;
  final double? end;
  final double? top;
  final double? bottom;

  const RTLPadding({
    Key? key,
    required this.child,
    this.start,
    this.end,
    this.top,
    this.bottom,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isRtl = Directionality.of(context) == TextDirection.rtl;
    
    return Padding(
      padding: EdgeInsetsDirectional.only(
        start: start ?? 0,
        end: end ?? 0,
        top: top ?? 0,
        bottom: bottom ?? 0,
      ),
      child: child,
    );
  }
}

/// Icon that flips automatically in RTL
class RTLAwareIcon extends StatelessWidget {
  final IconData icon;
  final double? size;
  final Color? color;
  final bool shouldFlip;

  const RTLAwareIcon({
    Key? key,
    required this.icon,
    this.size,
    this.color,
    this.shouldFlip = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isRtl = Directionality.of(context) == TextDirection.rtl;
    
    // Icons that should flip in RTL
    const flipIcons = [
      Icons.arrow_back,
      Icons.arrow_forward,
      Icons.arrow_back_ios,
      Icons.arrow_forward_ios,
      Icons.chevron_left,
      Icons.chevron_right,
      Icons.navigate_before,
      Icons.navigate_next,
      Icons.first_page,
      Icons.last_page,
      Icons.keyboard_arrow_left,
      Icons.keyboard_arrow_right,
      Icons.subdirectory_arrow_left,
      Icons.subdirectory_arrow_right,
      Icons.undo,
      Icons.redo,
      Icons.reply,
      Icons.forward,
      Icons.send,
      Icons.trending_flat,
    ];

    final shouldActuallyFlip = shouldFlip && 
        isRtl && 
        flipIcons.contains(icon);

    return Transform.scale(
      scaleX: shouldActuallyFlip ? -1 : 1,
      child: Icon(
        icon,
        size: size,
        color: color,
      ),
    );
  }
}

/// Row that automatically adjusts for RTL
class RTLRow extends StatelessWidget {
  final List<Widget> children;
  final MainAxisAlignment mainAxisAlignment;
  final MainAxisSize mainAxisSize;
  final CrossAxisAlignment crossAxisAlignment;
  final TextDirection? textDirection;
  final VerticalDirection verticalDirection;
  final TextBaseline? textBaseline;

  const RTLRow({
    Key? key,
    required this.children,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.mainAxisSize = MainAxisSize.max,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.textDirection,
    this.verticalDirection = VerticalDirection.down,
    this.textBaseline,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: mainAxisAlignment,
      mainAxisSize: mainAxisSize,
      crossAxisAlignment: crossAxisAlignment,
      textDirection: textDirection ?? Directionality.of(context),
      verticalDirection: verticalDirection,
      textBaseline: textBaseline,
      children: children,
    );
  }
}

/// Positioned widget that works with RTL
class RTLPositioned extends StatelessWidget {
  final Widget child;
  final double? start;
  final double? end;
  final double? top;
  final double? bottom;
  final double? width;
  final double? height;

  const RTLPositioned({
    Key? key,
    required this.child,
    this.start,
    this.end,
    this.top,
    this.bottom,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return PositionedDirectional(
      start: start,
      end: end,
      top: top,
      bottom: bottom,
      width: width,
      height: height,
      child: child,
    );
  }
}

/// Align widget that works with RTL
class RTLAlign extends StatelessWidget {
  final Widget child;
  final AlignmentGeometry alignment;
  final double? widthFactor;
  final double? heightFactor;

  const RTLAlign({
    Key? key,
    required this.child,
    this.alignment = AlignmentDirectional.centerStart,
    this.widthFactor,
    this.heightFactor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: alignment,
      widthFactor: widthFactor,
      heightFactor: heightFactor,
      child: child,
    );
  }
}

/// Container with RTL-aware decoration
class RTLContainer extends StatelessWidget {
  final Widget? child;
  final AlignmentGeometry? alignment;
  final EdgeInsetsGeometry? padding;
  final Color? color;
  final Decoration? decoration;
  final Decoration? foregroundDecoration;
  final double? width;
  final double? height;
  final BoxConstraints? constraints;
  final EdgeInsetsGeometry? margin;
  final Matrix4? transform;

  const RTLContainer({
    Key? key,
    this.child,
    this.alignment,
    this.padding,
    this.color,
    this.decoration,
    this.foregroundDecoration,
    this.width,
    this.height,
    this.constraints,
    this.margin,
    this.transform,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: alignment,
      padding: padding,
      color: color,
      decoration: decoration,
      foregroundDecoration: foregroundDecoration,
      width: width,
      height: height,
      constraints: constraints,
      margin: margin,
      transform: transform,
      child: child,
    );
  }
}

/// Text widget with automatic RTL alignment
class RTLText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final TextDirection? textDirection;
  final bool? softWrap;
  final TextOverflow? overflow;
  final int? maxLines;

  const RTLText(
    this.text, {
    Key? key,
    this.style,
    this.textAlign,
    this.textDirection,
    this.softWrap,
    this.overflow,
    this.maxLines,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isRtl = Directionality.of(context) == TextDirection.rtl;
    
    // Auto-align text based on direction
    TextAlign effectiveTextAlign;
    if (textAlign != null) {
      effectiveTextAlign = textAlign!;
    } else {
      effectiveTextAlign = isRtl ? TextAlign.right : TextAlign.left;
    }

    return Text(
      text,
      style: style,
      textAlign: effectiveTextAlign,
      textDirection: textDirection,
      softWrap: softWrap,
      overflow: overflow,
      maxLines: maxLines,
    );
  }
}

/// ListTile with RTL support
class RTLListTile extends StatelessWidget {
  final Widget? leading;
  final Widget? title;
  final Widget? subtitle;
  final Widget? trailing;
  final bool isThreeLine;
  final bool? dense;
  final EdgeInsetsGeometry? contentPadding;
  final bool enabled;
  final GestureTapCallback? onTap;
  final GestureLongPressCallback? onLongPress;
  final bool selected;

  const RTLListTile({
    Key? key,
    this.leading,
    this.title,
    this.subtitle,
    this.trailing,
    this.isThreeLine = false,
    this.dense,
    this.contentPadding,
    this.enabled = true,
    this.onTap,
    this.onLongPress,
    this.selected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: leading,
      title: title,
      subtitle: subtitle,
      trailing: trailing,
      isThreeLine: isThreeLine,
      dense: dense,
      contentPadding: contentPadding,
      enabled: enabled,
      onTap: onTap,
      onLongPress: onLongPress,
      selected: selected,
      textDirection: Directionality.of(context),
    );
  }
}

/// Extension methods for RTL support
extension RTLExtension on BuildContext {
  bool get isRTL => Directionality.of(this) == TextDirection.rtl;
  
  TextDirection get textDirection => Directionality.of(this);
  
  EdgeInsetsGeometry paddingRTL({
    double start = 0,
    double end = 0,
    double top = 0,
    double bottom = 0,
  }) {
    return EdgeInsetsDirectional.only(
      start: start,
      end: end,
      top: top,
      bottom: bottom,
    );
  }
  
  AlignmentGeometry get alignStart {
    return isRTL ? Alignment.centerRight : Alignment.centerLeft;
  }
  
  AlignmentGeometry get alignEnd {
    return isRTL ? Alignment.centerLeft : Alignment.centerRight;
  }
}
