import 'dart:async';
import 'package:flutter/material.dart';

class TimerScreen extends StatefulWidget {
  const TimerScreen({Key? key}) : super(key: key);

  @override
  State<TimerScreen> createState() => _TimerScreenState();
}

class _TimerScreenState extends State<TimerScreen> {
  static const int _maxSeconds = 3600; // Cap at 1 hour for simple UI
  int _initialSeconds = 60;
  int _remainingSeconds = 60;
  Timer? _timer;
  bool _isRunning = false;

  void _startTimer() {
    if (_remainingSeconds == 0) _remainingSeconds = _initialSeconds;
    
    setState(() => _isRunning = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
      } else {
        _stopTimer();
        _showFinishedDialog();
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    setState(() => _isRunning = false);
  }

  void _resetTimer() {
    _stopTimer();
    setState(() => _remainingSeconds = _initialSeconds);
  }

  void _showFinishedDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Timer Finished!'),
        content: const Icon(Icons.timer_off, size: 64),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          )
        ],
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final progress = _initialSeconds > 0 ? _remainingSeconds / _initialSeconds : 0.0;

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 300,
                  height: 300,
                  child: CircularProgressIndicator(
                    value: progress,
                    strokeWidth: 12,
                    backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
                    valueColor: AlwaysStoppedAnimation(Theme.of(context).colorScheme.primary),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                     Text(
                      '${_remainingSeconds ~/ 60}:${(_remainingSeconds % 60).toString().padLeft(2, '0')}',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        fontFeatures: [const FontFeature.tabularFigures()],
                      ),
                    ),
                    if (!_isRunning)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(icon: const Icon(Icons.remove), onPressed: () {
                              if (_initialSeconds > 10) setState(() { _initialSeconds -= 10; _remainingSeconds = _initialSeconds; });
                            }),
                            Text('Set Time', style: Theme.of(context).textTheme.bodySmall),
                            IconButton(icon: const Icon(Icons.add), onPressed: () {
                              if (_initialSeconds < _maxSeconds) setState(() { _initialSeconds += 10; _remainingSeconds = _initialSeconds; });
                            }),
                          ],
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FloatingActionButton.large(
                heroTag: 'timer_reset',
                onPressed: _resetTimer,
                backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
                child: const Icon(Icons.refresh),
              ),
              const SizedBox(width: 32),
              FloatingActionButton.large(
                heroTag: 'timer_play',
                onPressed: _isRunning ? _stopTimer : _startTimer,
                child: Icon(_isRunning ? Icons.pause : Icons.play_arrow),
              ),
            ],
          ),
          const SizedBox(height: 48),
        ],
      ),
    );
  }
}
