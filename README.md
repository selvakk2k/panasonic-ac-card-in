# Panasonic AC India Card (formerly MirAIe AC Card) (`miraie-ac-card-in`)

[![HACS Default](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=flat-square)](https://github.com/hacs/default)
[![Stable](https://img.shields.io/github/v/release/selvakk2k/miraie-ac-card-in?label=Stable&style=flat-square)](https://github.com/selvakk2k/miraie-ac-card-in/releases/latest)
[![Beta](https://img.shields.io/github/v/release/selvakk2k/miraie-ac-card-in?include_prereleases&label=Beta&color=orange&style=flat-square)](https://github.com/selvakk2k/miraie-ac-card-in/releases)
[![AI-Assisted](https://img.shields.io/badge/AI%20Assisted-Antigravity%20%7C%20Claude-blueviolet?style=flat-square&logo=google)](https://github.com/selvakk2k)
[![AI Attribution](https://img.shields.io/badge/AI%20Attribution-AIA%20PAI%20Nc%20Hin-orange?style=flat-square)](https://aiattribution.github.io/interpret-attribution)

A custom Lovelace thermostat card for Panasonic Air Conditioners on the Indian market, designed for use with the [Panasonic AC India Integration](https://github.com/selvakk2k/ha-miraie-ac-in).

> [!IMPORTANT]
> This card is designed **exclusively** for Panasonic Air Conditioners using the **MirAIe** application. It is **not compatible** with Panasonic ACs using the global **Comfort Cloud** platform.

---

## Features

* **Multiple Visual Layouts**: Seamless borderless Google Home design and structured Classic card view with ambient active glow effects.
* **Convertible Capacity Controls**: Notched slider (Classic view) or custom dropdown picker (Google Home view) for 8-in-1 convertible steps (Normal down to 40% / up to 110%).
* **Multi-Parameter Selectors**: Dedicated pickers for Fan Speed (Auto, Low, Med, High, Powerful, Quiet) and Vertical/Horizontal Vane angles.
* **Appliance Feature Toggles**: Direct control switches for Nanoe™ Air Purifier, Indoor Unit Display LED, and Coil Self-Cleaning cycle.
* **Hybrid Transport Status**: Telemetry row displaying active backend (Cloud MQTT vs. Local IR Blaster), Wi-Fi RSSI signal strength, and last control source.
* **Energy Analytics Cards**: Quick telemetry display for Today's and Yesterday's power consumption with one-tap drill-down into Home Assistant historical graphs.
* **Haptic Touch Feedback**: Tactile vibration responses when toggling modes and adjusting setpoints on mobile devices.
* **Visual GUI Editor**: Full configuration support directly inside Home Assistant's dashboard editor without requiring manual YAML.
* **Dynamic Theming & Theme Compatibility**: Fully responsive across default Home Assistant themes and dark mode, optimized for the [Material You Theme by Nerwyn](https://github.com/Nerwyn/material-you-theme) (Google Home layout) and the [Graphite Theme by Tilman Griesel](https://github.com/TilmanGriesel/graphite) (Classic layout).

---

## Screenshots

| Google Home Style<br>*(shown with [Material You Theme](https://github.com/Nerwyn/material-you-theme))* | Classic Card Style<br>*(shown with [Graphite Theme](https://github.com/TilmanGriesel/graphite))* |
| :---: | :---: |
| **Full View**<br><img src="images/screenshot_gh_full.png" alt="Google Home Full View" width="380"> | **Full View**<br><img src="images/screenshot_classic_full.png" alt="Classic Full View" width="380"> |
| **Compact View**<br><img src="images/screenshot_gh_compact.png" alt="Google Home Compact View" width="380"> | **Compact View**<br><img src="images/screenshot_classic_compact.png" alt="Classic Compact View" width="380"> |

---

## Installation

### Method 1: Via HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=selvakk2k&repository=miraie-ac-card-in&category=plugin)

1. Click the **Open repository in HACS** button above, or open **HACS** from your Home Assistant sidebar.
2. Search for **Panasonic AC India Card**, click **Download**, and reload your dashboard.

### Method 2: Manual Installation
1. Download `miraie-ac-card.js` from the [Releases](https://github.com/selvakk2k/miraie-ac-card-in/releases) page.
2. Place the file into `<config>/www/miraie-ac-card.js`.
3. In Home Assistant, go to **Settings → Dashboards → Resources** → Add `/local/miraie-ac-card.js` as a **JavaScript Module**.

---

## Usage & Configuration

Add via the visual editor (search for **Panasonic AC India Card**) or paste manually into YAML:

```yaml
type: custom:miraie-ac-card
entity: climate.living_room_ac
name: Living Room AC
theme: default
layout: default
full_layout: google_home
nanoe_switch: switch.living_room_ac_nanoe
display_switch: switch.living_room_ac_display
coil_clean_button: button.living_room_ac_start_coil_clean
coil_cleaning_sensor: binary_sensor.living_room_ac_coil_cleaning
filter_alert_sensor: binary_sensor.living_room_ac_filter_clean_alert
rssi_sensor: sensor.living_room_ac_wifi_rssi
energy_today_sensor: sensor.living_room_ac_energy_today
energy_yesterday_sensor: sensor.living_room_ac_energy_yesterday
```

> [!NOTE]
> `type: custom:miraie-ac-card-in` is also supported as a direct alias for backwards compatibility.

### Configuration Options

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | string | **Required** | The `climate.*` entity ID to control. |
| `name` | string | Optional | Custom friendly title for the card header. |
| `theme` | string | `default` | Visual theme: `default` (Standard HA Theme) or `material_you` (Material You). |
| `layout` | string | `default` | Card geometry: `default` (Full View) or `compact` (Expandable compact row). |
| `full_layout` | string | `default` | Full view layout style: `default` (Classic) or `google_home` (Google Home). |
| `accent_color` | string | Optional | Override the active highlight color (hex code or CSS token). |
| `main_color` | string | Optional | Override the background card surface color. |
| `nanoe_switch` | string | Optional | The `switch.*` entity for Nanoe™ air purifier. |
| `display_switch` | string | Optional | The `switch.*` entity for the indoor unit LED display. |
| `coil_clean_button`| string | Optional | The `button.*` entity to trigger coil self-cleaning. |
| `rssi_sensor` | string | Optional | The `sensor.*` entity for Wi-Fi RSSI telemetry. |

---

## My Integrations & Lovelace Cards

| Integration / Card | Category | Description | Status |
| :--- | :--- | :--- | :--- |
| [Panasonic AC India](https://github.com/selvakk2k/ha-miraie-ac-in) | Integration | Local IR & Cloud MQTT control for Panasonic MirAIe Air Conditioners | `Stable` |
| [Panasonic AC India Card](https://github.com/selvakk2k/miraie-ac-card-in) | Lovelace Card | Modern Lovelace card for Panasonic ACs | `Stable` |
| [Indian BLDC Fan IR](https://github.com/selvakk2k/ha-bldc-fan-ir) | Integration | Native Home Assistant integration for Indian BLDC ceiling fans (Atomberg, Superfan) | `Stable` |
| [Indian BLDC Fan Card](https://github.com/selvakk2k/bldc-fan-card) | Lovelace Card | Interactive Lovelace card with speed dial & mode toggles for BLDC fans | `Stable` |
| [IFB Washer Local](https://github.com/selvakk2k/ifb-washer-local) | Integration | Local Wi-Fi integration for IFB Front Load Washing Machines & Washer Dryers | `Beta` |
| [IFB Washer Card](https://github.com/selvakk2k/ifb-washer-card) | Lovelace Card | Dedicated Lovelace card for IFB washers & dryers with cycle controls | `Beta` |
| [Tinxy Local Python](https://github.com/selvakk2k/ha-tinxylocal) | Integration | Pure-Python local control for Tinxy smart switches and modules | `Stable` |
---

## Credits & License

### Project Contributors & AI Attribution
* **Lead Architecture & Design**: [@selvakk2k](https://github.com/selvakk2k) — Lovelace UX design, styling tokens, and hardware verification on Indian AC models.
* **Code Implementation & Engineering**: **Antigravity** (Google DeepMind) — custom card component architecture, dynamic slider interactions, and HACS compliance.
* **Pre-Release Code Review & Auditing**: **Claude** (Anthropic) — independent code review, security audits, and edge-case verification.

Licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
