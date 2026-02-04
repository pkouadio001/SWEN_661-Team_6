import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect/screens/communication/messages_screen.dart';

void main() {
  testWidgets('MessagesScreen renders properly', (tester) async {
    final router = GoRouter(
      initialLocation: '/comm/messages',
      routes: [
        GoRoute(
          path: '/comm',
          builder: (_, __) => const Scaffold(body: Center(child: Text('COMM'))),
          routes: [
            GoRoute(
              path: 'messages',
              builder: (_, __) => const MessagesScreen(),
            ),
          ],
        ),
      ],
    );

    await tester.pumpWidget(
      ProviderScope(child: MaterialApp.router(routerConfig: router)),
    );
    await tester.pumpAndSettle();

    // AppBar title + subtitle
    expect(
      find.text('Messages'),
      findsWidgets,
    ); // title appears more than once (AppBar + card)
    expect(find.text('Stay connected with your care team'), findsWidgets);

    // Back pill
    expect(find.text('Back to Communication & Safety'), findsOneWidget);

    // At least one thread should render from your provider default state
    // We check "↩ Reply" exists (it is inside each thread card).
    expect(find.text('↩ Reply'), findsWidgets);
  });
}
