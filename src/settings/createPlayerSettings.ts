import {
  PLAYER_ONE_CONTROLS,
  PLAYER_TWO_CONTROLS,
} from "../constants/constants";
import { playerTwoKeysMap } from "../mappers/mappers";
import { border } from "../template/reusable";
import { instructionItem, playerSettingsTemplate } from "../template/settings";
import { ControlsType, KeyName } from "../types/types";
import { camelToNormal } from "../utils/utils";

type ControlKeyType = [keyof ControlsType, KeyName];

export function createPlayerSettingSection(): string {
  let motionKeys = "";
  let instructions = "";
  let settings = "";

  motionKeys += `<span class="control-span">${PLAYER_ONE_CONTROLS["up"]} ${border}</span>`;
  motionKeys += `<div><div class="control-span-group">`;

  for (const [key, value] of Object.entries(
    PLAYER_ONE_CONTROLS
  ) as ControlKeyType[]) {
    if (key !== "up" && key !== "shoot")
      motionKeys += `<span class="control-span">${value} ${border}</span>`;
    instructions += instructionItem(key, value);
  }
  motionKeys += `</div></div></div><span class="control-span">${PLAYER_ONE_CONTROLS["shoot"]}${border}</span>`;
  settings += playerSettingsTemplate("one", motionKeys, instructions);

  motionKeys = "";
  instructions = "";

  motionKeys += `<span class="control-span">${
    playerTwoKeysMap[PLAYER_TWO_CONTROLS["up"]]
  } ${border}</span>`;
  motionKeys += `<div><div class="control-span-group">`;

  for (const [key, value] of Object.entries(
    PLAYER_TWO_CONTROLS
  ) as ControlKeyType[]) {
    if (key !== "up" && key !== "shoot") {
      motionKeys += `<span class="control-span">${playerTwoKeysMap[value]} ${border}</span>`;
    }
    instructions += instructionItem(key, camelToNormal(value) as KeyName);
  }
  motionKeys += `</div></div></div><span class="control-span">${
    playerTwoKeysMap[PLAYER_TWO_CONTROLS["shoot"]]
  }${border}</span>`;
  settings += playerSettingsTemplate("two", motionKeys, instructions);

  return settings;
}
