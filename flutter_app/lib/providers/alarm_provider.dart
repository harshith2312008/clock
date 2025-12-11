import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/alarm_model.dart';

class AlarmProvider with ChangeNotifier {
  List<Alarm> _alarms = [];
  bool _isLoading = true;

  List<Alarm> get alarms => _alarms;
  bool get isLoading => _isLoading;

  AlarmProvider() {
    _loadAlarms();
  }

  Future<void> _loadAlarms() async {
    final prefs = await SharedPreferences.getInstance();
    final String? alarmsJson = prefs.getString('alarms');
    if (alarmsJson != null) {
      final List<dynamic> decoded = json.decode(alarmsJson);
      _alarms = decoded.map((item) => Alarm.fromMap(item)).toList();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> _saveAlarms() async {
    final prefs = await SharedPreferences.getInstance();
    final String encoded = json.encode(_alarms.map((a) => a.toMap()).toList());
    await prefs.setString('alarms', encoded);
    notifyListeners();
  }

  Future<void> addAlarm(Alarm alarm) async {
    _alarms.add(alarm);
    await _saveAlarms();
  }

  Future<void> updateAlarm(Alarm updatedAlarm) async {
    final index = _alarms.indexWhere((a) => a.id == updatedAlarm.id);
    if (index != -1) {
      _alarms[index] = updatedAlarm;
      await _saveAlarms();
    }
  }

  Future<void> deleteAlarm(String id) async {
    _alarms.removeWhere((a) => a.id == id);
    await _saveAlarms();
  }

  Future<void> toggleAlarm(String id, bool isActive) async {
    final index = _alarms.indexWhere((a) => a.id == id);
    if (index != -1) {
      _alarms[index] = _alarms[index].copyWith(isActive: isActive);
      await _saveAlarms();
    }
  }
}
