import 'dart:math';
import 'package:flutter/material.dart';

class ClockPainter extends CustomPainter {
  final DateTime time;
  final ColorScheme colorScheme;

  ClockPainter({required this.time, required this.colorScheme});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) / 2;

    // Background
    final bgPaint = Paint()..color = colorScheme.surfaceVariant;
    canvas.drawCircle(center, radius, bgPaint);

    // Ticks
    final minuteTickPaint = Paint()
      ..color = colorScheme.outlineVariant
      ..strokeWidth = 1.0
      ..strokeCap = StrokeCap.round;

    final hourTickPaint = Paint()
      ..color = colorScheme.primary
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    for (int i = 0; i < 60; i++) {
      final angle = (i * 6) * (pi / 180);
      final isHour = i % 5 == 0;
      final length = isHour ? 12.0 : 6.0;
      final Paint tickPaint = isHour ? hourTickPaint : minuteTickPaint;

      // React Code had specific exclusions
      if (!isHour) { // Minute ticks
         // Logic same as React: i % 5 != 0
      }

      final p1 = Offset(
        center.dx + (radius - length - 4) * cos(angle), // Inset slightly
        center.dy + (radius - length - 4) * sin(angle),
      );
      final p2 = Offset(
        center.dx + (radius - 4) * cos(angle),
        center.dy + (radius - 4) * sin(angle),
      );
      
      canvas.drawLine(p1, p2, tickPaint);
    }

    // Hands
    final double second = time.second.toDouble();
    final double minute = time.minute.toDouble();
    final double hour = time.hour.toDouble() % 12;

    // Angles (Standard - 90 degrees offset handled by cos/sin logic if starting from 0=3 o'clock, but easier to just rotate canvas)
    // Actually, simple math: 0 degrees = 3 oclock. 
    // 12 oclock = -90 degrees.
    
    // Hour Hand
    final hourAngle = ((hour + minute / 60) / 12) * 2 * pi - (pi / 2);
    _drawHand(canvas, center, hourAngle, radius * 0.5, colorScheme.onSurface, 6.0);

    // Minute Hand
    final minuteAngle = ((minute + second / 60) / 60) * 2 * pi - (pi / 2);
    _drawHand(canvas, center, minuteAngle, radius * 0.75, colorScheme.primary, 4.0);

    // Second Hand
    final secondAngle = (second / 60) * 2 * pi - (pi / 2);
    // Draw with piviot extension
    final secondHandPaint = Paint()
      ..color = colorScheme.error
      ..strokeWidth = 2.0
      ..strokeCap = StrokeCap.round;

    final secondHandEnd = Offset(
      center.dx + (radius * 0.85) * cos(secondAngle),
      center.dy + (radius * 0.85) * sin(secondAngle),
    );
    final secondHandStart = Offset(
      center.dx - (radius * 0.15) * cos(secondAngle), // Extension back
      center.dy - (radius * 0.15) * sin(secondAngle),
    );
    
    canvas.drawLine(secondHandStart, secondHandEnd, secondHandPaint);

    // Center pivot
    final pivotPaint = Paint()..color = colorScheme.surface;
    canvas.drawCircle(center, 4.0, Paint()..color = colorScheme.error); // Outer ring
    canvas.drawCircle(center, 2.0, pivotPaint); // Inner hole
  }

  void _drawHand(Canvas canvas, Offset center, double angle, double length, Color color, double width) {
    final handPaint = Paint()
      ..color = color
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round;

    final end = Offset(
      center.dx + length * cos(angle),
      center.dy + length * sin(angle),
    );
    canvas.drawLine(center, end, handPaint);
  }

  @override
  bool shouldRepaint(covariant ClockPainter oldDelegate) {
    return oldDelegate.time.second != time.second;
  }
}
