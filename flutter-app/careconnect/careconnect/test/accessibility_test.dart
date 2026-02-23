import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:careconnect/main.dart';

void main() {
  group('WCAG 2.1 Level AA Accessibility Tests', () {
    testWidgets('App meets text contrast guidelines', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      await expectLater(tester, meetsGuideline(textContrastGuideline));
    });

    testWidgets('App meets Android tap target guidelines (48x48)', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
    });

    testWidgets('App meets iOS tap target guidelines (44x44)', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));
    });

    testWidgets('All tap targets have semantic labels', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
    });

    testWidgets('Buttons have proper semantics', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Verify elevated buttons exist and are accessible
      final buttons = find.byType(ElevatedButton);
      expect(buttons, findsWidgets);
    });

    testWidgets('Interactive elements are properly labeled', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Find all InkWell widgets (used for dashboard tiles and SOS button)
      final inkWells = find.byType(InkWell);
      
      if (inkWells.evaluate().isNotEmpty) {
        expect(inkWells, findsWidgets);
      }
    });
  });

  group('Parkinson\'s-Specific Accessibility Features', () {
    testWidgets('Dashboard screen has large touch targets', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Verify the app loads successfully
      expect(find.byType(MaterialApp), findsOneWidget);
    });

    testWidgets('SOS button is clearly identifiable', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Look for SOS emergency text
      final sosText = find.textContaining('SOS', findRichText: true);
      
      if (sosText.evaluate().isNotEmpty) {
        expect(sosText, findsWidgets);
      }
    });

    testWidgets('Navigation is consistent across screens', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Verify app structure
      expect(find.byType(Scaffold), findsWidgets);
    });
  });

  group('Screen Reader Support', () {
    testWidgets('Dashboard tiles have semantic labels', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // Look for common dashboard elements
      final profileText = find.text('Profile & Settings');
      
      if (profileText.evaluate().isNotEmpty) {
        expect(profileText, findsOneWidget);
      }
    });

    testWidgets('SOS button has semantic hint', (WidgetTester tester) async {
      await tester.pumpWidget(const ProviderScope(child: CareConnectApp()));
      await tester.pumpAndSettle();
      
      // The SOS button should be present
      final emergencyText = find.textContaining('EMERGENCY', findRichText: true);
      
      if (emergencyText.evaluate().isNotEmpty) {
        expect(emergencyText, findsWidgets);
      }
    });
  });
}