import 'dart:async';
import 'package:flutter/foundation.dart';

class ClockProvider with ChangeNotifier {
  DateTime _now = DateTime.now();
  Timer? _timer;

  DateTime get now => _now;
  // Callback to check alarms
  Function(DateTime)? onSecondTick;

  ClockProvider() {
    _startTicker();
  }

  void _startTicker() {
    _now = DateTime.now();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _now = DateTime.now();
      if (onSecondTick != null) onSecondTick!(_now);
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
