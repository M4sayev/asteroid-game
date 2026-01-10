import { ControlsType, KeyName, PlayerNumber } from "../types/types.js";

export function playerSettingsTemplate(
  player: PlayerNumber,
  motionKeys: string,
  instructions: string
): string {
  return `
    <article>
        <h3 style="text-align: center">Player ${player}</h3>
        <div class="settings-player-section">
            <div aria-hidden="true" class="setting-player-keys">
            <div class="motion-keys">
                ${motionKeys}
            </div>
            <dl>
            ${instructions}
            </dl>
        </div>
    </article>
    `;
}

export function instructionItem(key: keyof ControlsType, value: KeyName) {
  return `<div class="instruction-item">
                <dt style="display: inline">'${value}'</dt>
                <dd style="display: inline">to move ${key}</dd>
            </div>`;
}
