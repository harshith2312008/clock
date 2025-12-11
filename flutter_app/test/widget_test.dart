import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:clock_app/main.dart'; // Adjust if package name differs
import 'package:clock_app/providers/clock_provider.dart';
import 'package:clock_app/providers/alarm_provider.dart';

void main() {
  testWidgets('Clock App Smoke Test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // We need to wrap with providers manually if we test HomeScreen directly, 
    // or just pump ClockApp which has MultiProvider.
    await tester.pumpWidget(const ClockApp());

    // Verify Analog Clock is default
    expect(find.byIcon(Icons.access_time), findsOneWidget);
    // There might be rich text, so simple text matching might fail on format details
    // but we can check for the tab bar presence.
    expect(find.text('Clock'), findsOneWidget);
    expect(find.text('Alarm'), findsOneWidget);

    // Tap the Alarm icon and trigger a frame.
    await tester.tap(find.text('Alarm'));
    await tester.pumpAndSettle();

    // Verify Alarm screen
    expect(find.byIcon(Icons.add), findsOneWidget);
  });
}
