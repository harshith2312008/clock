import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/clock_provider.dart';
import 'clock_painter.dart';

class AnalogFace extends StatelessWidget {
  final double size;

  const AnalogFace({Key? key, this.size = 320}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Consumer<ClockProvider>(
        builder: (context, clock, child) {
          return CustomPaint(
            painter: ClockPainter(
              time: clock.now,
              colorScheme: Theme.of(context).colorScheme,
            ),
          );
        },
      ),
    );
  }
}
