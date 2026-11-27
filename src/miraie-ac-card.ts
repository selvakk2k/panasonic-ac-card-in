import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { MirAIeCardConfig } from './types';
import { styles } from './styles';

/* ── Card picker & By-Entity suggestion registration ── */
const customCardEntry = {
  type: 'miraie-ac-card-in',
  name: 'Panasonic AC India Card',
  description: 'A premium thermostat card for Indian-market Panasonic MirAIe & Matter AC units',
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

/** Decode Panasonic Matter/3.02+ packed temperature (e.g. 61.3 -> 30.24°C). */
function parsePackedTemp(val: any): number | any {
  const num = Number(val);
  if (val == null || isNaN(num) || num <= 50) return val;
  const parts = num.toFixed(2).split('.');
  if (parts.length === 2) {
    const prefix = parseInt(parts[0], 10);
    const suffix = parseInt(parts[1], 10);
    if (suffix >= 10 && suffix <= 50) {
      return Number((suffix + prefix / 256.0).toFixed(2));
    }
  }
  return val;
}

function discoverCompanionEntities(hass: HomeAssistant | undefined, entity: string): Record<string, string> {
  const found: Record<string, string> = {};
  if (!entity || !hass?.states) return found;
  const base = entity.replace(/^climate\./, '');
  const reg = (hass as any)?.entities;
  const devId = reg?.[entity]?.device_id;
  const keys = Object.keys(hass.states);
  const escBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const climateBases = keys
    .filter(k => k.startsWith('climate.') && k !== entity)
    .map(k => k.slice('climate.'.length))
    .filter(b => b.length > base.length && b.startsWith(`${base}_`));
  const baseRe = new RegExp(`^${escBase}(?:_|$)`);
  const findId = (domain: string, pats: string[]): string | undefined => {
    for (const p of pats) {
      const scopedId = `${domain}.${base}_${p}`;
      if (hass.states[scopedId] && (!devId || !reg?.[scopedId]?.device_id || reg[scopedId].device_id === devId)) {
        return scopedId;
      }
      const escP = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patRe = new RegExp(`(?:^|_)${escP}(?:_|$)`);
      const m = keys.find(k => {
        if (!k.startsWith(`${domain}.`)) return false;
        const objId = k.slice(domain.length + 1);
        const belongs = devId
          ? reg?.[k]?.device_id === devId
          : (baseRe.test(objId) && !climateBases.some(cb => objId.startsWith(`${cb}_`)));
        if (p === 'current' && !k.endsWith('_current') && hass.states[k]?.attributes?.device_class !== 'current') return false;
        return belongs && patRe.test(objId);
      });
      if (m) return m;
      const genericId = `${domain}.${p}`;
      if (hass.states[genericId] && (!devId || !reg?.[genericId]?.device_id || reg[genericId].device_id === devId)) {
        return genericId;
      }
    }
    return undefined;
  };
  const map: [string, string, string[]][] = [
    ['local_udp_sensor', 'binary_sensor', ['local_udp_connected', 'local_udp', 'udp_connected']],
    ['cloud_mqtt_sensor', 'binary_sensor', ['cloud_mqtt_connected', 'cloud_mqtt']],
    ['ir_blaster_sensor', 'binary_sensor', ['ir_blaster_available', 'ir_transmitter_available', 'ir_blaster']],
    ['control_source_sensor', 'sensor', ['last_controlled_via', 'control_source']],
    ['nanoe_switch', 'switch', ['nanoe', 'nanoe_switch']],
    ['coil_clean_button', 'button', ['start_coil_clean', 'coil_clean']],
    ['coil_cleaning_sensor', 'binary_sensor', ['coil_cleaning', 'coil_clean']],
    ['filter_alert_sensor', 'binary_sensor', ['filter_clean_alert', 'filter_alert', 'filter_clean']],
    ['estimated_power_sensor', 'sensor', ['estimated_power']],
    ['energy_today_sensor', 'sensor', ['today_s_energy', 'energy_today', 'today_energy']],
    ['energy_yesterday_sensor', 'sensor', ['yesterday_s_energy', 'energy_yesterday', 'yesterday_energy']],
    ['rssi_sensor', 'sensor', ['rssi', 'signal']],
    ['compressor_frequency_sensor', 'sensor', ['compressor_frequency']],
    ['evaporator_coil_temp_sensor', 'sensor', ['evaporator_coil_temperature', 'evaporator_coil_temp']],
    ['outdoor_condenser_temp_sensor', 'sensor', ['outdoor_condenser_temperature', 'outdoor_condenser_temp']],
    ['voltage_sensor', 'sensor', ['voltage']],
    ['current_sensor', 'sensor', ['current']],
  ];
  for (const [key, dom, pats] of map) {
    const id = findId(dom, pats);
    if (id) found[key] = id;
  }
  return found;
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

  static getConfigElement() {
    return document.createElement('miraie-ac-card-in-editor');
  }

  /* ── Native visual editor schema ── */
  static getConfigForm() {
    const LABELS: Record<string, string> = {
      entity: 'Climate Entity',
      name: 'Card Name',
      theme: 'Theme',
      layout: 'Layout',
      full_layout: 'UI Style',
      accent_color: 'Accent Color',
      main_color: 'Background Color',
      show_controls: 'Show Feature Controls',
      show_energy: 'Show Energy Section',
      show_diagnostics: 'Show Footer Telemetry',
      room_temp_sensor: 'Room Temperature Sensor',
      humidity_sensor: 'Humidity Sensor',
      local_udp_sensor: 'Local UDP Sensor',
      cloud_mqtt_sensor: 'Cloud MQTT Sensor',
      hybrid_submode_switch: 'Hybrid Submode Switch',
      active_backend_switch: 'Active Backend Switch',
      ir_blaster_sensor: 'IR Blaster Sensor',
      control_source_sensor: 'Control Source Sensor',
      nanoe_switch: 'Nanoe Switch',
      display_switch: 'Display Switch',
      coil_clean_button: 'Coil Clean Button',
      coil_cleaning_sensor: 'Coil Cleaning Sensor',
      filter_alert_sensor: 'Filter Alert Sensor',
      estimated_power_sensor: 'Power Sensor',
      energy_today_sensor: 'Today Energy Sensor',
      energy_yesterday_sensor: 'Yesterday Energy Sensor',
      rssi_sensor: 'RSSI Sensor',
      compressor_frequency_sensor: 'Compressor Frequency Sensor',
      evaporator_coil_temp_sensor: 'Evaporator Coil Temperature Sensor',
      outdoor_condenser_temp_sensor: 'Outdoor Condenser Temperature Sensor',
      voltage_sensor: 'Voltage Sensor',
      current_sensor: 'Current Sensor',
    };
    const HELPERS: Record<string, string> = {
      accent_color: 'Setting a custom accent color overrides your Home Assistant system theme.',
      main_color: 'Setting a custom background color overrides your Home Assistant system theme.',
    };
    return {
      computeLabel: (schema: any) => LABELS[schema?.name] || schema?.label || schema?.name,
      computeHelper: (schema: any) => HELPERS[schema?.name],
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'climate' } } },
        { name: 'name', selector: { text: {} } },
        {
          name: '', type: 'expandable', title: 'Appearance & Theme', icon: 'mdi:palette',
          schema: [
            { name: 'theme', label: 'Theme', selector: { select: { options: [{ label: 'Default', value: 'default' }, { label: 'Material You (Material 3)', value: 'material_you' }] } } },
            { name: 'layout', label: 'Layout', selector: { select: { options: [{ label: 'Full', value: 'default' }, { label: 'Compact (Expandable)', value: 'compact' }] } } },
            { name: 'full_layout', label: 'UI Style', selector: { select: { options: [{ label: 'Classic', value: 'default' }, { label: 'Google Home (Material 3)', value: 'google_home' }] } } },
            { name: 'accent_color', label: 'Accent Color (Overrides system theme)', selector: { ui_color: {} } },
            { name: 'main_color', label: 'Background Color (Overrides system theme)', selector: { ui_color: {} } },
            { name: 'show_controls', label: 'Show Feature Controls', default: true, selector: { boolean: {} } },
            { name: 'show_energy', label: 'Show Energy Section', default: true, selector: { boolean: {} } },
            { name: 'show_diagnostics', label: 'Show Footer Telemetry', default: true, selector: { boolean: {} } },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Sensors', icon: 'mdi:thermometer',
          schema: [
            { name: 'room_temp_sensor', label: 'Room Temperature Sensor', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
            { name: 'humidity_sensor', label: 'Humidity Sensor', selector: { entity: { domain: 'sensor', device_class: 'humidity' } } },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Connectivity & Failover', icon: 'mdi:swap-horizontal-circle-outline',
          schema: [
            { name: 'local_udp_sensor', label: 'Local UDP Sensor', selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } } },
            { name: 'cloud_mqtt_sensor', label: 'Cloud MQTT Sensor', selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } } },
            { name: 'hybrid_submode_switch', label: 'Hybrid Submode Switch', selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'active_backend_switch', label: 'Active Backend Switch', selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'ir_blaster_sensor', label: 'IR Blaster Sensor', selector: { entity: { domain: ['binary_sensor', 'infrared', 'remote'] } } },
            { name: 'control_source_sensor', label: 'Control Source Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
          ],
        },
        {
          name: '', type: 'expandable', title: 'AC Features & Controls', icon: 'mdi:toggle-switch-outline',
          schema: [
            { name: 'nanoe_switch', label: 'Nanoe Switch', selector: { entity: { domain: 'switch', integration: 'miraie_in' } } },
            { name: 'display_switch', label: 'Display Switch', selector: { entity: { domain: ['switch', 'select'], integration: 'miraie_in' } } },
            { name: 'coil_clean_button', label: 'Coil Clean Button', selector: { entity: { domain: 'button', integration: 'miraie_in' } } },
            { name: 'coil_cleaning_sensor', label: 'Coil Cleaning Sensor', selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } } },
            {
              name: 'filter_alert_sensor',
              label: 'Filter Alert Sensor',
              selector: { entity: { domain: 'binary_sensor', integration: 'miraie_in' } },
            },
          ],
        },
        {
          name: '', type: 'expandable', title: 'Energy & Diagnostics', icon: 'mdi:chart-line',
          schema: [
            { name: 'estimated_power_sensor', label: 'Power Sensor', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
            { name: 'energy_today_sensor', label: 'Today Energy Sensor', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
            { name: 'energy_yesterday_sensor', label: 'Yesterday Energy Sensor', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
            { name: 'rssi_sensor', label: 'RSSI Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'compressor_frequency_sensor', label: 'Compressor Frequency Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'evaporator_coil_temp_sensor', label: 'Evaporator Coil Temperature Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'outdoor_condenser_temp_sensor', label: 'Outdoor Condenser Temperature Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'voltage_sensor', label: 'Voltage Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
            { name: 'current_sensor', label: 'Current Sensor', selector: { entity: { domain: 'sensor', integration: 'miraie_in' } } },
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
    const stub: Record<string, any> = {
      type: 'custom:miraie-ac-card-in',
      entity,
      show_controls: true,
      show_energy: true,
      show_diagnostics: true,
    };
    if (entity && hass?.states) {
      Object.assign(stub, discoverCompanionEntities(hass, entity));
    }
    return stub;
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
      const climateId = this._getEntityId();
      const entityReg = (this.hass as any)?.entities;
      const climateDeviceId = entityReg?.[climateId]?.device_id;
      const explicitIds = new Set<string>(
        COMPANION_KEYS.map((ck) => (cfg as any)[ck]).filter((v): v is string => typeof v === 'string' && v.length > 0),
      );
      const discovered = discoverCompanionEntities(this.hass, climateId);
      for (const dv of Object.values(discovered)) {
        if (dv) explicitIds.add(dv);
      }
      const prevDiscovered = discoverCompanionEntities(old, climateId);
      for (const dv of Object.values(prevDiscovered)) {
        if (dv) explicitIds.add(dv);
      }
      for (const eid of explicitIds) {
        if (old.states[eid] !== this.hass.states[eid]) return true;
      }
      const keys = Object.keys(this.hass.states);
      for (const k of keys) {
        const belongsToDevice = Boolean(climateDeviceId && entityReg?.[k]?.device_id === climateDeviceId);
        if (k === cfg.entity || explicitIds.has(k) || belongsToDevice || k.includes(base)) {
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
  private _getEntityId(): string {
    if (this._config?.entity) return this._config.entity;
    if (this.hass?.states) {
      const stateKeys = Object.keys(this.hass.states);
      const reg = (this.hass as any)?.entities;
      return (
        (reg && stateKeys.find((id) => id.startsWith('climate.') && (reg[id]?.platform === 'miraie_in' || reg[id]?.platform === 'miraie_ac'))) ||
        stateKeys.find((id) => id.startsWith('climate.') && id.includes('miraie')) ||
        ''
      );
    }
    return '';
  }

  private _findCompanionEntity(configuredId: string | undefined, domain: string, patterns: string[]): any {
    if (configuredId === '') return undefined;
    if (configuredId && this.hass?.states?.[configuredId]) return this.hass.states[configuredId];
    if (!this.hass?.states) return undefined;
    const baseId = (this._getEntityId() || '').replace(/^climate\./, '');
    for (const pat of patterns) {
      const fullId = `${domain}.${pat}`;
      if (this.hass.states[fullId]) return this.hass.states[fullId];
      if (baseId) {
        const prefId = `${domain}.${baseId}_${pat}`;
        if (this.hass.states[prefId]) return this.hass.states[prefId];
      }
    }
    const keys = Object.keys(this.hass.states);
    const climateId = this._getEntityId();
    const entityReg = (this.hass as any)?.entities;
    const climateDeviceId = entityReg?.[climateId]?.device_id;
    const moreSpecificBases = keys
      .filter(id => id.startsWith('climate.') && id !== climateId)
      .map(id => id.replace(/^climate\./, ''))
      .filter(oc => baseId && oc.length > baseId.length && oc.startsWith(`${baseId}_`));
    for (const pat of patterns) {
      const match = keys.find(k => {
        if (!k.startsWith(`${domain}.${baseId}_`) || !k.includes(pat)) return false;
        if (pat === 'current' && !k.endsWith('_current') && this.hass.states[k]?.attributes?.device_class !== 'current') return false;
        if (climateDeviceId && entityReg?.[k]?.device_id && entityReg[k].device_id !== climateDeviceId) return false;
        const objId = k.slice(domain.length + 1);
        return !moreSpecificBases.some(oc => objId.startsWith(`${oc}_`));
      });
      if (match) return this.hass.states[match];
    }
    // Fallback: match if domain matches, key ends with pat, and entity belongs to the same device (or clean prefix match)

    for (const pat of patterns) {
      const match = keys.find(k => {
        if (!k.startsWith(`${domain}.`) || !k.includes(pat)) return false;
        if (pat === 'current' && !k.endsWith('_current') && this.hass.states[k]?.attributes?.device_class !== 'current') return false;
        // 1. Strict device ownership check via entity registry if available
        if (climateDeviceId && entityReg?.[k]?.device_id) {
          return entityReg[k].device_id === climateDeviceId;
        }
        // 2. Exact prefix match with check against other climate entities to prevent false borrowing
        if (!baseId) return false;
        const objectId = k.slice(domain.length + 1);
        const isPrefix = objectId.startsWith(`${baseId}_`) || objectId.endsWith(`_${baseId}`) || objectId.includes(`_${baseId}_`);
        if (!isPrefix) return false;

        // Ensure no other climate entity has a closer/more specific prefix match
        const otherClimates = Object.keys(this.hass.states).filter(
          id => id.startsWith('climate.') && id !== climateId
        );
        for (const oc of otherClimates) {
          const ocBase = oc.replace(/^climate\./, '');
          if (ocBase && ocBase.length > baseId.length && (objectId.startsWith(`${ocBase}_`) || objectId.endsWith(`_${ocBase}`) || objectId.includes(`_${ocBase}_`))) {
            return false;
          }
        }
        return true;
      });
      if (match) return this.hass.states[match];
    }
    return undefined;
  }

  private _findDisplayEntity(configuredId?: string): any {
    if (configuredId && this.hass?.states?.[configuredId]) return this.hass.states[configuredId];
    const sw = this._findCompanionEntity(configuredId, 'switch', ['display', 'led']);
    if (sw) return sw;
    return this._findCompanionEntity(configuredId, 'select', ['display_mode', 'display']);
  }

  protected render(): TemplateResult | null {
    if (!this.hass || !this._config) return null;

    const cfg = this._config;
    const entityId = this._getEntityId();
    const stateObj = entityId ? this.hass.states[entityId] : undefined;
    if (!stateObj) {
      return html`
        <ha-card class="m-card" style="padding: 24px; text-align: center; color: var(--appliance-text-2, var(--secondary-text-color, #8e8e93));">
          <ha-icon icon="mdi:air-conditioner" style="--mdc-icon-size: 40px; margin-bottom: 8px; opacity: 0.6; color: var(--miraie-accent, var(--primary-color, #f39c12));"></ha-icon>
          <div style="font-weight: 500; font-size: 15px; color: var(--appliance-text-1, var(--primary-text-color, inherit));">Panasonic MirAIe AC Card</div>
          <div style="font-size: 13px; margin-top: 4px;">
            ${entityId ? html`Entity not found: <code>${entityId}</code>` : 'Please select a Panasonic MirAIe climate entity in the card editor.'}
          </div>
        </ha-card>
      `;
    }

    const a = stateObj.attributes;
    const isOnline = stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    const isOn = stateObj.state !== 'off' && isOnline;

    const friendlyName = cfg.name || a.friendly_name || 'AC';
    const targetTemp = a.temperature;
    const minTemp = a.min_temp ?? 16;
    const maxTemp = a.max_temp ?? 30;
    const presetMode = a.preset_mode;
    const effectiveMin = presetMode === 'eco' ? 16 : minTemp;
    const effectiveMax = presetMode === 'eco' ? 30 : maxTemp;
    const hvacMode = stateObj.state;
    const fanMode = a.fan_mode;
    const swingV = a.swing_mode;
    const swingH = a.swing_horizontal_mode;

    /* Room temperature: external sensor overrides AC built-in (supports packed Matter 61.3 -> 30.24°C) */
    const roomSensor = cfg.room_temp_sensor ? this.hass.states[cfg.room_temp_sensor] : undefined;
    const isFahrenheit = this.hass?.config?.unit_system?.temperature === '°F';
    const isPackedSource = Boolean(
      a.matter_only === true ||
      a.primary_backend === 'matter' ||
      a.secondary_backend === 'matter' ||
      (this.hass as any)?.entities?.[entityId]?.platform === 'matter',
    );
    let currentTemp: any = roomSensor
      ? roomSensor.state
      : (!isFahrenheit && isPackedSource ? parsePackedTemp(a.current_temperature) : a.current_temperature);
    if (currentTemp != null && !isNaN(Number(currentTemp))) {
      currentTemp = Number(currentTemp).toFixed(1);
    }

    /* Humidity */
    const humidState = cfg.humidity_sensor ? this.hass.states[cfg.humidity_sensor] : undefined;
    let humidVal: any = humidState ? humidState.state : undefined;
    if (humidVal != null && !isNaN(Number(humidVal))) {
      humidVal = Number(humidVal).toFixed(1);
    }

    /* Helper entities with 3-tier auto-discovery */
    const nanoe = this._findCompanionEntity(cfg.nanoe_switch, 'switch', ['nanoe', 'nanoe_switch']);
    const display = this._findDisplayEntity(cfg.display_switch);
    const coilBtn = this._findCompanionEntity(cfg.coil_clean_button, 'button', ['start_coil_clean', 'coil_clean']);
    const coilSensor = this._findCompanionEntity(cfg.coil_cleaning_sensor, 'binary_sensor', ['coil_cleaning', 'coil_clean']);
    const filterAlert = this._findCompanionEntity(cfg.filter_alert_sensor, 'binary_sensor', ['filter_clean_alert', 'filter_alert', 'filter_clean']);
    const rssi = this._findCompanionEntity(cfg.rssi_sensor, 'sensor', ['rssi', 'signal']);
    const energyToday = this._findCompanionEntity(cfg.energy_today_sensor, 'sensor', ['today_s_energy', 'energy_today', 'today_energy']);
    const energyYest = this._findCompanionEntity(cfg.energy_yesterday_sensor, 'sensor', ['yesterday_s_energy', 'energy_yesterday', 'yesterday_energy']);
    const estPower = this._findCompanionEntity(cfg.estimated_power_sensor, 'sensor', ['estimated_power']);
    const compFreq = this._findCompanionEntity(cfg.compressor_frequency_sensor, 'sensor', ['compressor_frequency']);
    const evapTemp = this._findCompanionEntity(cfg.evaporator_coil_temp_sensor, 'sensor', ['evaporator_coil_temperature', 'evaporator_coil_temp']);
    const condTemp = this._findCompanionEntity(cfg.outdoor_condenser_temp_sensor, 'sensor', ['outdoor_condenser_temperature', 'outdoor_condenser_temp']);
    const voltage = this._findCompanionEntity(cfg.voltage_sensor, 'sensor', ['voltage']);
    const current = this._findCompanionEntity(cfg.current_sensor, 'sensor', ['current']);
    const localUdp = this._findCompanionEntity(cfg.local_udp_sensor, 'binary_sensor', ['local_udp_connected', 'local_udp', 'udp_connected']);
    const cloudMqtt = this._findCompanionEntity(cfg.cloud_mqtt_sensor, 'binary_sensor', ['cloud_mqtt_connected', 'cloud_mqtt']);
    const irBlaster = this._findCompanionEntity(cfg.ir_blaster_sensor, 'binary_sensor', [
      'ir_blaster_available',
      'ir_transmitter_available',
      'ir_blaster_transmitter_availability',
      'ir_blaster'
    ]);
    const hybridSwitch = this._findCompanionEntity(cfg.hybrid_submode_switch, 'switch', [
      'hybrid_automatic_control',
      'hybrid_submode',
      'hybrid_control',
      'hybrid'
    ]);
    const activeBackendSwitch = this._findCompanionEntity(cfg.active_backend_switch, 'switch', [
      'primary_transport_backend_cloud',
      'primary_transport_backend',
      'active_backend',
      'backend',
      'transport'
    ]);
    const controlSource = this._findCompanionEntity(cfg.control_source_sensor, 'sensor', [
      'last_controlled_via',
      'control_source'
    ]);
    const isCleaning = coilSensor?.state === 'on';
    const isMatterOnly = a.matter_only === true || (a.primary_backend === 'matter' && (!a.secondary_backend || a.secondary_backend === 'none'));
    const isMatterFailoverOnly = !isMatterOnly && a.matter_connected === true && a.non_matter_available === false;
    const showControls = cfg.show_controls !== false && !isMatterOnly;
    const showEnergy = cfg.show_energy !== false;
    const showDiagnostics = cfg.show_diagnostics !== false;

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
    const cvNonZero = cvOptions.filter(o => parseCv(o) > 0).sort((a, b) => parseCv(a) - parseCv(b));
    // All steps: Normal first, then ascending percentage steps
    const allCvSteps = [`${cvPrefix}0`, ...cvNonZero];
    const curCvIdx = allCvSteps.indexOf(curCvOpt);   // 0 = Normal
    const cvGenLabel = convertiLabel(cvOptions);
    const fillPct = cvNonZero.length > 0
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
            const bInfo = this._getBackendInfo(activeBackendSwitch, a);
            const isAuto = hybridSwitch && (hybridSwitch.state === 'auto' || hybridSwitch.state === 'on');
            return html`
                      <button
                        class="segmented-item ${!isAuto ? 'active' : ''} ${isAuto || isCleaning ? 'disabled' : ''}"
                        title="${isAuto ? 'Primary connection method is managed automatically in Auto Failover mode' + bInfo.fallbackText : (isCleaning ? 'Backend cannot be switched while coil cleaning is active' : 'Click to toggle primary connection method' + bInfo.fallbackText)}"
                        @click=${() => {
                if (isAuto) {
                  this._showToast('Primary connection method is managed automatically in Auto Failover mode' + bInfo.fallbackText);
                } else if (isCleaning) {
                  this._showToast('Backend cannot be switched while coil cleaning is active');
                } else {
                  this._toggleSwitch(activeBackendSwitch.entity_id, activeBackendSwitch.state);
                }
              }}
                      >
                        <ha-icon icon="${bInfo.icon}"></ha-icon>
                        ${bInfo.label}
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

        ${showControls ? html`
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
                            ${i < curCvIdx ? 'filled' : ''}
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
        ` : ''}

        <!-- ── Controls (Nanoe, Display, Coil Clean) ── -->
        ${showControls && (nanoe || display || coilBtn) ? html`
          <div class="section">
            <div class="section-title">Controls</div>
            <div class="toggles">
              ${nanoe ? html`
                <div class="toggle-card ${!isOnline || isCleaning || isMatterFailoverOnly ? 'disabled' : ''}"
                     title="${isMatterFailoverOnly ? 'Unavailable while Matter is the only active connection' : (isCleaning ? 'Nanoe cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Nanoe™ air purification'))}"
                     @click=${() => {
            if (isMatterFailoverOnly) {
              this._showToast('Unavailable while Matter is the only active connection');
            } else if (isCleaning) {
              this._showToast('Nanoe cannot be toggled while coil cleaning is active');
            } else if (!isOnline) {
              this._showToast('Device is offline');
            } else {
              this._toggleSwitch(nanoe.entity_id, nanoe.state);
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
              ${display ? (() => {
          const isDisplayOn = display.state === 'on' || display.state === 'night';
          const displayIcon = display.state === 'night' ? 'mdi:weather-night' : 'mdi:eye';
          const displayLabel = display.state === 'night' ? 'AC LED (Night)' : 'AC LED';
          return html`
                <div class="toggle-card ${!isOnline || isCleaning ? 'disabled' : ''}"
                     title="${isCleaning ? 'Display LED cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : (display.state === 'night' ? 'Display in Night Mode (click to cycle)' : 'Toggle indoor unit LED display'))}"
                     @click=${() => {
              if (isCleaning) {
                this._showToast('Display LED cannot be toggled while coil cleaning is active');
              } else if (!isOnline) {
                this._showToast('Device is offline');
              } else {
                this._handleDisplayToggle(display);
              }
            }}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${isDisplayOn ? 'active' : ''}">
                      <ha-icon icon="${displayIcon}"></ha-icon>
                    </div>
                    <span class="toggle-label">${displayLabel}</span>
                  </div>
                  <ha-switch .checked=${isDisplayOn} ?disabled=${!isOnline}></ha-switch>
                </div>
              `;
        })() : ''}
              ${coilBtn ? html`
                <div class="toggle-card ${isOn || isCleaning ? 'disabled' : ''}"
                     title="${isCleaning ? 'Coil cleaning cycle is currently running' : (isOn ? 'Coil clean cannot be started while AC is running' : 'Start coil self-cleaning cycle')}"
                     @click=${() => {
            if (isCleaning) {
              this._showToast('Coil cleaning cycle is currently running');
            } else if (isOn) {
              this._showToast('Coil clean cannot be started while AC is running');
            } else {
              this._pressButton(coilBtn.entity_id);
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
        ${showEnergy && (energyToday || energyYest || estPower) ? html`
          <div class="section">
            <div class="section-title">Energy Consumption</div>
            <div class="energy-row">
              ${estPower ? html`
                <div class="energy-card" @click=${() => this._showMoreInfo(estPower.entity_id)}>
                  <div class="energy-label">
                    <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    Live Power
                  </div>
                  <div class="energy-value-row">
                    <span class="energy-value">${!isNaN(Number(estPower.state)) ? Number(estPower.state).toFixed(1) : '—'}</span>
                    <span class="energy-unit">${estPower.attributes.unit_of_measurement ?? 'W'}</span>
                  </div>
                </div>
              ` : ''}
              ${energyToday ? html`
                <div class="energy-card" @click=${() => this._showMoreInfo(energyToday.entity_id)}>
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
                <div class="energy-card" @click=${() => this._showMoreInfo(energyYest.entity_id)}>
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
        ${showDiagnostics ? html`<div class="footer-telemetry-row">
          ${this._renderTransportPills(a.primary_backend, a.secondary_backend, localUdp, cloudMqtt, irBlaster)}
          ${controlSource && controlSource.state && controlSource.state !== 'unknown' && controlSource.state !== 'unavailable' ? html`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(controlSource.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(controlSource.state)}</span>
            </div>
          ` : ''}
          ${this._renderDiagTelemetryPills(compFreq, evapTemp, condTemp, voltage, current)}
          ${rssi ? html`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${rssi.state} ${rssi.attributes.unit_of_measurement ?? 'dBm'}</span>
            </div>
          ` : ''}
        </div>` : ''}
      </ha-card>
    `;
  }

  /* ─────────────────────────────────────────────
     Panel toggle
     ───────────────────────────────────────────── */

  private _renderDiagTelemetryPills(compFreq: any, evapTemp: any, condTemp: any, voltage: any, current: any): TemplateResult {
    const valOrDash = (st: any) =>
      st?.state && st.state !== 'unknown' && st.state !== 'unavailable' ? st.state : '—';
    return html`
      ${compFreq ? html`
        <div class="connection-status-pill" @click=${() => this._showMoreInfo(compFreq.entity_id)}>
          <ha-icon icon="mdi:sine-wave" style="--mdc-icon-size: 14px;"></ha-icon>
          <span>${valOrDash(compFreq)} ${compFreq.attributes?.unit_of_measurement ?? 'Hz'}</span>
        </div>
      ` : ''}
      ${evapTemp ? html`
        <div class="connection-status-pill" @click=${() => this._showMoreInfo(evapTemp.entity_id)}>
          <ha-icon icon="mdi:thermometer-lines" style="--mdc-icon-size: 14px;"></ha-icon>
          <span>Evap ${valOrDash(evapTemp)}${evapTemp.attributes?.unit_of_measurement ?? '°C'}</span>
        </div>
      ` : ''}
      ${condTemp ? html`
        <div class="connection-status-pill" @click=${() => this._showMoreInfo(condTemp.entity_id)}>
          <ha-icon icon="mdi:sun-thermometer-outline" style="--mdc-icon-size: 14px;"></ha-icon>
          <span>Out ${valOrDash(condTemp)}${condTemp.attributes?.unit_of_measurement ?? '°C'}</span>
        </div>
      ` : ''}
      ${voltage ? html`
        <div class="connection-status-pill" @click=${() => this._showMoreInfo(voltage.entity_id)}>
          <ha-icon icon="mdi:flash-triangle-outline" style="--mdc-icon-size: 14px;"></ha-icon>
          <span>${valOrDash(voltage)} ${voltage.attributes?.unit_of_measurement ?? 'V'}</span>
        </div>
      ` : ''}
      ${current ? html`
        <div class="connection-status-pill" @click=${() => this._showMoreInfo(current.entity_id)}>
          <ha-icon icon="mdi:current-ac" style="--mdc-icon-size: 14px;"></ha-icon>
          <span>${valOrDash(current)} ${current.attributes?.unit_of_measurement ?? 'A'}</span>
        </div>
      ` : ''}
    `;
  }

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
    const targetEntity = this._getEntityId();
    if (!targetEntity) return;
    const next = Number(current) + delta;
    if (limit != null && ((delta < 0 && next < Number(limit)) || (delta > 0 && next > Number(limit)))) return;
    const stateObj = this.hass?.states[targetEntity];
    if (stateObj?.state === 'auto') {
      this._showToast(`Temperature ${next}°C queued`);
    }
    this.hass.callService('climate', 'set_temperature', { entity_id: targetEntity, temperature: next });
  }

  private _setHvacMode(mode: string): void {
    this._haptic('light');
    const targetEntity = this._getEntityId();
    if (!targetEntity) return;
    this.hass.callService('climate', 'set_hvac_mode', { entity_id: targetEntity, hvac_mode: mode });
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
    const targetEntity = this._getEntityId();
    if (!targetEntity) return;
    const targetPreset = (preset === 'cv_0' || preset === 'cv 0') ? 'none' : preset;
    this.hass.callService('climate', 'set_preset_mode', { entity_id: targetEntity, preset_mode: targetPreset });
  }



  private _toggleSwitch(entityId: string, currentState: string): void {
    this._haptic('light');
    this.hass.callService('switch', currentState === 'on' ? 'turn_off' : 'turn_on', { entity_id: entityId });
  }

  private _handleDisplayToggle(display: any): void {
    this._haptic('light');
    if (!display || !this.hass) return;
    if (display.entity_id.startsWith('select.')) {
      const options: string[] = display.attributes?.options || ['on', 'off'];
      const currentIndex = options.indexOf(display.state);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0;
      const nextOption = options[nextIndex];
      this.hass.callService('select', 'select_option', {
        entity_id: display.entity_id,
        option: nextOption,
      });
    } else {
      this.hass.callService('switch', display.state === 'on' ? 'turn_off' : 'turn_on', {
        entity_id: display.entity_id,
      });
    }
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
      cool: 'rgba(100, 181, 246, 0.18)',
      dry: 'rgba(129, 199, 132, 0.18)',
      fan_only: 'rgba(179, 157, 219, 0.18)',
      auto: 'rgba(255, 183,  77, 0.18)',
      heat: 'rgba(255, 138, 101, 0.18)',
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
    if (s.includes('udp') || s.includes('local')) return 'mdi:lan-check';
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
    if (lower === 'local udp' || lower === 'local_udp' || lower === 'udp') return 'Local UDP';
    if (lower === 'ir blaster' || lower === 'ir_blaster') return 'IR Blaster';
    if (lower === 'ir remote' || lower === 'ir_remote') return 'IR Remote';
    if (lower === 'ir failover' || lower === 'ir_failover') return 'IR Failover';
    if (lower === 'ir failover (offline)' || lower === 'ir_failover (offline)') return 'IR Failover (Offline)';

    return trimmed
      .split(/[\s_]+/)
      .map(w => {
        const lw = w.toLowerCase();
        if (lw === 'ir') return 'IR';
        if (lw === 'udp') return 'UDP';
        if (lw === 'mqtt') return 'MQTT';
        if (lw === 'ha') return 'HA';
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join(' ');
  }

  private _formatBackendName(backend?: string): string {
    if (!backend || backend === 'none') return '';
    const b = backend.toLowerCase();
    if (b.includes('udp')) return 'Local UDP';
    if (b.includes('cloud') || b.includes('mqtt')) return 'Cloud MQTT';
    if (b.includes('ir') || b.includes('blaster') || b.includes('remote')) return 'IR Blaster';
    return backend;
  }

  private _renderTransportPills(
    primaryBackend: string | undefined,
    secondaryBackend: string | undefined,
    localUdp: any,
    cloudMqtt: any,
    irBlaster: any
  ): TemplateResult {
    // Determine configured transport backends in priority order
    const configured: string[] = [];
    if (primaryBackend && primaryBackend !== 'none') configured.push(primaryBackend.toLowerCase());
    if (secondaryBackend && secondaryBackend !== 'none' && !configured.includes(secondaryBackend.toLowerCase())) {
      configured.push(secondaryBackend.toLowerCase());
    }

    // Map backend names to corresponding entities and labels
    const getPill = (backend: string) => {
      if (backend.includes('udp') || backend.includes('local')) {
        return localUdp ? html`
          <div class="connection-status-pill">
            <span class="status-dot ${localUdp.state === 'on' ? 'online' : ''}"></span>
            <span>Local UDP</span>
          </div>
        ` : '';
      }
      if (backend.includes('ir') || backend.includes('blaster') || backend.includes('remote')) {
        return irBlaster ? html`
          <div class="connection-status-pill">
            <span class="status-dot ${irBlaster.state === 'on' ? 'online' : ''}"></span>
            <span>IR Blaster</span>
          </div>
        ` : '';
      }
      if (backend.includes('cloud') || backend.includes('mqtt')) {
        return cloudMqtt ? html`
          <div class="connection-status-pill">
            <span class="status-dot ${cloudMqtt.state === 'on' ? 'online' : ''}"></span>
            <span>Cloud MQTT</span>
          </div>
        ` : '';
      }
      return '';
    };

    // If explicit primary/secondary backends are configured, show the first two selected
    if (configured.length > 0) {
      const topTwo = configured.slice(0, 2);
      return html`${topTwo.map(b => getPill(b))}`;
    }

    // Default fallback if no primary/secondary attribute: show discovered entities (max 2)
    const defaults: TemplateResult[] = [];
    if (localUdp) {
      defaults.push(html`
        <div class="connection-status-pill">
          <span class="status-dot ${localUdp.state === 'on' ? 'online' : ''}"></span>
          <span>Local UDP</span>
        </div>
      `);
    }
    if (irBlaster && defaults.length < 2) {
      defaults.push(html`
        <div class="connection-status-pill">
          <span class="status-dot ${irBlaster.state === 'on' ? 'online' : ''}"></span>
          <span>IR Blaster</span>
        </div>
      `);
    }
    if (cloudMqtt && defaults.length < 2) {
      defaults.push(html`
        <div class="connection-status-pill">
          <span class="status-dot ${cloudMqtt.state === 'on' ? 'online' : ''}"></span>
          <span>Cloud MQTT</span>
        </div>
      `);
    }
    return html`${defaults}`;
  }

  private _getBackendInfo(
    activeBackendSwitch: any,
    climateAttrs: any
  ): { label: string; icon: string; isActive: boolean; fallbackText: string } {
    const primary = climateAttrs?.primary_backend;
    const secondary = climateAttrs?.secondary_backend;
    const fallbackName = this._formatBackendName(secondary);
    const fallbackText = fallbackName ? ` (Fallback: ${fallbackName})` : '';
    const hasUdp = climateAttrs?.has_udp ?? false;

    // 1. If physical backend select switch exists, use its live state
    if (activeBackendSwitch && activeBackendSwitch.state && activeBackendSwitch.state !== 'unavailable' && activeBackendSwitch.state !== 'unknown') {
      const state = activeBackendSwitch.state.toLowerCase();
      if (state === 'local_udp' || (hasUdp && state === 'on')) {
        return { label: 'Backend: Local UDP', icon: 'mdi:lan-connect', isActive: true, fallbackText };
      }
      if (state === 'cloud' || (hasUdp && state === 'off') || (!hasUdp && state === 'on')) {
        return { label: 'Backend: Cloud', icon: 'mdi:cloud-sync', isActive: true, fallbackText };
      }
      if (state === 'ir' || (!hasUdp && state === 'off')) {
        return { label: 'Backend: IR', icon: 'mdi:remote', isActive: false, fallbackText };
      }
    }

    // 2. Fallback to climate entity extra_state_attributes
    if (primary) {
      const p = primary.toLowerCase();
      if (p.includes('udp')) {
        return { label: 'Backend: Local UDP', icon: 'mdi:lan-connect', isActive: true, fallbackText };
      }
      if (p.includes('cloud') || p.includes('mqtt')) {
        return { label: 'Backend: Cloud', icon: 'mdi:cloud-sync', isActive: true, fallbackText };
      }
      if (p.includes('ir') || p.includes('blaster')) {
        return { label: 'Backend: IR', icon: 'mdi:remote', isActive: false, fallbackText };
      }
    }

    return { label: hasUdp ? 'Backend: Local UDP' : 'Backend: Cloud', icon: hasUdp ? 'mdi:lan-connect' : 'mdi:cloud-sync', isActive: true, fallbackText };
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
    const fanMode = a.fan_mode;
    const fanModes = a.fan_modes || [];
    const swingV = a.swing_mode;
    const swingVModes = a.swing_modes || [];
    const swingH = a.swing_horizontal_mode;
    const swingHModes = a.swing_horizontal_modes || [];

    const isOnline = stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
    const presetMode = a.preset_mode;
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

    /* Helper entities with 3-tier auto-discovery */
    const nanoe = this._findCompanionEntity(cfg.nanoe_switch, 'switch', ['nanoe', 'nanoe_switch']);
    const display = this._findDisplayEntity(cfg.display_switch);
    const coilBtn = this._findCompanionEntity(cfg.coil_clean_button, 'button', ['start_coil_clean', 'coil_clean']);
    const coilSensor = this._findCompanionEntity(cfg.coil_cleaning_sensor, 'binary_sensor', ['coil_cleaning', 'coil_clean']);
    const filterAlert = this._findCompanionEntity(cfg.filter_alert_sensor, 'binary_sensor', ['filter_clean_alert', 'filter_alert', 'filter_clean']);
    const energyToday = this._findCompanionEntity(cfg.energy_today_sensor, 'sensor', ['today_s_energy', 'energy_today', 'today_energy']);
    const energyYest = this._findCompanionEntity(cfg.energy_yesterday_sensor, 'sensor', ['yesterday_s_energy', 'energy_yesterday', 'yesterday_energy']);
    const estPower = this._findCompanionEntity(cfg.estimated_power_sensor, 'sensor', ['estimated_power']);
    const compFreq = this._findCompanionEntity(cfg.compressor_frequency_sensor, 'sensor', ['compressor_frequency']);
    const evapTemp = this._findCompanionEntity(cfg.evaporator_coil_temp_sensor, 'sensor', ['evaporator_coil_temperature', 'evaporator_coil_temp']);
    const condTemp = this._findCompanionEntity(cfg.outdoor_condenser_temp_sensor, 'sensor', ['outdoor_condenser_temperature', 'outdoor_condenser_temp']);
    const voltage = this._findCompanionEntity(cfg.voltage_sensor, 'sensor', ['voltage']);
    const current = this._findCompanionEntity(cfg.current_sensor, 'sensor', ['current']);
    const rssi = this._findCompanionEntity(cfg.rssi_sensor, 'sensor', ['rssi', 'signal']);
    const localUdp = this._findCompanionEntity(cfg.local_udp_sensor, 'binary_sensor', ['local_udp_connected', 'local_udp', 'udp_connected']);
    const cloudMqtt = this._findCompanionEntity(cfg.cloud_mqtt_sensor, 'binary_sensor', ['cloud_mqtt_connected', 'cloud_mqtt']);
    const irBlaster = this._findCompanionEntity(cfg.ir_blaster_sensor, 'binary_sensor', [
      'ir_blaster_available',
      'ir_transmitter_available',
      'ir_blaster_transmitter_availability',
      'ir_blaster'
    ]);
    const hybridSwitch = this._findCompanionEntity(cfg.hybrid_submode_switch, 'switch', [
      'hybrid_automatic_control',
      'hybrid_submode',
      'hybrid_control',
      'hybrid'
    ]);
    const activeBackendSwitch = this._findCompanionEntity(cfg.active_backend_switch, 'switch', [
      'primary_transport_backend_cloud',
      'primary_transport_backend',
      'active_backend',
      'backend',
      'transport'
    ]);
    const controlSource = this._findCompanionEntity(cfg.control_source_sensor, 'sensor', [
      'last_controlled_via',
      'control_source'
    ]);
    const isCleaning = coilSensor?.state === 'on';
    const isMatterOnly = a.matter_only === true || (a.primary_backend === 'matter' && (!a.secondary_backend || a.secondary_backend === 'none'));
    const isMatterFailoverOnly = !isMatterOnly && a.matter_connected === true && a.non_matter_available === false;
    const showControls = cfg.show_controls !== false && !isMatterOnly;
    const showEnergy = cfg.show_energy !== false;
    const showDiagnostics = cfg.show_diagnostics !== false;

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
                    <span>${this._modeLabel(mode)}</span>
                    ${hvacMode === mode ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
                  </button>
                `)}
              </div>
            ` : ''}
          </div>

          ${showControls ? html`
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
                      <span>${this._presetLabel(p)}</span>
                      ${isActive ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
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
                        <span>${pct === 0 ? 'Normal' : pct + '%'}</span>
                        ${isActive ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
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
                      <span>${m.charAt(0).toUpperCase() + m.slice(1)}</span>
                      ${fanMode === m ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
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
                      <span>${m.charAt(0).toUpperCase() + m.slice(1)}</span>
                      ${swingV === m ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
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
                      <span>${m.charAt(0).toUpperCase() + m.slice(1)}</span>
                      ${swingH === m ? html`<ha-icon icon="mdi:check"></ha-icon>` : ''}
                    </button>
                  `)}
                </div>
              ` : ''}
            </div>
          ` : ''}
          ` : ''}
        </div>

        ${(showControls && (nanoe || display || coilBtn || coilSensor)) || (showEnergy && (energyToday || energyYest || estPower)) ? html`
          <div class="gh-extra-chips">
            ${showControls && nanoe ? html`<div class="gh-chip ${nanoe.state === 'on' ? 'active' : ''} ${!isOnline || isCleaning || isMatterFailoverOnly ? 'disabled' : ''}" title="${isMatterFailoverOnly ? 'Unavailable while Matter is the only active connection' : (isCleaning ? 'Nanoe cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle Nanoe™ air purification'))}" @click=${() => isMatterFailoverOnly ? this._showToast('Unavailable while Matter is the only active connection') : (isCleaning ? this._showToast('Nanoe cannot be toggled while coil cleaning is active') : (!isOnline ? this._showToast('Device is offline') : this._toggleSwitch(nanoe.entity_id, nanoe.state)))}><ha-icon icon="mdi:virus-outline"></ha-icon>Nanoe</div>` : ''}
            ${showControls && display ? (() => { const isDisplayOn = display.state === 'on' || display.state === 'night'; const displayIcon = display.state === 'night' ? 'mdi:weather-night' : 'mdi:lightbulb-outline'; const displaySuffix = display.state === 'night' ? ' (Night)' : ''; return html`<div class="gh-chip ${isDisplayOn ? 'active' : ''} ${!isOnline || isCleaning ? 'disabled' : ''}" title="${isCleaning ? 'Display LED cannot be toggled while coil cleaning is active' : (!isOnline ? 'Device is offline' : 'Toggle indoor unit LED display')}" @click=${() => isCleaning ? this._showToast('Display LED cannot be toggled while coil cleaning is active') : (!isOnline ? this._showToast('Device is offline') : this._handleDisplayToggle(display))}><ha-icon icon="${displayIcon}"></ha-icon>Display${displaySuffix}</div>`; })() : ''}
            ${showControls && (coilBtn || coilSensor) ? html`
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
              this._pressButton(coilBtn.entity_id);
            }
          }}
              >
                <ha-icon icon="mdi:spray"></ha-icon>
                ${coilSensor?.state === 'on' ? 'Cleaning…' : 'Clean Coil'}
              </div>
            ` : ''}
            ${showEnergy && estPower ? html`<div class="gh-chip-text" style="cursor: pointer;" @click=${() => this._showMoreInfo(estPower.entity_id)}><ha-icon icon="mdi:lightning-bolt"></ha-icon>Live: ${!isNaN(Number(estPower.state)) ? Number(estPower.state).toFixed(1) : '—'} ${estPower.attributes.unit_of_measurement ?? 'W'}</div>` : ''}
            ${showEnergy && energyToday && energyYest ? html`
              <div class="gh-chip-text" style="cursor: pointer;" @click=${() => this._showMoreInfo(energyToday.entity_id)}><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${fmt2(energyToday.state)} ${energyToday.attributes?.unit_of_measurement ?? 'kWh'} • Yesterday: ${fmt2(energyYest.state)} ${energyYest.attributes?.unit_of_measurement ?? 'kWh'}</div>
            ` : html`
              ${showEnergy && energyToday ? html`<div class="gh-chip-text" style="cursor: pointer;" @click=${() => this._showMoreInfo(energyToday.entity_id)}><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${fmt2(energyToday.state)} ${energyToday.attributes?.unit_of_measurement ?? 'kWh'}</div>` : ''}
              ${showEnergy && energyYest ? html`<div class="gh-chip-text" style="cursor: pointer;" @click=${() => this._showMoreInfo(energyYest.entity_id)}><ha-icon icon="mdi:lightning-bolt"></ha-icon>Yesterday: ${fmt2(energyYest.state)} ${energyYest.attributes?.unit_of_measurement ?? 'kWh'}</div>` : ''}
            `}
          </div>
        ` : ''}

        <!-- ── 2.0 Hybrid Transport Controls (Google Home Layout) ── -->
        ${activeBackendSwitch || hybridSwitch ? html`
          <div class="gh-extra-chips" style="margin-top: 10px;">
            ${activeBackendSwitch ? html`
              ${(() => {
            const bInfo = this._getBackendInfo(activeBackendSwitch, a);
            const isAuto = hybridSwitch && (hybridSwitch.state === 'auto' || hybridSwitch.state === 'on');
            return html`
                  <div
                    class="gh-chip ${bInfo.isActive ? 'active' : ''} ${isAuto || isCleaning ? 'disabled' : ''}"
                    style="${isAuto ? 'opacity: 0.4; cursor: not-allowed;' : ''}"
                    title="${isAuto ? 'Primary connection method is managed automatically in Auto Failover mode' + bInfo.fallbackText : (isCleaning ? 'Backend cannot be switched while coil cleaning is active' : 'Click to toggle primary connection method' + bInfo.fallbackText)}"
                    @click=${() => {
                if (isAuto) {
                  this._showToast('Primary connection method is managed automatically in Auto Failover mode' + bInfo.fallbackText);
                } else if (isCleaning) {
                  this._showToast('Backend cannot be switched while coil cleaning is active');
                } else {
                  this._toggleSwitch(activeBackendSwitch.entity_id, activeBackendSwitch.state);
                }
              }}
                  >
                    <ha-icon icon="${bInfo.icon}"></ha-icon>
                    ${bInfo.label}
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
        ${showDiagnostics ? html`<div class="footer-telemetry-row">
          ${this._renderTransportPills(stateObj.attributes?.primary_backend, stateObj.attributes?.secondary_backend, localUdp, cloudMqtt, irBlaster)}
          ${controlSource && controlSource.state && controlSource.state !== 'unknown' && controlSource.state !== 'unavailable' ? html`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(controlSource.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(controlSource.state)}</span>
            </div>
          ` : ''}
          ${this._renderDiagTelemetryPills(compFreq, evapTemp, condTemp, voltage, current)}
          ${rssi ? html`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${rssi.state} ${rssi.attributes.unit_of_measurement ?? 'dBm'}</span>
            </div>
          ` : ''}
        </div>` : ''}
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
    const coilSensor = this._findCompanionEntity(this._config.coil_cleaning_sensor, 'binary_sensor', ['coil_cleaning', 'coil_clean']);
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
  customElements.define('miraie-ac-card', class extends MirAIeACCard { });
}

const COMPANION_KEYS = [
  'room_temp_sensor',
  'humidity_sensor',
  'local_udp_sensor',
  'cloud_mqtt_sensor',
  'hybrid_submode_switch',
  'active_backend_switch',
  'ir_blaster_sensor',
  'control_source_sensor',
  'nanoe_switch',
  'display_switch',
  'coil_clean_button',
  'coil_cleaning_sensor',
  'filter_alert_sensor',
  'estimated_power_sensor',
  'energy_today_sensor',
  'energy_yesterday_sensor',
  'rssi_sensor',
  'compressor_frequency_sensor',
  'evaporator_coil_temp_sensor',
  'outdoor_condenser_temp_sensor',
  'voltage_sensor',
  'current_sensor',
];

@customElement('miraie-ac-card-in-editor')
export class MirAIeACCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: Record<string, any> = {};
  private _hydratedEntity: string = '';
  private _autoPopulatedKeys: Map<string, string> = new Map();
  private _userEditedKeys: Set<string> = new Set();

  public setConfig(config: MirAIeCardConfig): void {
    const nextCfg = { ...(config || {}) };
    if (this._hydratedEntity && nextCfg.entity === this._hydratedEntity) {
      for (const [k, autoVal] of this._autoPopulatedKeys.entries()) {
        if (nextCfg[k] !== autoVal) {
          this._autoPopulatedKeys.delete(k);
        }
      }
    }
    this._config = nextCfg;
    this._hydrateAutoDetected();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass')) {
      this._hydrateAutoDetected();
    }
  }

  private _hydrateAutoDetected(): void {
    const entity = this._config?.entity;
    if (!entity || !this.hass?.states || this._hydratedEntity === entity) return;
    const prevEntity = this._hydratedEntity;
    const isEntitySwitch = Boolean(prevEntity && prevEntity !== entity);
    this._hydratedEntity = entity;
    const discovered = discoverCompanionEntities(this.hass, entity);
    const next = { ...this._config };
    let changed = false;
    if (isEntitySwitch) {
      const prevDiscovered = discoverCompanionEntities(this.hass, prevEntity);
      for (const [k, autoVal] of this._autoPopulatedKeys.entries()) {
        if (next[k] === autoVal) {
          delete next[k];
          changed = true;
        }
      }
      for (const [k, prevVal] of Object.entries(prevDiscovered)) {
        if (!this._userEditedKeys.has(k) && next[k] === prevVal) {
          delete next[k];
          changed = true;
        }
      }
      this._autoPopulatedKeys.clear();
    }
    for (const [k, v] of Object.entries(discovered)) {
      if (!(k in next)) {
        next[k] = v;
        this._autoPopulatedKeys.set(k, v);
        changed = true;
      }
    }
    if (changed) {
      this._config = next;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: next }, bubbles: true, composed: true }));
    }
  }

  private _valueChanged = (ev: CustomEvent): void => {
    const incoming = { ...(ev.detail?.value || {}) };
    for (const k of COMPANION_KEYS) {
      if (k in incoming && incoming[k] == null) {
        incoming[k] = '';
        this._autoPopulatedKeys.delete(k);
        this._userEditedKeys.add(k);
      } else if (k in incoming && incoming[k] !== this._config[k]) {
        this._autoPopulatedKeys.delete(k);
        this._userEditedKeys.add(k);
      } else if (k in this._config && !(k in incoming)) {
        incoming[k] = '';
        this._autoPopulatedKeys.delete(k);
        this._userEditedKeys.add(k);
      }
    }
    this._config = incoming;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: incoming }, bubbles: true, composed: true }));
    this._hydrateAutoDetected();
  };

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    const form = MirAIeACCard.getConfigForm();
    const formData = { ...this._config };
    for (const k of COMPANION_KEYS) {
      if (formData[k] === '') delete formData[k];
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${formData}
        .schema=${form.schema}
        .computeLabel=${form.computeLabel}
        .computeHelper=${form.computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}
