export interface MirAIeCardConfig {
  type: string;
  entity: string;
  name?: string;
  // Theming & Visibility Toggles
  theme?: string;
  layout?: string;
  full_layout?: string;
  accent_color?: string;
  main_color?: string;
  show_controls?: boolean;
  show_energy?: boolean;
  show_diagnostics?: boolean;
  // Optional sensor overrides
  room_temp_sensor?: string;
  humidity_sensor?: string;
  // Controls
  nanoe_switch?: string;
  display_switch?: string; // Supports either switch.* (On/Off) or select.* (Display Mode: On/Night/Off)
  coil_clean_button?: string;
  coil_cleaning_sensor?: string;
  filter_alert_sensor?: string;
  // 2.0 Hybrid Architecture Controls & Diagnostics
  hybrid_submode_switch?: string;
  active_backend_switch?: string;
  ir_blaster_sensor?: string;
  cloud_mqtt_sensor?: string;
  local_udp_sensor?: string;
  device_online_sensor?: string;
  control_source_sensor?: string;
  // Diagnostics
  rssi_sensor?: string;
  energy_today_sensor?: string;
  energy_yesterday_sensor?: string;
  estimated_power_sensor?: string;
  compressor_frequency_sensor?: string;
  evaporator_coil_temp_sensor?: string;
  outdoor_condenser_temp_sensor?: string;
  voltage_sensor?: string;
  current_sensor?: string;
}
