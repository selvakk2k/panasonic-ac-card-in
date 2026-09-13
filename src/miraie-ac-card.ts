import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { MirAIeCardConfig } from './types';
import { styles } from './styles';

/* ── Card picker & By-Entity suggestion registration ── */
const customCardEntry = {
  type: 'miraie-ac-card',
  name: 'Panasonic AC India Card',
  description: 'A premium thermostat card for Indian-market Panasonic MirAIe AC units',
  preview: true,
  domain: 'climate',
  domains: ['climate'],
  documentationURL: 'https://github.com/selvakk2k/panasonic-ac-card-in',
};
(window as any).customCards = (window as any).customCards || [];
const existingCardIdx = (window as any).customCards.findIndex(
  (c: any) => c.type === 'miraie-ac-card' || c.type === 'custom:miraie-ac-card' || c.type === 'miraie-ac-card-in' || c.type === 'custom:miraie-ac-card-in' || c.type === 'panasonic-ac-card-in' || c.type === 'custom:panasonic-ac-card-in'
);
if (existingCardIdx >= 0) {
  (window as any).customCards[existingCardIdx] = customCardEntry;
} else {
  (window as any).customCards.push(customCardEntry);
}

/* ─────────────────────────────────────────────
   Pure helpers (no side effects)
   ───────────────────────────────────────────── */

/** Parse "cv NNN" → number.  "cv 0" → 0.  Unknown → -1. */
function parseCv(opt: string): number {
  const m = /^cv[\s_]+(\d+)$/.exec((opt ?? '').trim());
  return m ? parseInt(m[1], 10) : -1;
}

/**
 * Detect Converti8 vs Converti7 by the presence of the 60 % and 50 % steps
 * (8-in-1 replaces the single 55 % step with 60 % + 50 %).
 */
function convertiLabel(options: string[]): string {
  if (!options?.length) return 'Convertible';
  return options.some(o => parseCv(o) === 60) && options.some(o => parseCv(o) === 50) ? 'Converti8' : 'Converti7';
}

/** Round to 2 dp, no trailing zeros. */
function fmt2(v: number | string): string {
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toFixed(2);
}

@customElement('miraie-ac-card-in')
export class MirAIeACCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: MirAIeCardConfig;

  /** Which expandable picker is open: 'fan' | 'swing_v' | 'swing_h' | null */
  @state() private _openPanel: string | null = null;
  @state() private _expanded: boolean = false;
  @state() private _ghDropdown: string | null = null;

  static get styles() { return styles; }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this._handleWindowClick);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this._handleWindowClick);
    super.disconnectedCallback();
  }

  private _handleWindowClick = (e: MouseEvent) => {
    const path = e.composedPath();
    if (this._ghDropdown && !path.includes(this)) {
      this._ghDropdown = null;
    }
  };

  /* ── Native visual editor (HA renders this; no custom element needed) ── */
  static getConfigForm() {
    return {
      schema: [
        { name: 'entity',  required: true, selector: { entity: { domain: 'climate', integration: 'miraie_in' } } },
        { name: 'name',    selector: { text: {} } },
        { name: 'theme', selector: { select: { options: [{ label: 'Default HA Theme', value: 'default' }, { label: 'Material You (Optimized for Material 3 Theme)', value: 'material_you' }] } } },
        { name: 'layout', selector: { select: { options: [{ label: 'Default (Full)', value: 'default' }, { label: 'Compact (Expandable)', value: 'compact' }] } } },
        { name: 'full_layout', selector: { select: { options: [{ label: 'Classic', value: 'default' }, { label: 'Google Home', value: 'google_home' }] } } },
        {
          name: '', type: 'expandable', title: 'Theming & Colors', icon: 'mdi:palette',
          schema: [
            { name: 'accent_color', label: 'Accent Color', selector: { ui_color: {} } },
            { name: 'main_color', label: 'Background Color', selector: { ui_color: {} } },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Display Sensors', icon: 'mdi:thermometer',
          schema: [
            { name: 'room_temp_sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
            { name: 'humidity_sensor',  selector: { entity: { domain: 'sensor', device_class: 'humidity'    } } },
          ],
        },
        {
          name: '', type: 'expandable', title: '2.0 Hybrid Transport Architecture (Auto-Discovered if blank)', icon: 'mdi:swap-horizontal-circle-outline',
          schema: [
            { name: 'hybrid_submode_switch', selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'active_backend_switch', selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'ir_blaster_sensor',     selector: { entity: { domain: ['binary_sensor', 'infrared', 'remote'] } } },
            { name: 'cloud_mqtt_sensor',     selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } } },
            { name: 'control_source_sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Convertible & Controls', icon: 'mdi:toggle-switch-outline',
          schema: [

            { name: 'nanoe_switch',            selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'display_switch',          selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'coil_clean_button',       selector: { entity: { domain: 'button', integration: 'miraie_in' } } },
            { name: 'coil_cleaning_sensor',    selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } } },
            {
              name: 'filter_alert_sensor',
              selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } },
            },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Diagnostics & Energy', icon: 'mdi:chart-line',
          schema: [
            { name: 'rssi_sensor',             selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'energy_today_sensor',     selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'energy_yesterday_sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
          ],
        },
      ],
    };
  }

  static getStubConfig(hass?: HomeAssistant, entities?: string[], entitiesFallback?: string[]) {
    let entity = '';
    if (entities && entities.length) {
      entity = entities.find(e => e.startsWith('climate.')) || '';
    }
    if (!entity && entitiesFallback && entitiesFallback.length) {
      entity = entitiesFallback.find(e => e.startsWith('climate.')) || '';
    }
    if (!entity && hass && hass.states) {
      entity = Object.keys(hass.states).find(e => e.startsWith('climate.')) || '';
    }
    return { type: 'custom:miraie-ac-card', entity };
  }

  /* ── Config ── */
  public setConfig(config: MirAIeCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = { ...config };
    this._openPanel = null;
  }

  /* ── Lifecycle ── */
  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('_config')) {
      const theme = this._config?.theme || 'default';
      if (this.getAttribute('theme') !== theme) {
        this.setAttribute('theme', theme);
      }
      if (this._config?.accent_color) {
        this.style.setProperty('--appliance-accent', this._config.accent_color);
        this.style.setProperty('--m-accent', this._config.accent_color);
      } else {
        this.style.removeProperty('--appliance-accent');
        this.style.removeProperty('--m-accent');
      }
      if (this._config?.main_color) {
        this.style.setProperty('--appliance-bg', this._config.main_color);
        this.style.setProperty('--m-bg', this._config.main_color);
      } else {
        this.style.removeProperty('--appliance-bg');
        this.style.removeProperty('--m-bg');
      }
    }
  }

  /* ── Selective re-render ── */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config') || changedProps.has('_openPanel') || changedProps.has('_expanded') || changedProps.has('_ghDropdown')) return true;
    if (changedProps.has('hass') && this._config) {
      const old = changedProps.get('hass') as HomeAssistant | undefined;
      if (!old) return true;
      const cfg = this._config;
      if (!cfg.entity) return true;
      const base = cfg.entity.replace(/^climate\./, '');
      const keys = Object.keys(this.hass.states);
      for (const k of keys) {
        if (k === cfg.entity || k.includes(base)) {
          if (old.states[k] !== this.hass.states[k]) return true;
        }
      }
      return false;
    }
    return false;
  }


  /* ─────────────────────────────────────────────
     Render
     ───────────────────────────────────────────── */
  protected render(): TemplateResult | null {
    if (!this.hass || !this._config) return null;

    const cfg = this._config;
    const entityId = cfg.entity;
    const stateObj = entityId ? this.hass.states[entityId] : undefined;
    if (!stateObj) {
      return html`
        <ha-card class="m-card" style="padding: 24px; text-align: center; color: var(--appliance-text-2, var(--secondary-text-color, #8e8e93));">
          <ha-icon icon="mdi:air-conditioner" style="--mdc-icon-size: 40px; margin-bottom: 8px; opacity: 0.6; color: var(--miraie-accent, var(--primary-color, #f39c12));"></ha-icon>
          <div style="font-weight: 500; font-size: 15px; color: var(--appliance-text-1, var(--primary-text-color, inherit));">MirAIe AC Card</div>
          <div style="font-size: 13px; margin-top: 4px;">
            ${entityId ? html`Entity not found: <code>${entityId}</code>` : 'Please select a Panasonic MirAIe climate entity in the card editor.'}
          </div>
        </ha-card>
      `;
    }

    const a = stateObj.attributes;
    const isOnline = stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    const isOn     = stateObj.state !== 'off' && isOnline;

    const friendlyName = cfg.name || a.friendly_name || 'AC';
    const targetTemp   = a.temperature;
    const minTemp      = a.min_temp ?? 16;
    const maxTemp      = a.max_temp ?? 30;
    const presetMode   = a.preset_mode;
    const effectiveMin = presetMode === 'eco' ? 16 : minTemp;
    const effectiveMax = presetMode === 'eco' ? 30 : maxTemp;
    const hvacMode     = stateObj.state;
    const fanMode      = a.fan_mode;
    const swingV       = a.swing_mode;
    const swingH       = a.swing_horizontal_mode;

    /* Room temperature: external sensor overrides AC built-in */
    const roomSensor   = cfg.room_temp_sensor ? this.hass.states[cfg.room_temp_sensor] : undefined;
    let currentTemp: any = roomSensor ? roomSensor.state : a.current_temperature;
    if (currentTemp != null && !isNaN(Number(currentTemp))) {
      currentTemp = Number(currentTemp).toFixed(1);
    }

    /* Humidity */
    const humidState   = cfg.humidity_sensor ? this.hass.states[cfg.humidity_sensor] : undefined;
    let humidVal: any = humidState ? humidState.state : undefined;
    if (humidVal != null && !isNaN(Number(humidVal))) {
      humidVal = Number(humidVal).toFixed(1);
    }

    /* Helper entities */

    const nanoe        = cfg.nanoe_switch              ? this.hass.states[cfg.nanoe_switch]              : undefined;
    const display      = cfg.display_switch            ? this.hass.states[cfg.display_switch]            : undefined;
    const coilBtn      = cfg.coil_clean_button         ? this.hass.states[cfg.coil_clean_button]         : undefined;
    const coilSensor   = cfg.coil_cleaning_sensor      ? this.hass.states[cfg.coil_cleaning_sensor]      : undefined;
    const filterAlert  = cfg.filter_alert_sensor       ? this.hass.states[cfg.filter_alert_sensor]       : undefined;
    const rssi         = cfg.rssi_sensor               ? this.hass.states[cfg.rssi_sensor]               : undefined;
    const energyToday  = cfg.energy_today_sensor       ? this.hass.states[cfg.energy_today_sensor]       : undefined;
    const energyYest   = cfg.energy_yesterday_sensor   ? this.hass.states[cfg.energy_yesterday_sensor]   : undefined;
    const isCleaning   = coilSensor?.state === 'on';

    /* 2.0 Hybrid Architecture Companion Entities with Auto-Discovery */
    const baseId = cfg.entity.replace(/^climate\./, '');
    const findCompanionEntity = (configuredId: string | undefined, domain: string, patterns: string[]): any => {
      if (configuredId && this.hass.states[configuredId]) return this.hass.states[configuredId];
      for (const pat of patterns) {
        const fullId = `${domain}.${pat}`;
        if (this.hass.states[fullId]) return this.hass.states[fullId];
      }
      const keys = Object.keys(this.hass.states);
      for (const pat of patterns) {
        const match = keys.find(k => k.startsWith(`${domain}.${baseId}_`) && k.includes(pat));
        if (match) return this.hass.states[match];
      }
      return undefined;
    };

    const hybridSwitch = findCompanionEntity(cfg.hybrid_submode_switch, 'switch', [
      `${baseId}_hybrid_automatic_control`,
      `${baseId}_hybrid_submode`,
      `${baseId}_hybrid_control`,
      'hybrid'
    ]);

    const activeBackendSwitch = findCompanionEntity(cfg.active_backend_switch, 'switch', [
      `${baseId}_primary_transport_backend_cloud`,
      `${baseId}_primary_transport_backend`,
      `${baseId}_active_backend`,
      'backend',
      'transport'
    ]);

    const irBlaster = findCompanionEntity(cfg.ir_blaster_sensor, 'binary_sensor', [
      `${baseId}_ir_blaster_available`,
      `${baseId}_ir_transmitter_available`,
      `${baseId}_ir_blaster_transmitter_availability`,
      'ir_blaster'
    ]);

    const cloudMqtt = findCompanionEntity(cfg.cloud_mqtt_sensor, 'binary_sensor', [
      `${baseId}_cloud_mqtt_connected`,
      `${baseId}_cloud_mqtt`,
      'cloud_mqtt'
    ]);

    const controlSource = findCompanionEntity(cfg.control_source_sensor, 'sensor', [
      `${baseId}_last_controlled_via`,
      `${baseId}_control_source`,
      'last_controlled_via'
    ]);

    /* Convertible step-slider data */
    let cvOptions: string[] = [];
    let cvPrefix = 'cv_';

    if (a.preset_modes && a.preset_modes.some((p: string) => /^cv[\s_]/.test(p))) {
      cvOptions = a.preset_modes.filter((p: string) => /^cv[\s_]/.test(p));
      cvPrefix = cvOptions[0].substring(0, 3);
      if (!cvOptions.includes(`${cvPrefix}0`)) cvOptions.push(`${cvPrefix}0`);
    }
    let curCvOpt = a.preset_mode && /^cv[\s_]/.test(a.preset_mode) ? a.preset_mode : `${cvPrefix}0`;

    // Sorted ascending: [40, 50, 60, ...] (without 0 = Normal)
    const cvNonZero  = cvOptions.filter(o => parseCv(o) > 0).sort((a, b) => parseCv(a) - parseCv(b));
    // All steps: Normal first, then ascending percentage steps
    const allCvSteps = [`${cvPrefix}0`, ...cvNonZero];
    const curCvIdx   = allCvSteps.indexOf(curCvOpt);   // 0 = Normal
    const cvGenLabel = convertiLabel(cvOptions);
    const fillPct    = cvNonZero.length > 0
      ? (curCvIdx / (allCvSteps.length - 1)) * 100
      : 0;

    /* Custom accent and main colors applied as CSS vars via inline style */
    let accentStyle = '';
    if (this._config.accent_color) {
      if (Array.isArray(this._config.accent_color)) {
        accentStyle = `rgb(${this._config.accent_color.join(',')})`;
      } else if (typeof this._config.accent_color === 'string') {
        const c = this._config.accent_color.toLowerCase();
        if (c === 'primary') accentStyle = 'var(--primary-color)';
        else if (c === 'accent') accentStyle = 'var(--accent-color)';
        else if (/^[a-z-]+$/.test(c)) accentStyle = `var(--${c}-color, ${c})`;
        else accentStyle = c;
      }
    }

    let mainStyle = '';
    if (this._config.main_color) {
      if (Array.isArray(this._config.main_color)) {
        mainStyle = `rgb(${this._config.main_color.join(',')})`;
      } else if (typeof this._config.main_color === 'string') {
        const c = this._config.main_color.toLowerCase();
        if (c === 'primary') mainStyle = 'var(--primary-color)';
        else if (c === 'accent') mainStyle = 'var(--accent-color)';
        else if (/^[a-z-]+$/.test(c)) mainStyle = `var(--${c}-color, ${c})`;
        else mainStyle = c;
      }
    }
    
    const cardStyle = `${accentStyle ? `--miraie-accent: ${accentStyle}; ` : ''}${mainStyle ? `--m-bg: ${mainStyle}; ` : ''}`;

    if (cfg.layout === 'compact' && !this._expanded) {
      return this._renderCompact(stateObj, friendlyName, isOn, targetTemp, currentTemp, humidVal, hvacMode, minTemp, maxTemp, cardStyle);
    }

    if (cfg.full_layout === 'google_home') {
      return this._renderGoogleHomeFull(stateObj, friendlyName, isOn, targetTemp, currentTemp, humidVal, hvacMode, minTemp, maxTemp, cardStyle);
    }

    // Build an informative subtitle for the Classic layout
    let activeStrs: string[] = [];
    if (isOn) {
      activeStrs.push(this._modeLabel(hvacMode));
      if (presetMode && presetMode !== 'none') {
        if (/^cv[\s_]/.test(presetMode)) {
          const pct = parseCv(presetMode);
          activeStrs.push(pct === 0 ? 'Normal Limit' : pct + '% Limit');
        } else {
          activeStrs.push(this._presetLabel(presetMode));
        }
      }
      activeStrs.push(`Fan: ${fanMode ?? 'Auto'}`);
    }

    return html`
      <ha-card style="${cardStyle}">

        <!-- ── Header ── -->
        <div class="header">
          <div class="header-left">
            <div class="title-row">
              <ha-icon class="header-icon" icon="mdi:air-conditioner"></ha-icon>
              <span class="title">${friendlyName}</span>
            </div>
            <div class="subtitle">
              ${isOnline ? (isOn ? activeStrs.join(' • ') : 'Off') : 'Offline'}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${cfg.layout === 'compact' ? html`
              <button class="collapse-btn" title="Collapse card" @click=${() => { this._haptic('light'); this._expanded = false; }}>
                <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
            ` : ''}
            <button
              class="power-btn ${isOn ? 'on' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}"
              title="${isCleaning ? 'Power cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Power')}"
              @click=${() => {
                if (isCleaning) {
                  this._showToast('Power cannot be toggled while coil cleaning is active');
                } else if (!isOnline) {
                  this._showToast('Device is offline');
                } else {
                  this._togglePower(stateObj);
                }
              }}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>
        </div>

        <!-- ── Temperature ── -->
        <div class="temp-block">
          <button
            class="temp-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) <= Number(effectiveMin)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) <= Number(effectiveMin) ? `Minimum temperature reached (${effectiveMin}°)` : 'Decrease Temperature')))}"
            @click=${() => {
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) <= Number(effectiveMin)) {
                this._showToast(`Minimum temperature reached (${effectiveMin}°)`);
              } else {
                this._adjustTemp(-1, targetTemp, effectiveMin);
              }
            }}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>

          <div class="temp-center">
            <div class="temp-value">
              ${isOn ? (hvacMode === 'fan_only' ? 'FA' : (targetTemp != null ? `${targetTemp}°C` : '--')) : '--'}
            </div>
            <div class="temp-meta">
              <span class="temp-meta-item">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                ${currentTemp != null ? `${currentTemp}°C` : '--'}
              </span>
              ${humidState ? html`
                <span class="temp-meta-item">
                  <ha-icon icon="mdi:water-percent"></ha-icon>
                  ${humidVal}%
                </span>
              ` : ''}
            </div>
          </div>

          <button
            class="temp-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) >= Number(effectiveMax)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) >= Number(effectiveMax) ? `Maximum temperature reached (${effectiveMax}°)` : 'Increase Temperature')))}"
            @click=${() => {
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) >= Number(effectiveMax)) {
                this._showToast(`Maximum temperature reached (${effectiveMax}°)`);
              } else {
                this._adjustTemp(1, targetTemp, effectiveMax);
              }
            }}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>

        <!-- ── Filter Alert (always visible if entity configured + active) ── -->
        ${filterAlert?.state === 'on' ? html`
          <div class="alert-banner">
            <div class="alert-left">
              <ha-icon class="alert-icon" icon="mdi:air-filter"></ha-icon>
              <span class="alert-text">Dirty Filter Alert!</span>
            </div>
            <span class="alert-hint">Clean your filter</span>
          </div>
        ` : ''}

        <!-- ── Connection / Transport Controls ── -->
        ${activeBackendSwitch || hybridSwitch ? html`
          <div class="section">
            <div class="section-title">Connection</div>
            <div class="connection-row">
              <div class="segmented-bar connection-switches">
                ${activeBackendSwitch ? html`
                  ${(() => {
                    const isCloud = activeBackendSwitch.state === 'cloud' || activeBackendSwitch.state === 'on';
                    const isAuto = hybridSwitch && (hybridSwitch.state === 'auto' || hybridSwitch.state === 'on');
                    return html`
                      <button
                        class="segmented-item ${!isAuto ? 'active' : ''} ${isAuto || isCleaning ? 'disabled' : ''}"
                        title="${isAuto ? 'Backend transport is managed automatically in Auto Failover mode' : (isCleaning ? 'Backend cannot be switched while coil cleaning is active' : 'Click to toggle primary transport backend')}"
                        @click=${() => {
                          if (isAuto) {
                            this._showToast('Backend transport is managed automatically in Auto Failover mode');
                          } else if (isCleaning) {
                            this._showToast('Backend cannot be switched while coil cleaning is active');
                          } else {
                            this._toggleSwitch(activeBackendSwitch.entity_id, activeBackendSwitch.state);
                          }
                        }}
                      >
                        <ha-icon icon="${isCloud ? 'mdi:cloud-sync' : 'mdi:remote'}"></ha-icon>
                        ${isCloud ? 'Backend: Cloud' : 'Backend: IR'}
                      </button>
                    `;
                  })()}
                ` : ''}

                ${hybridSwitch ? html`
                  <button
                    class="segmented-item ${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'active' : ''} ${isCleaning ? 'disabled' : ''}"
                    title="${isCleaning ? 'Hybrid mode cannot be toggled while coil cleaning is active' : 'Click to toggle between Auto Failover and Manual backend'}"
                    @click=${() => {
                      if (isCleaning) {
                        this._showToast('Hybrid mode cannot be toggled while coil cleaning is active');
                      } else {
                        this._toggleSwitch(hybridSwitch.entity_id, hybridSwitch.state);
                      }
                    }}
                  >
                    <ha-icon icon="${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'mdi:refresh-auto' : 'mdi:hand-back-right'}"></ha-icon>
                    ${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'Auto Failover' : 'Manual'}
                  </button>
                ` : ''}
              </div>


            </div>
          </div>
        ` : ''}

        <!-- ── HVAC Modes ── -->
        <div class="section">
          <div class="section-title">Modes</div>
          <div class="segmented-bar">
            ${(a.hvac_modes || []).filter((m: string) => m !== 'off').map((m: string) => html`
              <button
                class="segmented-item ${hvacMode === m && isOn ? 'active' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}"
                title="${isCleaning ? 'HVAC mode cannot be changed while coil cleaning is active' : (!isOnline ? 'Device is offline' : this._modeLabel(m))}"
                @click=${() => {
                  if (isCleaning) {
                    this._showToast('HVAC mode cannot be changed while coil cleaning is active');
                  } else if (!isOnline) {
                    this._showToast('Device is offline');
                  } else {
                    this._setHvacMode(m);
                  }
                }}
              >
                <ha-icon icon="${this._modeIcon(m)}"></ha-icon>
                ${this._modeLabel(m)}
              </button>
            `)}
          </div>
        </div>

        <!-- ── Fan & Swing ── -->
        <div class="section">
          <div class="section-title">Fan & Swing</div>
          <div class="setting-tiles">
            <div
              class="setting-tile ${this._openPanel === 'fan' ? 'active' : ''} ${!isOn || hvacMode === 'dry' || isCleaning ? 'disabled' : ''}"
              title="${isCleaning ? 'Fan speed cannot be changed while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust fan speed' : (hvacMode === 'dry' ? 'Fan speed is automatically managed in Dry mode' : 'Adjust fan speed'))}"
              @click=${() => {
                if (isCleaning) {
                  this._showToast('Fan speed cannot be changed while coil cleaning is active');
                } else if (!isOn) {
                  this._showToast('Turn on the AC to adjust fan speed');
                } else if (hvacMode === 'dry') {
                  this._showToast('Fan speed is automatically managed in Dry mode');
                } else {
                  this._togglePanel('fan');
                }
              }}
            >
              <div class="setting-tile-label">
                <ha-icon icon="mdi:fan"></ha-icon>
                <span>Fan</span>
              </div>
              <div class="setting-tile-value-row">
                <span class="setting-tile-value">${fanMode ? (fanMode.charAt(0).toUpperCase() + fanMode.slice(1)) : 'Auto'}</span>
                <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>

            ${swingV != null ? html`
              <div
                class="setting-tile ${this._openPanel === 'swing_v' ? 'active' : ''} ${!isOn || isCleaning ? 'disabled' : ''}"
                title="${isCleaning ? 'Swing vanes cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust swing vanes' : 'Adjust vertical swing')}"
                @click=${() => {
                  if (isCleaning) {
                    this._showToast('Swing vanes cannot be adjusted while coil cleaning is active');
                  } else if (!isOn) {
                    this._showToast('Turn on the AC to adjust swing vanes');
                  } else {
                    this._togglePanel('swing_v');
                  }
                }}
              >
                <div class="setting-tile-label">
                  <ha-icon icon="mdi:arrow-up-down"></ha-icon>
                  <span>V-Swing</span>
                </div>
                <div class="setting-tile-value-row">
                  <span class="setting-tile-value">${swingV === 'Auto Swing' ? 'Auto' : swingV}</span>
                  <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
                </div>
              </div>
            ` : ''}

            ${swingH != null ? html`
              <div
                class="setting-tile ${this._openPanel === 'swing_h' ? 'active' : ''} ${!isOn || isCleaning ? 'disabled' : ''}"
                title="${isCleaning ? 'Horizontal swing cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust horizontal swing' : 'Adjust horizontal swing')}"
                @click=${() => {
                  if (isCleaning) {
                    this._showToast('Horizontal swing cannot be adjusted while coil cleaning is active');
                  } else if (!isOn) {
                    this._showToast('Turn on the AC to adjust horizontal swing');
                  } else {
                    this._togglePanel('swing_h');
                  }
                }}
              >
                <div class="setting-tile-label">
                  <ha-icon icon="mdi:arrow-left-right"></ha-icon>
                  <span>H-Swing</span>
                </div>
                <div class="setting-tile-value-row">
                  <span class="setting-tile-value">${swingH === 'Auto Swing' ? 'Auto' : swingH}</span>
                  <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
                </div>
              </div>
            ` : ''}
          </div>

          ${this._openPanel === 'fan' ? html`
            <div class="picker-panel">
              ${(a.fan_modes || []).map((m: string) => html`
                <button class="picker-opt ${fanMode === m ? 'sel' : ''}"
                        @click=${() => { this._setFanMode(stateObj, m); this._openPanel = null; }}>
                  ${m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              `)}
            </div>
          ` : ''}

          ${this._openPanel === 'swing_v' ? html`
            <div class="picker-panel">
              ${(a.swing_modes || []).map((m: string) => html`
                <button class="picker-opt ${swingV === m ? 'sel' : ''}"
                        @click=${() => { this._setSwing(stateObj, m); this._openPanel = null; }}>
                  ${m}
                </button>
              `)}
            </div>
          ` : ''}

          ${this._openPanel === 'swing_h' ? html`
            <div class="picker-panel">
              ${(a.swing_horizontal_modes || []).map((m: string) => html`
                <button class="picker-opt ${swingH === m ? 'sel' : ''}"
                        @click=${() => { this._setHSwing(stateObj, m); this._openPanel = null; }}>
                  ${m}
                </button>
              `)}
            </div>
          ` : ''}
        </div>

        <!-- ── Comfort Presets ── -->
        <div class="section">
          <div class="section-title">Comfort Presets</div>
          <div class="segmented-bar">
            ${['none', 'eco', 'boost'].map(p => {
              const isBlocked = !isOn || (['dry', 'auto', 'fan_only'].includes(hvacMode) && p !== 'none') || isCleaning || (curCvIdx > 0 && p !== 'none');
              return html`
                <button
                  class="segmented-item ${presetMode === p ? 'active' : ''} ${isBlocked ? 'disabled' : ''}"
                  title="${isCleaning ? 'Presets cannot be changed while coil cleaning is active' : (!isOn ? 'Turn on the AC to select presets' : (['dry', 'auto', 'fan_only'].includes(hvacMode) && p !== 'none' ? `Presets are not available in ${this._modeLabel(hvacMode)} mode` : (curCvIdx > 0 && p !== 'none' ? 'Presets cannot be changed while capacity limit is active' : (p === 'none' ? 'Normal' : p.charAt(0).toUpperCase() + p.slice(1)))))}"
                  @click=${() => {
                    if (isCleaning) {
                      this._showToast('Presets cannot be changed while coil cleaning is active');
                    } else if (!isOn) {
                      this._showToast('Turn on the AC to select presets');
                    } else if (['dry', 'auto', 'fan_only'].includes(hvacMode) && p !== 'none') {
                      this._showToast(`Presets are not available in ${this._modeLabel(hvacMode)} mode`);
                    } else if (curCvIdx > 0 && p !== 'none') {
                      this._showToast('Presets cannot be changed while capacity limit is active');
                    } else {
                      this._setPreset(p);
                    }
                  }}
                >
                  <ha-icon icon="${this._presetIcon(p)}"></ha-icon>
                  ${this._presetLabel(p)}
                </button>
              `;
            })}
          </div>
        </div>

        <!-- ── Convertible Mode — stepped notch slider ── -->
        ${cvNonZero.length > 0 ? html`
          <div class="section" style="${['dry', 'auto', 'fan_only'].includes(hvacMode) || isCleaning ? 'opacity: 0.5;' : ''}">
            <div class="section-title">${cvGenLabel}</div>
            <div class="step-slider-wrap">
              <div class="step-slider-header">
                <span class="step-slider-title">Capacity Limit</span>
                <span class="step-slider-val">
                  ${curCvIdx === 0 ? 'Normal' : `${parseCv(curCvOpt)}%`}
                </span>
              </div>

              <!-- Track + notch dots -->
              <div class="step-track-outer">
                <div class="step-track-bg">
                  <div class="step-track-fill" style="width: ${fillPct}%"></div>
                </div>
                <div class="step-notches">
                  ${allCvSteps.map((opt, i) => {
                    const isPresetActive = ['eco', 'boost', 'powerful'].includes(presetMode);
                    const isCvBlocked = !isOn || ['dry', 'auto', 'fan_only'].includes(hvacMode) || isCleaning || (isPresetActive && i > 0);
                    return html`
                      <div class="notch-wrapper">
                        <button
                          class="step-notch
                            ${i < curCvIdx  ? 'filled'  : ''}
                            ${i === curCvIdx ? 'current' : ''}
                            ${isCvBlocked ? 'disabled' : ''}"
                          title="${isCleaning ? 'Capacity limit cannot be changed while coil cleaning is active' : (!isOn ? 'Turn on the AC to set capacity limits' : (['dry', 'auto', 'fan_only'].includes(hvacMode) ? `Capacity limit is not available in ${this._modeLabel(hvacMode)} mode` : (isPresetActive && i > 0 ? `Capacity limit cannot be changed while ${this._presetLabel(presetMode)} mode is active` : (i === 0 ? 'Normal' : `${parseCv(opt)}%`))))}"
                          @click=${() => {
                            if (isCleaning) {
                              this._showToast('Capacity limit cannot be changed while coil cleaning is active');
                            } else if (!isOn) {
                              this._showToast('Turn on the AC to set capacity limits');
                            } else if (['dry', 'auto', 'fan_only'].includes(hvacMode)) {
                              this._showToast(`Capacity limit is not available in ${this._modeLabel(hvacMode)} mode`);
                            } else if (isPresetActive && i > 0) {
                              this._showToast(`Capacity limit cannot be changed while ${this._presetLabel(presetMode)} mode is active`);
                            } else {
                              this._setPreset(opt);
                            }
                          }}
                        ></button>
                        <span class="notch-label ${i === curCvIdx ? 'current' : ''}">${i === 0 ? 'N' : parseCv(opt)}</span>
                      </div>
                    `;
                  })}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- ── Controls (Nanoe, Display, Coil Clean) ── -->
        ${nanoe || display || coilBtn ? html`
          <div class="section">
            <div class="section-title">Controls</div>
            <div class="toggles">
              ${nanoe ? html`
                <div class="toggle-card ${!isOnline || isCleaning ? 'disabled' : ''}"
                     title="${isCleaning ? 'Nanoe cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Nanoe™ air purification')}"
                     @click=${() => {
                       if (isCleaning) {
                         this._showToast('Nanoe cannot be toggled while coil cleaning is active');
                       } else if (!isOnline) {
                         this._showToast('Device is offline');
                       } else {
                         this._toggleSwitch(cfg.nanoe_switch!, nanoe.state);
                       }
                     }}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${nanoe.state === 'on' ? 'active' : ''}">
                      <ha-icon icon="mdi:air-purifier"></ha-icon>
                    </div>
                    <span class="toggle-label">nanoe™</span>
                  </div>
                  <ha-switch .checked=${nanoe.state === 'on'} ?disabled=${!isOnline}></ha-switch>
                </div>
              ` : ''}
              ${display ? html`
                <div class="toggle-card ${!isOnline || isCleaning ? 'disabled' : ''}"
                     title="${isCleaning ? 'Display LED cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle indoor unit LED display')}"
                     @click=${() => {
                       if (isCleaning) {
                         this._showToast('Display LED cannot be toggled while coil cleaning is active');
                       } else if (!isOnline) {
                         this._showToast('Device is offline');
                       } else {
                         this._toggleSwitch(cfg.display_switch!, display.state);
                       }
                     }}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${display.state === 'on' ? 'active' : ''}">
                      <ha-icon icon="mdi:eye"></ha-icon>
                    </div>
                    <span class="toggle-label">AC LED</span>
                  </div>
                  <ha-switch .checked=${display.state === 'on'} ?disabled=${!isOnline}></ha-switch>
                </div>
              ` : ''}
              ${coilBtn ? html`
                <div class="toggle-card ${isOn || isCleaning ? 'disabled' : ''}"
                     title="${isCleaning ? 'Coil cleaning cycle is currently running' : (isOn ? 'Coil clean cannot be started while AC is running' : 'Start coil self-cleaning cycle')}"
                     @click=${() => {
                       if (isCleaning) {
                         this._showToast('Coil cleaning cycle is currently running');
                       } else if (isOn) {
                         this._showToast('Coil clean cannot be started while AC is running');
                       } else {
                         this._pressButton(cfg.coil_clean_button!);
                       }
                     }}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${coilSensor?.state === 'on' ? 'active' : ''}">
                      <ha-icon icon="mdi:spray-bottle"></ha-icon>
                    </div>
                    <span class="toggle-label">
                      ${coilSensor?.state === 'on' ? 'Cleaning…' : 'Coil Clean'}
                    </span>
                  </div>
                  <ha-icon class="toggle-action" icon="mdi:play-circle-outline"></ha-icon>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- ── Energy Cards ── -->
        ${energyToday || energyYest ? html`
          <div class="section">
            <div class="section-title">Energy Consumption</div>
            <div class="energy-row">
              ${energyToday ? html`
                <div class="energy-card" @click=${() => this._showMoreInfo(cfg.energy_today_sensor!)}>
                  <div class="energy-label">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    ${energyToday.attributes.friendly_name ?? 'Today'}
                  </div>
                  <div class="energy-value-row">
                    <span class="energy-value">${fmt2(energyToday.state)}</span>
                    <span class="energy-unit">${energyToday.attributes.unit_of_measurement ?? 'kWh'}</span>
                  </div>
                </div>
              ` : ''}
              ${energyYest ? html`
                <div class="energy-card" @click=${() => this._showMoreInfo(cfg.energy_yesterday_sensor!)}>
                  <div class="energy-label">
                    <ha-icon icon="mdi:flash-outline"></ha-icon>
                    ${energyYest.attributes.friendly_name ?? 'Yesterday'}
                  </div>
                  <div class="energy-value-row">
                    <span class="energy-value">${fmt2(energyYest.state)}</span>
                    <span class="energy-unit">${energyYest.attributes.unit_of_measurement ?? 'kWh'}</span>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Footer Telemetry Status Row -->
        <div class="footer-telemetry-row">
          ${irBlaster ? html`
            <div class="connection-status-pill">
              <span class="status-dot ${irBlaster.state === 'on' ? 'online' : ''}"></span>
              <span>IR Blaster</span>
            </div>
          ` : ''}
          ${cloudMqtt ? html`
            <div class="connection-status-pill">
              <span class="status-dot ${cloudMqtt.state === 'on' ? 'online' : ''}"></span>
              <span>Cloud MQTT</span>
            </div>
          ` : ''}
          ${controlSource && controlSource.state && controlSource.state !== 'unknown' && controlSource.state !== 'unavailable' ? html`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(controlSource.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(controlSource.state)}</span>
            </div>
          ` : ''}
          ${rssi ? html`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${rssi.state} ${rssi.attributes.unit_of_measurement ?? 'dBm'}</span>
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  /* ─────────────────────────────────────────────
     Panel toggle
     ───────────────────────────────────────────── */

  private _togglePanel(name: string): void {
    this._haptic('selection');
    this._openPanel = this._openPanel === name ? null : name;
  }

  /* ─────────────────────────────────────────────
     Service calls & Actions
     ───────────────────────────────────────────── */
  private _haptic(type: 'success' | 'warning' | 'failure' | 'info' | 'selection' | 'light' | 'medium' | 'heavy' = 'light'): void {
    this.dispatchEvent(new CustomEvent('haptic', { detail: type, bubbles: true, composed: true }));
  }

  private _showToast(message: string): void {
    this._haptic('warning');
    this.dispatchEvent(
      new CustomEvent('hass-notification', {
        bubbles: true,
        composed: true,
        detail: { message },
      })
    );
  }

  private _showMoreInfo(entityId: string): void {
    this._haptic('selection');
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  private _togglePower(s: any): void {
    this._haptic('medium');
    if (s.state !== 'off') {
      this.hass.callService('climate', 'set_hvac_mode', { entity_id: s.entity_id, hvac_mode: 'off' });
    } else {
      this.hass.callService('climate', 'turn_on', { entity_id: s.entity_id });
    }
  }

  private _adjustTemp(delta: number, current?: number, limit?: number): void {
    this._haptic('light');
    if (current == null) return;
    const next = Number(current) + delta;
    if (limit != null && ((delta < 0 && next < Number(limit)) || (delta > 0 && next > Number(limit)))) return;
    const stateObj = this.hass?.states[this._config.entity];
    if (stateObj?.state === 'auto') {
      this._showToast(`Temperature ${next}°C queued`);
    }
    this.hass.callService('climate', 'set_temperature', { entity_id: this._config.entity, temperature: next });
  }

  private _setHvacMode(mode: string): void {
    this._haptic('light');
    this.hass.callService('climate', 'set_hvac_mode', { entity_id: this._config.entity, hvac_mode: mode });
  }

  private _setFanMode(s: any, mode: string): void {
    this._haptic('selection');
    this.hass.callService('climate', 'set_fan_mode', { entity_id: s.entity_id, fan_mode: mode });
  }

  private _setSwing(s: any, mode: string): void {
    this._haptic('selection');
    this.hass.callService('climate', 'set_swing_mode', { entity_id: s.entity_id, swing_mode: mode });
  }

  private _setHSwing(s: any, mode: string): void {
    this._haptic('selection');
    this.hass.callService('climate', 'set_swing_horizontal_mode', { entity_id: s.entity_id, swing_horizontal_mode: mode });
  }

  private _setPreset(preset: string): void {
    this._haptic('light');
    const targetPreset = (preset === 'cv_0' || preset === 'cv 0') ? 'none' : preset;
    this.hass.callService('climate', 'set_preset_mode', { entity_id: this._config.entity, preset_mode: targetPreset });
  }



  private _toggleSwitch(entityId: string, currentState: string): void {
    this._haptic('light');
    this.hass.callService('switch', currentState === 'on' ? 'turn_off' : 'turn_on', { entity_id: entityId });
  }

  private _pressButton(entityId: string): void {
    this._haptic('medium');
    this.hass.callService('button', 'press', { entity_id: entityId });
  }

  /* ─────────────────────────────────────────────
     Label / Icon helpers
     ───────────────────────────────────────────── */
  private _modeLabel(m: string): string {
    const map: Record<string, string> = {
      cool: 'Cool', dry: 'Dry', fan_only: 'Fan', auto: 'Auto', heat: 'Heat', off: 'Off',
    };
    return map[m] ?? m.charAt(0).toUpperCase() + m.slice(1);
  }

  private _modeIcon(m: string): string {
    const map: Record<string, string> = {
      cool: 'mdi:snowflake', dry: 'mdi:water-percent',
      fan_only: 'mdi:fan', auto: 'mdi:cached', heat: 'mdi:fire',
    };
    return map[m] ?? 'mdi:air-conditioner';
  }

  private _modeColor(m: string): string {
    const map: Record<string, string> = {
      cool:     'rgba(100, 181, 246, 0.18)',
      dry:      'rgba(129, 199, 132, 0.18)',
      fan_only: 'rgba(179, 157, 219, 0.18)',
      auto:     'rgba(255, 183,  77, 0.18)',
      heat:     'rgba(255, 138, 101, 0.18)',
    };
    return map[m] ?? 'rgba(128, 128, 128, 0.12)';
  }

  private _presetLabel(p: string): string {
    if (p === 'boost') return 'Powerful';
    if (p === 'none') return 'None';
    if (p === 'eco') return 'Eco';
    return p.charAt(0).toUpperCase() + p.slice(1);
  }

  private _presetIcon(p: string): string {
    const map: Record<string, string> = {
      eco: 'mdi:leaf', boost: 'mdi:rocket', powerful: 'mdi:rocket', none: 'mdi:close-circle-outline',
    };
    return map[p] ?? 'mdi:play-circle-outline';
  }

    private _sourceIcon(source: string): string {
    const s = (source || '').toLowerCase();
    if (s.includes('remote')) return 'mdi:remote';
    if (s.includes('switch')) return 'mdi:toggle-switch';
    if (s.includes('blaster') || s.includes('failover') || s === 'ir') return 'mdi:remote-desktop';
    if (s.includes('cloud') || s === 'mqtt') return 'mdi:cloud-check';
    return 'mdi:remote-desktop';
  }

private _sourceLabel(s: string): string {
    if (!s) return 'Unknown';
    const trimmed = s.trim();
    const lower = trimmed.toLowerCase();
    if (lower === 'ir') return 'IR';
    if (lower === 'cloud') return 'Cloud';
    if (lower === 'ir blaster' || lower === 'ir_blaster') return 'IR Blaster';
    if (lower === 'ir remote' || lower === 'ir_remote') return 'IR Remote';
    if (lower === 'ir failover' || lower === 'ir_failover') return 'IR Failover';
    if (lower === 'ir failover (offline)' || lower === 'ir_failover (offline)') return 'IR Failover (Offline)';

    return trimmed
      .split(/[\s_]+/)
      .map(w => {
        const lw = w.toLowerCase();
        if (lw === 'ir') return 'IR';
        if (lw === 'mqtt') return 'MQTT';
        if (lw === 'ha') return 'HA';
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join(' ');
  }

  private _renderGoogleHomeFull(
    stateObj: any, name: string, isOn: boolean,
    targetTemp: number, currentTemp: number, humidVal: any,
    hvacMode: string, minTemp: number, maxTemp: number,
    cardStyle: string
  ) {
    const cfg = this._config;
    const a = stateObj.attributes;
    const modes = a.hvac_modes || [];
    const fanMode      = a.fan_mode;
    const fanModes     = a.fan_modes || [];
    const swingV       = a.swing_mode;
    const swingVModes  = a.swing_modes || [];
    const swingH       = a.swing_horizontal_mode;
    const swingHModes  = a.swing_horizontal_modes || [];
    
    const isOnline = stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    const presetMode   = a.preset_mode;
    const effectiveMin = presetMode === 'eco' ? 16 : minTemp;
    const effectiveMax = presetMode === 'eco' ? 30 : maxTemp;
    const displayValue = isOn ? (hvacMode === 'fan_only' ? 'FA' : (targetTemp != null ? `${targetTemp}°` : '--')) : (isOnline ? 'Off' : 'Offline');
    const subValue = currentTemp != null ? `Indoor ${currentTemp}°` : '';

    // Split presets into standard presets and convertible options
    let stdPresets: string[] = ['none'];
    let cvOptions: string[] = [];
    if (a.preset_modes) {
      stdPresets = Array.from(new Set(['none', ...a.preset_modes.filter((p: string) => !/^cv[\s_]/.test(p))]));
      cvOptions = a.preset_modes.filter((p: string) => /^cv[\s_]/.test(p));
      if (cvOptions.length > 0) {
        const cvPrefix = cvOptions[0].substring(0, 3);
        if (!cvOptions.includes(`${cvPrefix}0`)) cvOptions.push(`${cvPrefix}0`);
      }
    }
    const cvSorted = cvOptions.sort((x, y) => parseCv(y) - parseCv(x));

    const nanoe        = cfg.nanoe_switch              ? this.hass.states[cfg.nanoe_switch]              : undefined;
    const display      = cfg.display_switch            ? this.hass.states[cfg.display_switch]            : undefined;
    const coilBtn      = cfg.coil_clean_button         ? this.hass.states[cfg.coil_clean_button]         : undefined;
    const coilSensor   = cfg.coil_cleaning_sensor      ? this.hass.states[cfg.coil_cleaning_sensor]      : undefined;
    const energyToday  = cfg.energy_today_sensor       ? this.hass.states[cfg.energy_today_sensor]       : undefined;
    const energyYest   = cfg.energy_yesterday_sensor   ? this.hass.states[cfg.energy_yesterday_sensor]   : undefined;
    const rssi         = cfg.rssi_sensor               ? this.hass.states[cfg.rssi_sensor]               : undefined;
    const isCleaning   = coilSensor?.state === 'on';

    /* 2.0 Hybrid Architecture Companion Entities with Auto-Discovery */
    const baseId = cfg.entity.replace(/^climate\./, '');
    const findCompanionEntity = (configuredId: string | undefined, domain: string, patterns: string[]): any => {
      if (configuredId && this.hass.states[configuredId]) return this.hass.states[configuredId];
      for (const pat of patterns) {
        const fullId = `${domain}.${pat}`;
        if (this.hass.states[fullId]) return this.hass.states[fullId];
      }
      const keys = Object.keys(this.hass.states);
      for (const pat of patterns) {
        const match = keys.find(k => k.startsWith(`${domain}.${baseId}_`) && k.includes(pat));
        if (match) return this.hass.states[match];
      }
      return undefined;
    };

    const hybridSwitch = findCompanionEntity(cfg.hybrid_submode_switch, 'switch', [
      `${baseId}_hybrid_automatic_control`,
      `${baseId}_hybrid_submode`,
      `${baseId}_hybrid_control`,
      'hybrid'
    ]);

    const activeBackendSwitch = findCompanionEntity(cfg.active_backend_switch, 'switch', [
      `${baseId}_primary_transport_backend_cloud`,
      `${baseId}_primary_transport_backend`,
      `${baseId}_active_backend`,
      'backend',
      'transport'
    ]);

    const controlSource = findCompanionEntity(cfg.control_source_sensor, 'sensor', [
      `${baseId}_last_controlled_via`,
      `${baseId}_control_source`,
      'last_controlled_via'
    ]);

    const irBlaster = findCompanionEntity(cfg.ir_blaster_sensor, 'binary_sensor', [
      `${baseId}_ir_blaster_available`,
      `${baseId}_ir_transmitter_available`,
      `${baseId}_ir_blaster_transmitter_availability`,
      'ir_blaster'
    ]);

    const cloudMqtt = findCompanionEntity(cfg.cloud_mqtt_sensor, 'binary_sensor', [
      `${baseId}_cloud_mqtt_connected`,
      `${baseId}_cloud_mqtt`,
      'cloud_mqtt'
    ]);

    let activeStrs: string[] = [];
    if (isOn) {
      activeStrs.push(this._modeLabel(hvacMode));
      if (presetMode && presetMode !== 'none' && !/^cv[\s_]/.test(presetMode)) {
        activeStrs.push(this._presetLabel(presetMode));
      }
    }
    const modeString = activeStrs.join(' • ');

    return html`
      <ha-card style="${cardStyle}" class="gh-full-card">
        <div class="gh-header">
          <div class="gh-header-left">
            <ha-icon class="gh-icon" icon="mdi:air-conditioner"></ha-icon>
            <div class="gh-title">${name}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this._config.layout === 'compact' ? html`
              <button class="gh-power-btn" style="background: transparent; color: var(--m-text-2);" @click=${() => { this._haptic('light'); this._expanded = false; }}>
                <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
            ` : ''}
            <button
              class="gh-power-btn ${isOn ? 'on' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}"
              title="${isCleaning ? 'Power cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Power')}"
              @click=${(e: Event) => {
                if (isCleaning) {
                  this._showToast('Power cannot be toggled while coil cleaning is active');
                } else if (!isOnline) {
                  this._showToast('Device is offline');
                } else {
                  this._togglePower(stateObj);
                }
              }}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>
        </div>

        <div class="gh-center">
          <div class="gh-value-large">${displayValue}</div>
          <div class="gh-subtitle-large">
            <div style="display: flex; align-items: center; gap: 16px; justify-content: center;">
              ${currentTemp != null ? html`
                <span style="display: flex; align-items: center; gap: 5px;">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 16px;"></ha-icon>${currentTemp}°
                </span>` : ''}
              ${humidVal != null ? html`
                <span style="display: flex; align-items: center; gap: 5px;">
                  <ha-icon icon="mdi:water-percent" style="--mdc-icon-size: 16px;"></ha-icon>${humidVal}%
                </span>` : ''}
            </div>
            ${isOn ? html`
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <span class="gh-mode-pill" style="background: ${this._modeColor(hvacMode)};">
                  <ha-icon icon="${this._modeIcon(hvacMode)}" style="--mdc-icon-size: 14px;"></ha-icon>
                  ${this._modeLabel(hvacMode)}
                </span>
              </div>` : ''}
          </div>
        </div>

        <div class="gh-action-row">
          <button
            class="gh-circular-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) <= Number(effectiveMin)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) <= Number(effectiveMin) ? `Minimum temperature reached (${effectiveMin}°)` : 'Decrease Temperature')))}"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) <= Number(effectiveMin)) {
                this._showToast(`Minimum temperature reached (${effectiveMin}°)`);
              } else {
                const step = Number(a.target_temp_step ?? 1);
                this._adjustTemp(-step, targetTemp, effectiveMin);
              }
            }}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div style="width: 48px;"></div>
          <button
            class="gh-circular-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) >= Number(effectiveMax)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) >= Number(effectiveMax) ? `Maximum temperature reached (${effectiveMax}°)` : 'Increase Temperature')))}"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) >= Number(effectiveMax)) {
                this._showToast(`Maximum temperature reached (${effectiveMax}°)`);
              } else {
                const step = Number(a.target_temp_step ?? 1);
                this._adjustTemp(step, targetTemp, effectiveMax);
              }
            }}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>

        <div class="gh-select-container">
          <!-- Mode Dropdown -->
          <div class="gh-select-wrapper ${this._ghDropdown === 'mode' ? 'active' : ''}">
            <button class="gh-custom-select" @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('HVAC mode cannot be changed while coil cleaning is active');
              } else {
                this._haptic('selection');
                this._ghDropdown = this._ghDropdown === 'mode' ? null : 'mode';
              }
            }}>
              <span>Mode: ${this._modeLabel(hvacMode)}</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._ghDropdown === 'mode' ? html`
              <div class="gh-dropdown-menu">
                ${modes.map((mode: string) => html`
                  <button class="gh-dropdown-item ${hvacMode === mode ? 'active' : ''}" 
                       @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setHvacMode(mode); }}>
                    ${this._modeLabel(mode)}
                  </button>
                `)}
              </div>
            ` : ''}
          </div>

          <!-- Preset Dropdown -->
          <div class="gh-select-wrapper ${this._ghDropdown === 'preset' ? 'active' : ''}" style="${!isOn || ['dry', 'auto', 'fan_only'].includes(hvacMode) || isCleaning ? 'opacity: 0.5;' : ''}">
            <button class="gh-custom-select" @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Presets cannot be changed while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to select presets');
              } else if (['dry', 'auto', 'fan_only'].includes(hvacMode)) {
                this._showToast(`Presets are not available in ${this._modeLabel(hvacMode)} mode`);
              } else {
                this._haptic('selection');
                this._ghDropdown = this._ghDropdown === 'preset' ? null : 'preset';
              }
            }}>
              <span>Preset: ${presetMode && presetMode !== 'none' && !/^cv[\s_]/.test(presetMode) ? this._presetLabel(presetMode) : 'None'}</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._ghDropdown === 'preset' ? html`
              <div class="gh-dropdown-menu">
                ${stdPresets.map((p: string) => {
                  const isActive = (!presetMode || presetMode === 'none' || /^cv[\s_]/.test(presetMode)) ? (p === 'none') : (presetMode === p);
                  return html`
                    <button class="gh-dropdown-item ${isActive ? 'active' : ''}" 
                         @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setPreset(p); }}>
                      ${this._presetLabel(p)}
                    </button>
                  `;
                })}
              </div>
            ` : ''}
          </div>

          <!-- Convertible Dropdown -->
          ${cvSorted.length > 0 ? html`
            <div class="gh-select-wrapper ${this._ghDropdown === 'cv' ? 'active' : ''}" style="${!isOn || ['dry', 'auto', 'fan_only'].includes(hvacMode) || isCleaning ? 'opacity: 0.5;' : ''}">
              <button class="gh-custom-select" @click=${(e: Event) => {
                e.stopPropagation();
                if (isCleaning) {
                  this._showToast('Capacity limit cannot be changed while coil cleaning is active');
                } else if (!isOn) {
                  this._showToast('Turn on the AC to set capacity limits');
                } else if (['dry', 'auto', 'fan_only'].includes(hvacMode)) {
                  this._showToast(`Capacity limit is not available in ${this._modeLabel(hvacMode)} mode`);
                } else {
                  this._haptic('selection');
                  this._ghDropdown = this._ghDropdown === 'cv' ? null : 'cv';
                }
              }}>
                <span>Limit: ${stateObj.attributes.preset_mode && /^cv[\s_]/.test(stateObj.attributes.preset_mode) ? (parseCv(stateObj.attributes.preset_mode) === 0 ? 'Normal' : parseCv(stateObj.attributes.preset_mode) + '%') : 'Normal'}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${this._ghDropdown === 'cv' ? html`
                <div class="gh-dropdown-menu">
                  ${cvSorted.map((cv: string) => {
                    const pct = parseCv(cv);
                    const isActive = stateObj.attributes.preset_mode === cv || (pct === 0 && (!stateObj.attributes.preset_mode || !/^cv[\s_]/.test(stateObj.attributes.preset_mode)));
                    return html`
                      <button class="gh-dropdown-item ${isActive ? 'active' : ''}" 
                           @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setPreset(cv); }}>
                        ${pct === 0 ? 'Normal' : pct + '%'}
                      </button>
                    `;
                  })}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Fan Speed Dropdown -->
          ${fanModes.length > 0 ? html`
            <div class="gh-select-wrapper ${this._ghDropdown === 'fan' ? 'active' : ''}" style="${!isOn || hvacMode === 'dry' || isCleaning ? 'opacity: 0.5;' : ''}">
              <button class="gh-custom-select" @click=${(e: Event) => {
                e.stopPropagation();
                if (isCleaning) {
                  this._showToast('Fan speed cannot be changed while coil cleaning is active');
                } else if (!isOn) {
                  this._showToast('Turn on the AC to adjust fan speed');
                } else if (hvacMode === 'dry') {
                  this._showToast('Fan speed is automatically managed in Dry mode');
                } else {
                  this._haptic('selection');
                  this._ghDropdown = this._ghDropdown === 'fan' ? null : 'fan';
                }
              }}>
                <span>Fan: ${fanMode ? (fanMode.charAt(0).toUpperCase() + fanMode.slice(1)) : 'Auto'}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${this._ghDropdown === 'fan' ? html`
                <div class="gh-dropdown-menu">
                  ${fanModes.map((m: string) => html`
                    <button class="gh-dropdown-item ${fanMode === m ? 'active' : ''}" 
                         @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setFanMode(stateObj, m); }}>
                      ${m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  `)}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Vertical Swing (Vanes V) Dropdown -->
          ${swingVModes.length > 0 || swingV != null ? html`
            <div class="gh-select-wrapper ${this._ghDropdown === 'swing_v' ? 'active' : ''}" style="${!isOn || isCleaning ? 'opacity: 0.5;' : ''}">
              <button class="gh-custom-select" @click=${(e: Event) => {
                e.stopPropagation();
                if (isCleaning) {
                  this._showToast('Swing vanes cannot be adjusted while coil cleaning is active');
                } else if (!isOn) {
                  this._showToast('Turn on the AC to adjust swing vanes');
                } else {
                  this._haptic('selection');
                  this._ghDropdown = this._ghDropdown === 'swing_v' ? null : 'swing_v';
                }
              }}>
                <span>V-Swing: ${swingV ? (swingV.charAt(0).toUpperCase() + swingV.slice(1)) : 'Auto'}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${this._ghDropdown === 'swing_v' ? html`
                <div class="gh-dropdown-menu">
                  ${swingVModes.map((m: string) => html`
                    <button class="gh-dropdown-item ${swingV === m ? 'active' : ''}" 
                         @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setSwing(stateObj, m); }}>
                      ${m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  `)}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Horizontal Swing (Vanes H) Dropdown -->
          ${swingHModes.length > 0 || swingH != null ? html`
            <div class="gh-select-wrapper ${this._ghDropdown === 'swing_h' ? 'active' : ''}" style="${!isOn || isCleaning ? 'opacity: 0.5;' : ''}">
              <button class="gh-custom-select" @click=${(e: Event) => {
                e.stopPropagation();
                if (isCleaning) {
                  this._showToast('Horizontal swing cannot be adjusted while coil cleaning is active');
                } else if (!isOn) {
                  this._showToast('Turn on the AC to adjust horizontal swing');
                } else {
                  this._haptic('selection');
                  this._ghDropdown = this._ghDropdown === 'swing_h' ? null : 'swing_h';
                }
              }}>
                <span>H-Swing: ${swingH ? (swingH.charAt(0).toUpperCase() + swingH.slice(1)) : 'Auto'}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${this._ghDropdown === 'swing_h' ? html`
                <div class="gh-dropdown-menu">
                  ${swingHModes.map((m: string) => html`
                    <button class="gh-dropdown-item ${swingH === m ? 'active' : ''}" 
                         @click=${(e: Event) => { e.stopPropagation(); this._ghDropdown = null; this._setHSwing(stateObj, m); }}>
                      ${m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  `)}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        ${nanoe || display || coilBtn || energyToday || energyYest ? html`
          <div class="gh-extra-chips">
            ${nanoe ? html`<div class="gh-chip ${nanoe.state === 'on' ? 'active' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}" title="${isCleaning ? 'Nanoe cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Nanoe™ air purification')}" @click=${() => isCleaning ? this._showToast('Nanoe cannot be toggled while coil cleaning is active') : (!isOnline ? this._showToast('Device is offline') : this._toggleSwitch(cfg.nanoe_switch!, nanoe.state))}><ha-icon icon="mdi:virus-outline"></ha-icon>Nanoe</div>` : ''}
            ${display ? html`<div class="gh-chip ${display.state === 'on' ? 'active' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}" title="${isCleaning ? 'Display LED cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle indoor unit LED display')}" @click=${() => isCleaning ? this._showToast('Display LED cannot be toggled while coil cleaning is active') : (!isOnline ? this._showToast('Device is offline') : this._toggleSwitch(cfg.display_switch!, display.state))}><ha-icon icon="mdi:lightbulb-outline"></ha-icon>Display</div>` : ''}
            ${coilBtn || coilSensor ? html`
              <div
                class="gh-chip ${coilSensor?.state === 'on' ? 'active' : ''} ${isOn || isCleaning ? 'disabled' : ''}"
                style="${isOn ? 'opacity: 0.4; cursor: not-allowed;' : ''}"
                title="${isCleaning ? 'Coil cleaning cycle is currently running' : (isOn ? 'Coil clean cannot be started while AC is running' : 'Start coil self-cleaning cycle')}"
                @click=${() => {
                  if (isCleaning) {
                    this._showToast('Coil cleaning cycle is currently running');
                  } else if (isOn) {
                    this._showToast('Coil clean cannot be started while AC is running');
                  } else if (coilBtn) {
                    this._pressButton(cfg.coil_clean_button!);
                  }
                }}
              >
                <ha-icon icon="mdi:spray"></ha-icon>
                ${coilSensor?.state === 'on' ? 'Cleaning…' : 'Clean Coil'}
              </div>
            ` : ''}
            ${energyToday && energyYest ? html`
              <div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${fmt2(energyToday.state)} kWh • Yesterday: ${fmt2(energyYest.state)} kWh</div>
            ` : html`
              ${energyToday ? html`<div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${fmt2(energyToday.state)} kWh</div>` : ''}
              ${energyYest ? html`<div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Yesterday: ${fmt2(energyYest.state)} kWh</div>` : ''}
            `}
          </div>
        ` : ''}

        <!-- ── 2.0 Hybrid Transport Controls (Google Home Layout) ── -->
        ${activeBackendSwitch || hybridSwitch ? html`
          <div class="gh-extra-chips" style="margin-top: 10px;">
            ${activeBackendSwitch ? html`
              ${(() => {
                const isCloud = activeBackendSwitch.state === 'cloud' || activeBackendSwitch.state === 'on';
                const isAuto = hybridSwitch && (hybridSwitch.state === 'auto' || hybridSwitch.state === 'on');
                return html`
                  <div
                    class="gh-chip ${isCloud ? 'active' : ''} ${isAuto || isCleaning ? 'disabled' : ''}"
                    style="${isAuto ? 'opacity: 0.4; cursor: not-allowed;' : ''}"
                    title="${isAuto ? 'Backend transport is managed automatically in Auto Failover mode' : (isCleaning ? 'Backend cannot be switched while coil cleaning is active' : 'Click to toggle primary transport backend')}"
                    @click=${() => {
                      if (isAuto) {
                        this._showToast('Backend transport is managed automatically in Auto Failover mode');
                      } else if (isCleaning) {
                        this._showToast('Backend cannot be switched while coil cleaning is active');
                      } else {
                        this._toggleSwitch(activeBackendSwitch.entity_id, activeBackendSwitch.state);
                      }
                    }}
                  >
                    <ha-icon icon="${isCloud ? 'mdi:cloud-sync' : 'mdi:remote'}"></ha-icon>
                    Backend: ${isCloud ? 'Cloud' : 'IR'}
                  </div>
                `;
              })()}
            ` : ''}

            ${hybridSwitch ? html`
              <div
                class="gh-chip ${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'active' : ''} ${isCleaning ? 'disabled' : ''}"
                title="${isCleaning ? 'Hybrid mode cannot be toggled while coil cleaning is active' : 'Click to toggle between Auto Failover and Manual backend'}"
                @click=${() => {
                  if (isCleaning) {
                    this._showToast('Hybrid mode cannot be toggled while coil cleaning is active');
                  } else {
                    this._toggleSwitch(hybridSwitch.entity_id, hybridSwitch.state);
                  }
                }}
              >
                <ha-icon icon="${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'mdi:refresh-auto' : 'mdi:hand-back-right'}"></ha-icon>
                ${hybridSwitch.state === 'auto' || hybridSwitch.state === 'on' ? 'Auto Failover' : 'Manual'}
              </div>
            ` : ''}


          </div>
        ` : ''}
        
        <!-- Footer Telemetry Status Row -->
        <div class="footer-telemetry-row">
          ${irBlaster ? html`
            <div class="connection-status-pill">
              <span class="status-dot ${irBlaster.state === 'on' ? 'online' : ''}"></span>
              <span>IR Blaster</span>
            </div>
          ` : ''}
          ${cloudMqtt ? html`
            <div class="connection-status-pill">
              <span class="status-dot ${cloudMqtt.state === 'on' ? 'online' : ''}"></span>
              <span>Cloud MQTT</span>
            </div>
          ` : ''}
          ${controlSource && controlSource.state && controlSource.state !== 'unknown' && controlSource.state !== 'unavailable' ? html`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(controlSource.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(controlSource.state)}</span>
            </div>
          ` : ''}
          ${rssi ? html`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${rssi.state} ${rssi.attributes.unit_of_measurement ?? 'dBm'}</span>
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  /* ─────────────────────────────────────────────
     Compact View
     ───────────────────────────────────────────── */

  private _renderCompact(
    stateObj: any, name: string, isOn: boolean,
    targetTemp: number, currentTemp: number, humidVal: any,
    hvacMode: string, minTemp: number, maxTemp: number,
    cardStyle: string
  ) {
    const isOnline = stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    const displayValue = isOn ? (hvacMode === 'fan_only' ? 'FA' : (targetTemp != null ? `${targetTemp}°` : '--')) : (isOnline ? 'Off' : 'Offline');
    const coilSensor = this._config.coil_cleaning_sensor ? this.hass.states[this._config.coil_cleaning_sensor] : undefined;
    const isCleaning = coilSensor?.state === 'on';
    
    const activeStrs: string[] = [];
    if (isOn) {
      activeStrs.push(this._modeLabel(hvacMode));
      const presetMode = stateObj.attributes.preset_mode;
      if (presetMode && presetMode !== 'none') {
        if (/^cv[\s_]/.test(presetMode)) {
          const pct = parseCv(presetMode);
          activeStrs.push(pct === 0 ? 'Normal' : pct + '%');
        } else {
          activeStrs.push(this._presetLabel(presetMode));
        }
      }
    }
    const modeString = activeStrs.length ? activeStrs.join(' • ') : '';

    return html`
      <ha-card style="${cardStyle}" class="compact-card ${this._config.full_layout === 'google_home' ? 'google-home' : 'classic'}" @click=${() => { this._haptic('selection'); this._expanded = true; }}>
        <div class="compact-header">
          <button
            class="compact-icon-btn ${isOn ? 'on' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Power cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Power')}"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Power cannot be toggled while coil cleaning is active');
              } else if (!isOnline) {
                this._showToast('Device is offline');
              } else {
                this._togglePower(stateObj);
              }
            }}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="compact-title">${name}</div>
          <ha-icon class="compact-chevron" icon="mdi:chevron-right"></ha-icon>
        </div>
        
        <div class="compact-center">
          <div class="compact-value">${displayValue}</div>
        </div>

        <div class="compact-footer">
          <button
            class="compact-action-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) <= Number(minTemp)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) <= Number(minTemp) ? `Minimum temperature reached (${minTemp}°)` : 'Decrease Temperature')))}"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) <= Number(minTemp)) {
                this._showToast(`Minimum temperature reached (${minTemp}°)`);
              } else {
                this._adjustTemp(-1, targetTemp, minTemp);
              }
            }}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div class="compact-subtitle" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${currentTemp != null ? html`
                <span style="display: flex; align-items: center; gap: 4px;">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 14px;"></ha-icon>${currentTemp}°
                </span>` : ''}
              ${humidVal != null ? html`
                <span style="display: flex; align-items: center; gap: 4px;">
                  <ha-icon icon="mdi:water-percent" style="--mdc-icon-size: 14px;"></ha-icon>${humidVal}%
                </span>` : ''}
            </div>
            ${modeString ? html`<div style="font-size: 0.75rem; opacity: 0.7;">${modeString}</div>` : ''}
          </div>
          <button
            class="compact-action-btn ${!isOn || hvacMode === 'fan_only' || (targetTemp != null && Number(targetTemp) >= Number(maxTemp)) || isCleaning ? 'disabled' : ''}"
            title="${isCleaning ? 'Temperature cannot be adjusted while coil cleaning is active' : (!isOn ? 'Turn on the AC to adjust temperature' : (hvacMode === 'fan_only' ? 'Temperature cannot be adjusted in Fan Only mode' : (targetTemp != null && Number(targetTemp) >= Number(maxTemp) ? `Maximum temperature reached (${maxTemp}°)` : 'Increase Temperature')))}"
            @click=${(e: Event) => {
              e.stopPropagation();
              if (isCleaning) {
                this._showToast('Temperature cannot be adjusted while coil cleaning is active');
              } else if (!isOn) {
                this._showToast('Turn on the AC to adjust temperature');
              } else if (hvacMode === 'fan_only') {
                this._showToast('Temperature cannot be adjusted in Fan Only mode');
              } else if (targetTemp != null && Number(targetTemp) >= Number(maxTemp)) {
                this._showToast(`Maximum temperature reached (${maxTemp}°)`);
              } else {
                this._adjustTemp(1, targetTemp, maxTemp);
              }
            }}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </ha-card>
    `;
  }

  public getCardSize(): number { return this._config?.layout === 'compact' && !this._expanded ? 2 : 5; }
}

// Dual registration for seamless backward-compatibility
if (!customElements.get('miraie-ac-card')) {
  customElements.define('miraie-ac-card', class extends MirAIeACCard {});
}
