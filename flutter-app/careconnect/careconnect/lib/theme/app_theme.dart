import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: const Color(0xFFF6FBFF),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0.5,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0F172A),
        ),
        iconTheme: IconThemeData(color: Color(0xFF0F172A)),
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(color: Color(0xFF0F172A)),
      ),
    );
  }

  static ThemeData highContrast() {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: const Color(0xFFFFFFFF),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.black,
        surfaceTintColor: Colors.black,
        elevation: 0.5,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: Color(0xFFFFFFFF),
        ),
        iconTheme: IconThemeData(color: Color(0xFFFFFFFF)),
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(color: Color(0xFF000000)),
      ),
      primaryColor: Colors.black,
      primaryColorDark: Colors.black,
      cardColor: Colors.white,
      dividerColor: Colors.black,
      colorScheme: const ColorScheme.light(
        primary: Colors.black,
        onPrimary: Colors.white,
        secondary: Colors.black,
        onSecondary: Colors.white,
        error: Color(0xFFD81B3A),
        onError: Colors.white,
        surface: Colors.white,
        onSurface: Colors.black,
      ),
    );
  }
}
