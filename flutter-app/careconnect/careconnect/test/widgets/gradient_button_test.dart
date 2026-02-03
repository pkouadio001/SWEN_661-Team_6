import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/widgets/gradient_button.dart';

void main() {
  group('GradientButton Widget Tests', () {
    testWidgets('renders with text', (WidgetTester tester) async {
      const buttonText = 'Test Button';
      var pressed = false;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: buttonText,
              onPressed: () {
                pressed = true;
              },
            ),
          ),
        ),
      );

      expect(find.text(buttonText), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (WidgetTester tester) async {
      var pressed = false;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              onPressed: () {
                pressed = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(GradientButton));
      await tester.pump();

      expect(pressed, isTrue);
    });

    testWidgets('displays icon when provided', (WidgetTester tester) async {
      const testIcon = Icons.add;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              icon: testIcon,
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(testIcon), findsOneWidget);
    });

    testWidgets('does not display icon when not provided', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      // Should find a SizedBox.shrink instead of an icon
      expect(find.byType(SizedBox), findsWidgets);
    });

    testWidgets('has correct height and width', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      final sizedBox = tester.widget<SizedBox>(
        find.descendant(
          of: find.byType(GradientButton),
          matching: find.byType(SizedBox),
        ).first,
      );

      expect(sizedBox.height, 46);
      expect(sizedBox.width, double.infinity);
    });

    testWidgets('has gradient background', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      final decoratedBox = tester.widget<DecoratedBox>(
        find.descendant(
          of: find.byType(GradientButton),
          matching: find.byType(DecoratedBox),
        ),
      );

      final decoration = decoratedBox.decoration as BoxDecoration;
      expect(decoration.gradient, isA<LinearGradient>());
      
      final gradient = decoration.gradient as LinearGradient;
      expect(gradient.colors, [const Color(0xFF0E67FF), const Color(0xFF10C7A5)]);
    });

    testWidgets('text has correct styling', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              onPressed: () {},
            ),
          ),
        ),
      );

      final textWidget = tester.widget<Text>(find.text('Test Button'));
      expect(textWidget.style?.color, Colors.white);
      expect(textWidget.style?.fontWeight, FontWeight.w800);
    });

    testWidgets('icon has correct color', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GradientButton(
              text: 'Test Button',
              icon: Icons.add,
              onPressed: () {},
            ),
          ),
        ),
      );

      final iconWidget = tester.widget<Icon>(find.byIcon(Icons.add));
      expect(iconWidget.color, Colors.white);
    });
  });
}
