import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../providers/clock_provider.dart';
import '../widgets/analog_face.dart';

class AnalogClockScreen extends StatelessWidget {
  const AnalogClockScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const AnalogFace(size: 300),
          const SizedBox(height: 32),
          // Digital time below
          Consumer<ClockProvider>(
            builder: (context, clock, child) {
              return Text(
                DateFormat('HH:mm:ss').format(clock.now),
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  fontWeight: FontWeight.w300,
                  fontFeatures: [const FontFeature.tabularFigures()],
                ),
              );
            },
          ),
          const SizedBox(height: 8),
          Consumer<ClockProvider>(
            builder: (context, clock, child) {
              return Text(
                DateFormat('EEEE, MMMM d').format(clock.now),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
