import { css } from 'lit';

export const styles = css`
  /* ──────────────────────────────────────────────────────────
     Default Token Layer (Standard Home Assistant)
     ────────────────────────────────────────────────────────── */
  :host {
    --miraie-accent:        var(--primary-color, #f39c12);

    /* Surfaces - color-mix ensures deep contrast in both light & dark themes */
    --m-bg:                 var(--ha-card-background, var(--card-background-color, var(--lovelace-background)));
    --m-surface:            color-mix(in srgb, var(--primary-text-color, #000) 10%, var(--ha-card-background, var(--card-background-color, #fff)));
    --m-surface-hover:      color-mix(in srgb, var(--primary-text-color, #000) 18%, var(--m-surface));
    --m-border:             color-mix(in srgb, var(--primary-text-color, #000) 24%, transparent);

    /* Text */
    --m-text:               var(--primary-text-color, #111111);
    --m-text-2:             color-mix(in srgb, var(--primary-text-color, #000) 80%, transparent);
    --m-on-accent:          var(--text-primary-color, var(--m-bg));

    /* Active state */
    --m-active-bg:          color-mix(in srgb, var(--miraie-accent) 22%, var(--m-surface));
    --m-active-border:      color-mix(in srgb, var(--miraie-accent) 75%, transparent);
  }

  /* ──────────────────────────────────────────────────────────
     Material You Token Layer (Activated via Config)
     ────────────────────────────────────────────────────────── */
  :host([theme="material_you"]) {
    --miraie-accent:        var(--md-sys-color-primary, var(--primary-color, #f39c12));

    --m-bg:                 var(--md-sys-color-surface-variant, var(--md-sys-color-surface, var(--ha-card-background, var(--card-background-color, var(--lovelace-background)))));
    --m-surface:            var(--md-sys-color-surface, color-mix(in srgb, var(--primary-text-color, #000) 10%, var(--ha-card-background, var(--card-background-color, #fff))));
    --m-surface-hover:      color-mix(in srgb, var(--md-sys-color-on-surface, var(--m-text)) 18%, var(--m-surface));
    --m-border:             var(--md-sys-color-outline-variant, var(--md-sys-color-outline, color-mix(in srgb, var(--primary-text-color, #000) 24%, transparent)));

    /* Text */
    --m-text:               var(--md-sys-color-on-surface, var(--primary-text-color, #111111));
    --m-text-2:             var(--md-sys-color-on-surface-variant, color-mix(in srgb, var(--primary-text-color, #000) 80%, transparent));
    --m-on-accent:          var(--md-sys-color-on-primary, var(--text-primary-color, var(--m-bg)));

    /* Active state */
    --m-active-bg:          var(--md-sys-color-secondary-container, color-mix(in srgb, var(--miraie-accent) 22%, var(--m-surface)));
    --m-active-border:      var(--md-sys-color-secondary, color-mix(in srgb, var(--miraie-accent) 75%, transparent));
  }

  ha-card {
    background: var(--m-bg, var(--ha-card-background, var(--card-background-color, #1e1e24)));
    border-radius: 18px;
    padding: 20px 18px 18px;
    color: var(--m-text);
    font-family: inherit;
    overflow: hidden;
  }

  /* ── Header ── */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .header-left { display: flex; flex-direction: column; gap: 2px; }
  .title-row   { display: flex; align-items: center; gap: 8px; }

  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #e74c3c; flex-shrink: 0;
    transition: background 0.3s;
  }
  .status-dot.online {
    background: #2ecc71;
    box-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
  }

  .title   { font-size: 1.15rem; font-weight: 700; color: var(--m-text); line-height: 1.2; }
  .subtitle { font-size: 0.8rem; font-weight: 600; color: var(--m-text-2); }

  .collapse-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text-2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
  }
  .collapse-btn:hover { background: var(--m-surface-hover); color: var(--m-text); }

  .power-btn {
    width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--m-border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); --mdc-icon-size: 22px;
  }
  .power-btn:hover:not(:disabled):not(.disabled) { background: var(--m-surface-hover); }
  .power-btn.on { 
    background: var(--miraie-accent);
    border-color: var(--miraie-accent);
    color: var(--m-on-accent);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--miraie-accent) 40%, transparent);
  }
  .power-btn:disabled, .power-btn.disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── Temperature block ── */
  .temp-block {
    background: var(--m-surface); border: 1.5px solid var(--m-border);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
  }
  .temp-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--m-border);
    background: var(--m-bg); color: var(--m-text); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; --mdc-icon-size: 20px;
  }
  .temp-btn:hover:not(:disabled):not(.disabled) { background: var(--m-surface-hover); }
  .temp-btn:disabled, .temp-btn.disabled { opacity: 0.55; cursor: not-allowed; }
  .temp-center { text-align: center; }
  .temp-value  { font-size: 2rem; font-weight: 800; letter-spacing: -1px; color: var(--m-text); }
  .temp-meta {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-top: 8px;
  }
  .temp-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.95rem; font-weight: 600; color: var(--m-text);
  }
  .temp-meta-item ha-icon { --mdc-icon-size: 16px; color: var(--m-text-2); }

  /* ── Generic section ── */
  .section { margin-bottom: 22px; }
  .section-title {
    font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--m-text); opacity: 0.9; margin-bottom: 8px;
  }

  /* ── Connection Controls & Status ── */
  .connection-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .connection-switches {
    flex: 1;
  }
  .connection-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    color: var(--m-text-2);
    background: transparent;
    border: none;
    padding: 0;
    --mdc-icon-size: 14px;
  }

  /* ── 2.0 Transport Status Strip ── */
  .transport-strip {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--m-surface); border: 1px solid var(--m-border);
    border-radius: 12px; padding: 4px; gap: 4px;
  }
  .transport-item {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 6px; border-radius: 8px; border: none; background: transparent;
    color: var(--m-text); font-size: 0.78rem; font-weight: 700; cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.18s ease; --mdc-icon-size: 15px;
  }
  .transport-item:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
  }
  .transport-item.active {
    background: var(--miraie-accent);
    color: var(--m-on-accent); font-weight: 800;
    box-shadow: 0 0 16px color-mix(in srgb, var(--miraie-accent) 55%, transparent), 0 2px 8px color-mix(in srgb, var(--miraie-accent) 35%, transparent);
  }
  .transport-item:disabled, .transport-item.disabled {
    opacity: 0.5; cursor: not-allowed;
  }

  /* ── Segmented Control Bar (Modes & Presets) ── */
  .segmented-bar {
    display: flex; align-items: center;
    background: var(--m-surface); border: 1px solid var(--m-border);
    border-radius: 12px; padding: 4px; gap: 4px;
  }
  .segmented-item {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 8px; border-radius: 8px; border: none; background: transparent;
    color: var(--m-text-2); font-size: 0.82rem; font-weight: 700; cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.2s ease; --mdc-icon-size: 16px;
  }
  .segmented-item:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover); color: var(--m-text);
  }
  .segmented-item.active {
    background: var(--miraie-accent);
    color: var(--m-on-accent); font-weight: 800;
    box-shadow: 0 0 16px color-mix(in srgb, var(--miraie-accent) 55%, transparent), 0 2px 8px color-mix(in srgb, var(--miraie-accent) 35%, transparent);
  }
  .segmented-item:disabled, .segmented-item.disabled {
    opacity: 0.45; cursor: not-allowed;
  }

  /* ── Fan & Swing Setting Tiles ── */
  .setting-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(85px, 1fr));
    gap: 8px;
  }
  .setting-tile {
    display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between;
    padding: 10px 12px; border-radius: 12px;
    border: 1px solid var(--m-border); background: var(--m-surface);
    cursor: pointer; transition: all 0.18s ease; text-align: left; min-width: 0;
  }
  .setting-tile:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
    border-color: color-mix(in srgb, var(--miraie-accent) 40%, var(--m-border));
  }
  .setting-tile.active {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
  }
  .setting-tile:disabled, .setting-tile.disabled {
    opacity: 0.5; cursor: not-allowed;
  }
  .setting-tile-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--m-text-2);
  }
  .setting-tile-label ha-icon { --mdc-icon-size: 13px; color: var(--m-text-2); }
  .setting-tile-value-row {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    margin-top: 6px;
  }
  .setting-tile-value {
    font-size: 0.92rem; font-weight: 800; color: var(--m-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .setting-tile-chevron {
    --mdc-icon-size: 14px; color: var(--m-text-2);
    transition: transform 0.2s ease; flex-shrink: 0;
  }
  .setting-tile.active .setting-tile-chevron {
    transform: rotate(180deg);
    color: var(--miraie-accent);
  }

  /* ── Action Buttons / Pills ── */
  .pills {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 8px;
  }
  .pill {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 8px; border-radius: 12px;
    border: 1px solid var(--m-border);
    background: var(--m-surface); color: var(--m-text);
    font-size: 0.82rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.18s ease; --mdc-icon-size: 15px;
  }
  .pill:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
    border-color: color-mix(in srgb, var(--miraie-accent) 40%, var(--m-border));
  }
  .pill.active {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
    color: color-mix(in srgb, var(--miraie-accent) 85%, #000);
    font-weight: 800;
  }
  .pill:disabled, .pill.disabled {
    opacity: 0.55;
    cursor: not-allowed;
    color: color-mix(in srgb, var(--m-text) 65%, transparent);
    background: color-mix(in srgb, var(--primary-text-color, #000) 4%, var(--m-surface));
    border-color: color-mix(in srgb, var(--primary-text-color, #000) 14%, transparent);
  }
  .pill.active:disabled, .pill.active.disabled,
  .gh-chip.active[style*="not-allowed"] {
    opacity: 0.8;
    cursor: not-allowed;
    background: color-mix(in srgb, var(--miraie-accent) 18%, var(--m-surface));
    border-color: color-mix(in srgb, var(--miraie-accent) 55%, transparent);
    color: color-mix(in srgb, var(--miraie-accent) 85%, #000);
  }

  @media (max-width: 450px) {
    .connection-status-pill { padding: 8px 8px; font-size: 0.72rem; gap: 4px; border-radius: 10px; }
    .connection-status-pill ha-icon { --mdc-icon-size: 13px; }
    .transport-item { padding: 7px 4px; font-size: 0.72rem; gap: 3px; }
    .transport-item ha-icon { --mdc-icon-size: 13px; }
    .segmented-item { padding: 8px 4px; font-size: 0.76rem; gap: 4px; }
    .segmented-item ha-icon { --mdc-icon-size: 14px; }
    .setting-tile { padding: 8px 10px; }
    .setting-tile-value { font-size: 0.85rem; }
    .pills {
      gap: 6px;
      grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
    }
    .pill { padding: 8px 4px; font-size: 0.74rem; gap: 4px; border-radius: 10px; }
    .pill ha-icon { --mdc-icon-size: 13px; flex-shrink: 0; }
  }

  /* ── Picker panel (fan / swing) ── */
  .picker-panel {
    margin-top: 8px; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 14px; display: flex; flex-wrap: wrap; gap: 8px;
    animation: slideDown 0.15s ease;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .picker-opt {
    padding: 8px 16px; border-radius: 16px;
    border: 1px solid var(--m-border);
    background: transparent; color: var(--m-text-2);
    font-size: 0.85rem; cursor: pointer; transition: all 0.15s;
  }
  .picker-opt:hover { background: var(--m-surface-hover); }
  .picker-opt.sel {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
    color: var(--miraie-accent); font-weight: 600;
  }

  /* ── Step slider (Convertible mode) ── */
  .step-slider-wrap {
    margin-top: 8px; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 16px 16px 12px;
    animation: slideDown 0.15s ease;
  }
  .step-slider-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 18px;
  }
  .step-slider-title { font-size: 0.82rem; font-weight: 600; }
  .step-slider-val { font-size: 0.9rem; font-weight: 800; color: var(--miraie-accent); }
  .step-track-outer {
    position: relative; height: 4px; margin: 16px 6px 28px;
  }
  .step-track-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--m-border); border-radius: 2px;
  }
  .step-track-fill {
    height: 100%; background: var(--miraie-accent); border-radius: 2px;
    transition: width 0.3s ease;
  }
  .step-notches {
    position: absolute; top: -4px; left: 0; width: 100%; height: 12px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .notch-wrapper {
    position: relative; display: flex; justify-content: center; width: 12px; height: 12px;
  }
  .step-notch {
    width: 12px; height: 12px; border-radius: 50%; padding: 0;
    background: var(--m-surface-hover); border: 2px solid var(--m-border);
    cursor: pointer; transition: all 0.2s;
  }
  .step-notch:hover:not(:disabled) { transform: scale(1.3); }
  .step-notch.filled { background: var(--miraie-accent); border-color: var(--miraie-accent); }
  .step-notch.current {
    transform: scale(1.4); background: var(--miraie-accent);
    border-color: var(--m-surface); box-shadow: 0 0 0 1px var(--miraie-accent);
  }
  .step-notch:disabled { cursor: not-allowed; opacity: 0.4; }
  
  .notch-label {
    position: absolute; top: 16px; font-size: 0.65rem; color: var(--m-text-2); font-weight: 600;
  }
  .notch-label.current { color: var(--miraie-accent); font-weight: 700; }
  .step-label { font-size: 0.65rem; color: var(--m-text-2); }

  /* ── Toggle Cards (controls) ── */
  .toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .toggle-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; border-radius: 14px;
    border: 1px solid var(--m-border); background: var(--m-surface);
    cursor: pointer; transition: background 0.15s;
    overflow: hidden;
  }
  .toggle-card:hover:not(.disabled) { background: var(--m-surface-hover); }
  .toggle-card.disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
  .toggle-card ha-switch { pointer-events: none; }
  .toggle-left { display: flex; align-items: center; gap: 9px; }
  .toggle-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: var(--m-surface-hover); color: var(--m-text-2);
    --mdc-icon-size: 17px;
  }
  .toggle-icon.active { background: var(--m-active-bg); color: var(--miraie-accent); }
  .toggle-label { font-size: 0.8rem; }
  .toggle-action { --mdc-icon-size: 18px; color: var(--m-text-2); margin-right: 2px; }

  /* ── Filter Alert Banner ── */
  .alert-banner {
    border-radius: 14px; border: 1px solid rgba(244,67,54,0.35);
    background: rgba(244,67,54,0.06); padding: 12px 14px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .alert-left { display: flex; align-items: center; gap: 9px; }
  .alert-icon { color: var(--error-color, #f44336); --mdc-icon-size: 20px; }
  .alert-text { font-size: 0.82rem; font-weight: 700; color: var(--error-color, #f44336); }
  .alert-hint { font-size: 0.72rem; color: var(--error-color, #f44336); }

  /* ── Energy Cards ── */
  .energy-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .energy-card {
    flex: 1; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 12px 14px; cursor: pointer; transition: background 0.15s;
  }
  .energy-card:hover { background: var(--m-surface-hover); }
  .energy-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 600; color: var(--m-text-2);
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
  }
  .energy-label ha-icon { --mdc-icon-size: 14px; color: var(--miraie-accent); }
  .energy-value-row { display: flex; align-items: baseline; gap: 4px; }
  .energy-value { font-size: 1.4rem; font-weight: 800; }
  .energy-unit  { font-size: 0.75rem; color: var(--m-text-2); }

  /* ── Footer ── */
  .footer {
    display: flex; align-items: center; justify-content: center;
    gap: 5px; padding-top: 12px; border-top: 1px solid var(--m-border);
    margin-top: 6px; font-size: 0.72rem; color: var(--m-text-2);
  }
  .footer ha-icon { --mdc-icon-size: 13px; }

  /* ── Error ── */
  .error { padding: 20px; color: var(--error-color, #f44336); text-align: center; font-size: 0.85rem; }

  /* ──────────────────────────────────────────────────────────
     Compact View (Google Home Style)
     ────────────────────────────────────────────────────────── */
  /* ── Compact Views: Classic vs Google Home ── */
  .compact-card {
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Classic Compact */
  .compact-card.classic {
    border-radius: 16px;
    border: 1px solid var(--m-border);
    background: var(--m-bg);
    padding: 16px;
  }
  .compact-card.classic .compact-icon-btn {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s ease; flex-shrink: 0;
  }
  .compact-card.classic .compact-icon-btn.on {
    background: var(--miraie-accent);
    color: var(--m-on-accent, #ffffff);
    border-color: var(--miraie-accent);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--miraie-accent) 40%, transparent);
  }
  .compact-card.classic .compact-action-btn {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s ease;
  }
  .compact-card.classic .compact-value {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--m-text);
  }

  /* Google Home Compact */
  .compact-card.google-home {
    background: var(--m-bg);
    border-radius: 28px;
    border: none;
    box-shadow: none;
    padding: 16px;
  }
  .compact-card.google-home .compact-icon-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: rgba(128, 128, 128, 0.15); color: var(--m-text-2);
    transition: all 0.2s ease; flex-shrink: 0;
  }
  .compact-card.google-home .compact-icon-btn.on {
    background: var(--m-active-bg);
    color: var(--miraie-accent);
  }
  .compact-card.google-home .compact-action-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: rgba(128, 128, 128, 0.15); color: var(--m-text);
    transition: all 0.2s ease;
  }
  .compact-card.google-home .compact-value {
    font-size: 2.5rem;
    font-weight: 400;
    color: var(--m-text);
  }

  .compact-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .compact-title {
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--m-text);
  }
  .compact-chevron {
    color: var(--m-text-2);
    opacity: 0.7;
  }
  .compact-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .compact-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }
  .compact-icon-btn:hover { background: var(--m-surface-hover); }
  .compact-icon-btn.disabled { opacity: 0.4; cursor: not-allowed; }
  .compact-action-btn:hover { background: var(--m-surface-hover); }
  .compact-action-btn:disabled, .compact-action-btn.disabled { opacity: 0.3; cursor: not-allowed; }
  .compact-subtitle {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--m-text-2);
  }

  /* ──────────────────────────────────────────────────────────
     Google Home Full View
     ────────────────────────────────────────────────────────── */
  .gh-full-card {
    background: var(--m-bg);
    border-radius: 28px;
    border: none;
    box-shadow: none;
    padding: 16px;
    box-sizing: border-box;
  }
  .gh-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
  }
  .gh-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .gh-icon {
    color: var(--m-text-2);
    --mdc-icon-size: 20px;
  }
  .gh-title {
    font-weight: 500;
    font-size: 1.05rem;
    color: var(--m-text);
  }
  .gh-power-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--m-text-2);
    cursor: pointer;
    transition: 0.2s;
    outline: none;
  }
  .gh-power-btn:hover {
    background: rgba(128, 128, 128, 0.15);
  }
  .gh-power-btn.on {
    background: var(--m-active-bg);
    color: var(--miraie-accent);
  }
  .gh-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 0 16px 0;
  }
  .gh-value-large {
    font-size: 5rem;
    font-weight: 400;
    line-height: 1.1;
    color: var(--m-text);
  }
  .gh-subtitle-large {
    font-size: 1rem;
    font-weight: 500;
    color: var(--m-text-2);
    margin-top: 8px;
  }
  .gh-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--m-text);
    letter-spacing: 0.02em;
  }
  .gh-action-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }
  .gh-circular-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.15);
    border: none;
    color: var(--m-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    --mdc-icon-size: 32px;
  }
  .gh-circular-btn:hover {
    background: rgba(128, 128, 128, 0.25);
  }
  .gh-circular-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .gh-select-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 8px;
  }
  .gh-select-wrapper {
    flex: 1 1 calc(33.33% - 8px);
    min-width: 120px;
    position: relative;
  }
  .gh-select-wrapper.active {
    z-index: 100;
  }
  .gh-custom-select {
    width: 100%;
    background: rgba(128, 128, 128, 0.15);
    border-radius: 20px;
    border: none;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0 16px;
    color: var(--m-text);
    font-size: 0.95rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .gh-custom-select span,
  .gh-custom-select ha-icon {
    pointer-events: none;
  }
  .gh-custom-select ha-icon {
    color: var(--m-text-2);
    --mdc-icon-size: 20px;
  }
  .gh-dropdown-menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    min-width: 100%;
    width: max-content;
    max-width: 240px;
    background: var(--card-background-color, #1e1e2e);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 16px;
    overflow: hidden;
    z-index: 20;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    display: flex;
    flex-direction: column;
    padding: 4px;
    gap: 2px;
  }
  .gh-dropdown-item {
    width: 100%;
    text-align: left;
    border: none;
    border-radius: 12px;
    background: transparent;
    font-family: inherit;
    padding: 10px 14px;
    font-size: 0.92rem;
    color: var(--m-text, var(--primary-text-color));
    transition: 0.15s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    --mdc-icon-size: 16px;
    -webkit-tap-highlight-color: transparent;
  }
  .gh-dropdown-item:hover {
    background: rgba(128, 128, 128, 0.18);
  }
  .gh-dropdown-item.active {
    color: var(--miraie-accent);
    background: color-mix(in srgb, var(--miraie-accent) 18%, transparent);
    font-weight: 600;
  }
  .gh-extra-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding-top: 16px;
  }
  .gh-footer-text {
    text-align: center;
    font-size: 0.75rem;
    color: var(--m-text-2);
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    opacity: 0.6;
    --mdc-icon-size: 14px;
  }
  .gh-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid rgba(128, 128, 128, 0.22);
    background: rgba(128, 128, 128, 0.12);
    color: var(--m-text-2, var(--secondary-text-color));
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
    --mdc-icon-size: 16px;
  }
  .gh-chip:hover {
    background: rgba(128, 128, 128, 0.24);
  }
  .gh-chip.active {
    color: var(--miraie-accent);
    background: color-mix(in srgb, var(--miraie-accent) 18%, transparent);
    border-color: color-mix(in srgb, var(--miraie-accent) 45%, transparent);
    font-weight: 600;
  }
  .gh-chip.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .gh-chip-text {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 16px;
    background: rgba(128, 128, 128, 0.15);
    color: var(--m-text-2);
    font-size: 0.8rem;
    --mdc-icon-size: 16px;
  }
  .footer-telemetry-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--m-border);
    font-size: 0.76rem;
    color: var(--m-text-2);
    flex-wrap: wrap;
  }
  .connection-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    color: var(--m-text-2);
  }
  .m3-slider-wrap {
    width: 100%;
    padding: 4px 12px 12px;
    box-sizing: border-box;
  }
  .m3-temp-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 36px;
    border-radius: 18px;
    background: color-mix(in srgb, var(--m-accent, var(--primary-color, #4f8ef7)) 18%, var(--m-surface-hover, rgba(128, 128, 128, 0.16)));
    outline: none;
    cursor: pointer;
    overflow: hidden;
  }
  .m3-temp-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 36px;
    border-radius: 5px;
    background: var(--m-accent, var(--primary-color, #4f8ef7));
    box-shadow: -400px 0 0 395px color-mix(in srgb, var(--m-accent, var(--primary-color, #4f8ef7)) 42%, transparent);
    cursor: pointer;
  }
  .m3-temp-slider:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
