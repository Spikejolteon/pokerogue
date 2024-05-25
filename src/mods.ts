import * as Utils from "./utils";
import BattleScene, { starterColors} from "./battle-scene";
import PokemonSpecies, { getPokemonSpecies, speciesStarters } from "./data/pokemon-species";
import { Stat, getStatName as getDataStatName } from "./data/pokemon-stat";
import { PlayerPokemon, PokemonMove } from "./field/pokemon";
import { Mode } from "./ui/ui";
import i18next from "i18next";
import StarterSelectUiHandler from "./ui/starter-select-ui-handler";
import { speciesEggMoves } from "./data/egg-moves";
import { allMoves } from "./data/move";
import { AbilityAttr, DexAttr } from "./system/game-data";
import { Species } from "./data/enums/species";
import { TextStyle, addTextObject } from './ui/text';
import { WeatherType } from "./data/weather";
import { allAbilities } from "./data/ability";
import { Moves } from "./data/enums/moves";
import { LevelMoves } from "./data/pokemon-level-moves";

/** 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * HOW TO USE THIS FILE:
 * Place this file into your "pokerogue/src" folder
 * 
 * A modification will start with a description of what it does: e.g. "Increases chance for all wild encounters AND hatched eggs to have their Hidden ability by 2^n"
 * Then it will continue with what file you need to change something in: e.g. "-- In pokemon.ts --"
 * It will continue with what you should do. Either "change to" (meaning you should replace the following lines of code) or "after add" (meaning you should copy and paste after the following lines WITHOUT DELETING ANY EXISTING CODE)
 *      and give you a line (note as the game updates these lines will quickly become outdated, so I HIGHLY recomend just searching for the code snippets I provide right underneath the add/replace line):
 *      e.g. "after (line 120)"
 * Then a code snippet which you can "Ctrl + f" for (one line at a time): e.g.
 *       if (!this.hasTrainer())
 *          this.scene.applyModifiers(HiddenAbilityRateBoosterModifier, true, hiddenAbilityChance);
 * Followed by the second part of the "what you should do" operation: e.g. "add"
 * And lastly the new code you should add/replace existing code with: e.g.
 *      Mods.applyHiddenAbilityModifier(hiddenAbilityChance);
 * 
 * 
 * If something is in a class (e.g. the "export class Weather") then you need to add ALL the described code snippets for it to work
 * If youre adding multiple modifications to the same file make sure you only have "import * as Mods from "./mods";" once
 * If you followed the instructions correctly the feature should now be modified. Just restart your server and youre good to go.
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */ 


/**
 * Enable the map in endless
 * -- In modifier/modifier-type.ts --
 *  change (line 1042):
 *      new WeightedModifierType(modifierTypes.MAP, (party: Pokemon[]) => party[0].scene.gameMode.isClassic ? 1 : 0, 1),
 *  to
 *      new WeightedModifierType(modifierTypes.MAP, (party: Pokemon[]) => party[0].scene.gameMode.isClassic ? 1 : 1, 1),
 * 
 * (if you want to make the map more common increase the last 2 numbers)
 */
export function enableMapInEndless() {}


/**
 * Enable pokemon remembering already unlocked egg moves via Memory Mushroom:
 * -- In field/pokemon.ts: --
 *  change (line 745):
 *      return this.getLevelMoves(1, true).map(lm => lm[1]).filter(lm => !this.moveset.filter(m => m.moveId === lm).length).filter((move: Moves, i: integer, array: Moves[]) => array.indexOf(move) === i);
 *  to 
 *      return Mods.getLearnableMoves(this.scene, this.species, this.fusionSpecies, this.moveset, this.getLevelMoves(1, true));
 */
export function getLearnableMoves(scene: BattleScene, species: PokemonSpecies, fusionSpecies: PokemonSpecies, moveset: PokemonMove[], levelMoves: LevelMoves): Moves[] {
    let learnableMoves = levelMoves.map(lm => lm[1]).filter(lm => !moveset.filter(m => m.moveId === lm).length).filter((move: Moves, i: integer, array: Moves[]) => array.indexOf(move) === i);
    const isFusionSpecies = fusionSpecies ? 1 : 0;
    for(let speciesIndex = 0; speciesIndex <= isFusionSpecies; speciesIndex++){
        let speciesId = speciesIndex < 1 ? species.getRootSpeciesId() : fusionSpecies.getRootSpeciesId();
        for (let moveIndex = 0; moveIndex < 4; moveIndex++) {
            if(scene.gameData.starterData[speciesId].eggMoves & Math.pow(2, moveIndex) && 
            (moveset.filter(m => m.moveId != speciesEggMoves[species.getRootSpeciesId()][moveIndex]).length == moveset.length)){
        
                learnableMoves[learnableMoves.length] = (speciesEggMoves[speciesId][moveIndex]);
        }
      }
    }
    return learnableMoves;
}


/**
 * Increases chance for all wild encounters AND hatched eggs to have their Hidden ability by 2^2 (4)
 * -- In field/pokemon.ts: --
 *  after (line 120):
 *      if (!this.hasTrainer())
 *          this.scene.applyModifiers(HiddenAbilityRateBoosterModifier, true, hiddenAbilityChance);
 *  add
 *      hiddenAbilityChance.value = hiddenAbilityChance.value * Math.pow(2, -2);
 * 
 *  after (line 1129):
 *      if (!this.hasTrainer())
 *          this.scene.applyModifiers(HiddenAbilityRateBoosterModifier, true, hiddenAbilityChance);
 *  add
 *      hiddenAbilityChance.value = hiddenAbilityChance.value * Math.pow(2, -2);
 * 
 * (replace the -2 with any (NEGATIVE!) number you want to increase the shiny chance by 2^n)
 */
export function applyHiddenAbilityModifier(chance: Utils.IntegerHolder) {}

/**
 * Increases chance for all wild encounters AND hatched eggs to be Shiny by 2^2 (4)
 * -- In field/pokemon.ts: --
 *  after (line 1103):
 *      if (!this.hasTrainer())
 *          this.scene.applyModifiers(ShinyRateBoosterModifier, true, shinyThreshold);
 *      } else
 *          shinyThreshold.value = thresholdOverride;
 *  add
 *      shinyThreshold.value = shinyThreshold.value * Math.pow(2, 2);
 * 
 * (replace the second 2 with any number you want to increase the shiny chance by 2^n)
 */
export function applyShinyModifier() {}

/**
 * Makes all Egg Moves equally likely on a hatched egg
 * -- In egg-hatch-phase.ts --
 *  after (line 1)
 *      import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
 *  add
 *      import * as Mods from "./mods";
 * 
 *  after (line 431)
 *      this.eggMoveIndex = Utils.randSeedInt(baseChance * Math.pow(2, 3 - this.egg.tier))
 *          ? Utils.randSeedInt(3)
 *          : 3;
 *  add
 *      this.eggMoveIndex = Mods.eggMoveIndexOverwrite();
 */
export function eggMoveIndexOverwrite(): integer {
    return Math.floor((Math.random()*4)-0.001);
}

/**
 * Overwrite how many waves it takes for an Egg to hatch
 * -- In data/egg.ts --
 *  after (line):
 *      export function getEggTierDefaultHatchWaves(tier: EggTier): integer {
 *  add:
 *      return 1;
 * 
 * (you can change the 1 to whatever value you want. If you would like to still have different wave counts for eggs, edit the switch statement in the egg.ts file WITHOUT adding the "return 1;")
 */
export function getEggOverwriteHatchWaves(): integer {}

/**
 * Makes Golden Egg Vouchers infinite
 * -- In ui/egg-gacha-ui-handler.ts --
 *  change (line 571):
 *      if (!this.scene.gameData.voucherCounts[VoucherType.GOLDEN]) {
 *  to
 *      if (false) {
 */
export function inifiniteGoldenVouchers(){}

/**
 * Overwrite the cost limit for starters in Endless or Classic
 * -- In ui/starter-select-ui-handler.ts --
 *  change (line 1182):
 *      getValueLimit(): integer {
 *          switch (this.gameMode) {
 *              case GameModes.ENDLESS:
 *              case GameModes.SPLICED_ENDLESS:
 *                  return 15;
 *              default:
 *                  return 10;
 *          }
 *      }
 *  to
 *      getValueLimit(): integer {
 *          switch (this.gameMode) {
 *              case GameModes.ENDLESS:
 *              case GameModes.SPLICED_ENDLESS:
 *                  return NEW-VALUE; //<--- REPLACE NEW-VALUE WITH A NUMBER OF YOUR CHOICE
 *              default:
 *                  return NEW-VALUE; //<--- REPLACE NEW-VALUE WITH A NUMBER OF YOUR CHOICE
 *          }
 *      }
 */
export function getStarterValueLimitOverwrite(){}

/**
 * Skips the Egg Shaking animation and speeds up the Hatching process
 * 
 * -- In egg-hatch-phase.ts --
 *  after (line 1):
 *      import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
 *  add
 *      import * as Mods from "./mods";
 * 
 *  after (line 118):
 *      pokemon.loadAssets().then(() => {
 *  add
 *      return Mods.fastHatchAnimation(this.scene, pokemon, this.eggMoveIndex, this.eggContainer, this.pokemonSprite, this.pokemonShinySparkle).then(() => this.end());
 */
export function fastHatchAnimation(scene :BattleScene, pokemon: PlayerPokemon, eggMoveIndex: integer, 
    eggContainer: Phaser.GameObjects.Container, pokemonSprite: Phaser.GameObjects.Sprite, pokemonShinySparkle: Phaser.GameObjects.Sprite): Promise<void> {

    return new Promise(resolve => {
        revealHatchSprite(scene, pokemon, eggContainer, pokemonSprite, pokemonShinySparkle);
        scene.ui.showText(`${pokemon.name} hatched from the egg!`, null, () => {
            scene.gameData.updateSpeciesDexIvs(pokemon.species.speciesId, pokemon.ivs);
            scene.gameData.setPokemonCaught(pokemon, true, true).then(() => {
            scene.gameData.setEggMoveUnlocked(pokemon.species, eggMoveIndex).then(() => {
                scene.ui.showText(null, 0);
            }).then(() => resolve());
            });
            }, null, true, null);
    });
}

/**
 * Adds a UI in the starter-select ui to unlock Egg Moves for candy
 * Original implementation from Futaba (skrftb) on discord!
 * 
 * -- In ui/starter-select-ui-handler.ts --
 *  after (line 1):
 *      import { pokemonPrevolutions } from "#app/data/pokemon-evolutions";
 *  add
 *      import * as Mods from "../mods";
 * 
 *  after (line 963):
 *      if (valueReduction < 2) {
 *          const reductionCost = getValueReductionCandyCounts(speciesStarters[this.lastSpecies.speciesId])[valueReduction];
 *          options.push({
 *          label: `x${reductionCost} ${i18next.t("starterSelectUiHandler:reduceCost")}`,
 *          handler: () => {
 *              if (candyCount >= reductionCost) {
 *                  starterData.valueReduction++;
 *                  starterData.candyCount -= reductionCost;
 *                  this.pokemonCandyCountText.setText(`x${starterData.candyCount}`);
 *                  this.scene.gameData.saveSystem().then(success => {
 *                      if (!success)
 *                          return this.scene.reset(true);
 *                      });
 *                      this.updateStarterValueLabel(this.cursor);
 *                      this.tryUpdateValue(0);
 *                      ui.setMode(Mode.STARTER_SELECT);
 *                      this.scene.playSound('buy');
 *                      return true;
 *                  }
 *                  return false;
 *              },
 *              item: 'candy',
 *              itemArgs: starterColors[this.lastSpecies.speciesId]
 *          });
 *      }
 *  add
 *      options.push({
 *          label: "Unlock Egg Moves",
 *          handler: () => {
 *              ui.setMode(Mode.STARTER_SELECT).then(() => Mods.showEggMovesUnlock(this.scene, ui, this.lastSpecies, candyCount, this, this.pokemonCandyCountText));
 *              return true;
 *          }
 *      });
 * 
 * 
 * (if you want to change the price go down to "unlockEggMovePrice" and change the 1 of the "modifier = modifier? modifier : 1;" line to something smaller (e.g. 0.5))
 */
export function showEggMovesUnlock(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, candyCount: any, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text){
    const options = [];

    for (let index = 0; index < 4; index++) {
        const eggMoveUnlocked = scene.gameData.starterData[lastSpecies.speciesId].eggMoves & Math.pow(2, index);
        if(!eggMoveUnlocked){
            options.push({
                label: `x${unlockEggMovePrice(index, lastSpecies)} Unlock ${getEggMoveName(lastSpecies, index)}`,
                handler: () => {
                    if (candyCount >= unlockEggMovePrice(index, lastSpecies)) {
                        unlockEggMove(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, index);
                    }
                    return false;
                },
            item: 'candy',
            itemArgs: starterColors[lastSpecies.speciesId]
            });
        }
    }

    options.push({
        label: i18next.t("menu:cancel"),
        handler: () => {
            ui.setMode(Mode.STARTER_SELECT);
            return true;
        }
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: options,
        yOffset: 47
    });
}

/**
 * Adds a UI in the starter-select ui to unlock Shinies for candy
 * Original implementation from Futaba (skrftb) on discord!
 * 
 * -- In ui/starter-select-ui-handler.ts --
 *  after (line 1):
 *      import { pokemonPrevolutions } from "#app/data/pokemon-evolutions";
 *  add
 *      import * as Mods from "../mods";
 * 
 *  after (line 963):
 *      if (valueReduction < 2) {
 *          const reductionCost = getValueReductionCandyCounts(speciesStarters[this.lastSpecies.speciesId])[valueReduction];
 *          options.push({
 *          label: `x${reductionCost} ${i18next.t("starterSelectUiHandler:reduceCost")}`,
 *          handler: () => {
 *              if (candyCount >= reductionCost) {
 *                  starterData.valueReduction++;
 *                  starterData.candyCount -= reductionCost;
 *                  this.pokemonCandyCountText.setText(`x${starterData.candyCount}`);
 *                  this.scene.gameData.saveSystem().then(success => {
 *                      if (!success)
 *                          return this.scene.reset(true);
 *                      });
 *                      this.updateStarterValueLabel(this.cursor);
 *                      this.tryUpdateValue(0);
 *                      ui.setMode(Mode.STARTER_SELECT);
 *                      this.scene.playSound('buy');
 *                      return true;
 *                  }
 *                  return false;
 *              },
 *              item: 'candy',
 *              itemArgs: starterColors[this.lastSpecies.speciesId]
 *          });
 *      }
 *  add
 *      options.push({
 *          label: "Unlock Shinies",
 *          handler: () => {
 *              ui.setMode(Mode.STARTER_SELECT).then(() => Mods.showShiniesUnlock(this.scene, ui, this.lastSpecies, candyCount, this, this.pokemonCandyCountText));
 *              return true;
 *          }
 *      });
 * 
 * 
 * (if you want to change the price go down to "unlockShinyPrice" and change the 1 of the "modifier = modifier? modifier : 1;" line to something smaller (e.g. 0.5))
 */
export function showShiniesUnlock(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, candyCount: any, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text){
    const options = [];

    for (let rarity = 1; rarity < 4; rarity++) {
        const shinyVariant = getShinyRarity(rarity);
        if(!(scene.gameData.dexData[lastSpecies.speciesId].caughtAttr & shinyVariant)){
            options.push({
                label: `x${unlockShinyPrice(rarity, lastSpecies)} Unlock ${getShinyRarityName(rarity)}`,
                handler: () => {
                    if (candyCount >= unlockShinyPrice(rarity, lastSpecies)) {
                        unlockShiny(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, rarity);
                    }
                    return false;
                },
            item: 'candy',
            itemArgs: starterColors[lastSpecies.speciesId]
            });
        }
    }

    options.push({
        label: i18next.t("menu:cancel"),
        handler: () => {
            ui.setMode(Mode.STARTER_SELECT);
            return true;
        }
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: options,
        yOffset: 47
    });
}

/**
 * Adds a UI in the starter-select ui to unlock Abilities for candy
 * 
 * -- In ui/starter-select-ui-handler.ts --
 *  after (line 1):
 *      import { pokemonPrevolutions } from "#app/data/pokemon-evolutions";
 *  add
 *      import * as Mods from "../mods";
 * 
 *  after (line 963):
 *      if (valueReduction < 2) {
 *          const reductionCost = getValueReductionCandyCounts(speciesStarters[this.lastSpecies.speciesId])[valueReduction];
 *          options.push({
 *          label: `x${reductionCost} ${i18next.t("starterSelectUiHandler:reduceCost")}`,
 *          handler: () => {
 *              if (candyCount >= reductionCost) {
 *                  starterData.valueReduction++;
 *                  starterData.candyCount -= reductionCost;
 *                  this.pokemonCandyCountText.setText(`x${starterData.candyCount}`);
 *                  this.scene.gameData.saveSystem().then(success => {
 *                      if (!success)
 *                          return this.scene.reset(true);
 *                      });
 *                      this.updateStarterValueLabel(this.cursor);
 *                      this.tryUpdateValue(0);
 *                      ui.setMode(Mode.STARTER_SELECT);
 *                      this.scene.playSound('buy');
 *                      return true;
 *                  }
 *                  return false;
 *              },
 *              item: 'candy',
 *              itemArgs: starterColors[this.lastSpecies.speciesId]
 *          });
 *      }
 *  add
 *      options.push({
 *          label: "Unlock Abilities",
 *          handler: () => {
 *              ui.setMode(Mode.STARTER_SELECT).then(() => Mods.showAbilityUnlock(this.scene, ui, this.lastSpecies, candyCount, this, this.pokemonCandyCountText));
 *              return true;
 *          }
 *      });
 * 
 * 
 * (if you want to change the price go down to "unlockAbilityPrice" and change the 1 of the "modifier = modifier? modifier : 1;" line to something smaller (e.g. 0.5))
 */
export function showAbilityUnlock(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, candyCount: any, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text){
    const options = [];
    const abilityAttr = scene.gameData.starterData[lastSpecies.speciesId].abilityAttr;
    
    let allAbilityAttr = [];
    switch(lastSpecies.getAbilityCount()){
        case(2):
            allAbilityAttr.push(AbilityAttr.ABILITY_HIDDEN);
            break;
        case(3):
            allAbilityAttr.push(AbilityAttr.ABILITY_HIDDEN);
            allAbilityAttr.push(AbilityAttr.ABILITY_2);
            break;
    }
    allAbilityAttr.push(AbilityAttr.ABILITY_1)

    const unlockedAbilityAttr = [ abilityAttr & AbilityAttr.ABILITY_1, (abilityAttr & AbilityAttr.ABILITY_2), abilityAttr & AbilityAttr.ABILITY_HIDDEN ].filter(a => a);
    const lockedAbilityAttr = allAbilityAttr.filter(item => !unlockedAbilityAttr.includes(item));

    for (let abilityIndex = 0; abilityIndex < lastSpecies.getAbilityCount(); abilityIndex++) {
        if(!(abilityAttr & unlockedAbilityAttr[abilityIndex])){
            let selectedAbility = lockedAbilityAttr.pop();
            options.push({
                label: `x${unlockAbilityPrice(selectedAbility, lastSpecies)} Unlock ${getAbilityName(selectedAbility, lastSpecies)}`,
                handler: () => {
                    if (candyCount >= 0) {
                        unlockAbility(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, selectedAbility);
                    }
                    return false;
                },
            item: 'candy',
            itemArgs: starterColors[lastSpecies.speciesId]
            });
        }
    }

    options.push({
        label: i18next.t("menu:cancel"),
        handler: () => {
            ui.setMode(Mode.STARTER_SELECT);
            return true;
        }
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: options,
        yOffset: 47
    });
}

/**
 * Adds a UI in the starter-select ui to improve IVs for candy
 * 
 * -- In ui/starter-select-ui-handler.ts --
 *  after (line 1):
 *      import { pokemonPrevolutions } from "#app/data/pokemon-evolutions";
 *  add
 *      import * as Mods from "../mods";
 * 
 *  after (line 963):
 *      if (valueReduction < 2) {
 *          const reductionCost = getValueReductionCandyCounts(speciesStarters[this.lastSpecies.speciesId])[valueReduction];
 *          options.push({
 *          label: `x${reductionCost} ${i18next.t("starterSelectUiHandler:reduceCost")}`,
 *          handler: () => {
 *              if (candyCount >= reductionCost) {
 *                  starterData.valueReduction++;
 *                  starterData.candyCount -= reductionCost;
 *                  this.pokemonCandyCountText.setText(`x${starterData.candyCount}`);
 *                  this.scene.gameData.saveSystem().then(success => {
 *                      if (!success)
 *                          return this.scene.reset(true);
 *                      });
 *                      this.updateStarterValueLabel(this.cursor);
 *                      this.tryUpdateValue(0);
 *                      ui.setMode(Mode.STARTER_SELECT);
 *                      this.scene.playSound('buy');
 *                      return true;
 *                  }
 *                  return false;
 *              },
 *              item: 'candy',
 *              itemArgs: starterColors[this.lastSpecies.speciesId]
 *          });
 *      }
 *  add
 *      options.push({
 *          label: "Improve IVs",
 *          handler: () => {
 *              ui.setMode(Mode.STARTER_SELECT).then(() => Mods.showIVsUnlock(this.scene, ui, this.lastSpecies, candyCount, this, this.pokemonCandyCountText));
 *              return true;
 *          }
 *      });
 * 
 * 
 * (if you want to change the price go down to "improveIVPrice" and change the 1 of the "modifier = modifier? modifier : 1;" line to something smaller (e.g. 0.5))
 */
export function showIVsUnlock(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, candyCount: any, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text){
    const options = [];

    for (let stat = 0; stat < 6; stat++) {

        if((scene.gameData.dexData[lastSpecies.speciesId].ivs[stat])<31){
            options.push({
                label: `x${improveIVPrice(lastSpecies)} Improve ${getStatName(stat)}`,
                handler: () => {
                    if (candyCount >= improveIVPrice(lastSpecies)) {
                        improveIV(scene, ui, lastSpecies, uiHandler, pokemonCandyCountText, stat);
                    }
                    return false;
                },
            item: 'candy',
            itemArgs: starterColors[lastSpecies.speciesId]
            });
        }
    }

    options.push({
        label: i18next.t("menu:cancel"),
        handler: () => {
            ui.setMode(Mode.STARTER_SELECT);
            return true;
        }
    });
    ui.setModeWithoutClear(Mode.OPTION_SELECT, {
        options: options,
        yOffset: 47
    });
}

/**
 * Makes egg have an increased chance to be a Pokemon that isnt unlocked as a starter yet
 * 
 * -- In egg-hatch-phase.ts --
 *  after (line 1):
 *      import SoundFade from "phaser3-rex-plugins/plugins/soundfade";
 *  add
 *      import * as Mods from "./mods";
 * 
 *  change (line):
 *      ret = this.scene.addPlayerPokemon(pokemonSpecies, 1, undefined, undefined, undefined, false);
 *  to
 *       ret = this.scene.addPlayerPokemon(Mods.generateWeightedEgg(speciesPool, maxStarterValue, minStarterValue, this.scene), 1, undefined, undefined, undefined, false);
 */
export function generateWeightedEgg(speciesPool: Species[], maxStarterValue: integer, minStarterValue: integer, scene: BattleScene): PokemonSpecies {
    const percentage = 1;
    let uncaughtPool = uncaughtSpeciesPool(speciesPool, scene, percentage);

    if (!uncaughtPool.length) {
        uncaughtPool = speciesPool;
    }

    let totalWeight = 0;
    const speciesWeights = [];
    for (let speciesId of uncaughtPool) {
        let weight = Math.floor((((maxStarterValue - speciesStarters[speciesId]) / ((maxStarterValue - minStarterValue) + 1)) * 1.5 + 1) * 100);
        const species = getPokemonSpecies(speciesId);
        if (species.isRegional())
            weight = Math.floor(weight / (species.isRareRegional() ? 8 : 2));
        speciesWeights.push(totalWeight + weight);
        totalWeight += weight;
    }

    let species: Species;

    const rand = Utils.randSeedInt(totalWeight);
    for (let s = 0; s < speciesWeights.length; s++) {
        if (rand < speciesWeights[s]) {
            species = uncaughtPool[s];
            break;
        }
    }

    return getPokemonSpecies(species);
}

/**
 * This class lets you add a weather indicator, as well as the weathers duration, to the top right of your screen
 * You have to add both initializeWeatherText AND updateWeatherText in ALL SPECIFIED PLACES if you want this to work
 */
export class Weather{

    /**
     * -- In battle-scene.ts --
     * after (line 65):
     *      import {UiInputs} from "./ui-inputs";
     * add
     *      import * as Mods from './mods';
     * 
     * after (line 165):
     *      private luckText: Phaser.GameObjects.Text;
     * add
     *      public weatherText: Phaser.GameObjects.Text;
     * 
     * after (line 360):
     *      this.fieldUI.add(this.moneyText);
     * add
     *      this.weatherText = Mods.Weather.initializeWeatherText(this);
     *      this.fieldUI.add(this.weatherText);
     */
    static initializeWeatherText(scene: BattleScene): Phaser.GameObjects.Text {
        let weatherText: Phaser.GameObjects.Text;
        weatherText = addTextObject(scene, (scene.game.canvas.width / 6) - 2, 0, '', TextStyle.MONEY);
        weatherText.setOrigin(1, 0);
    
        return weatherText;
    }
    
    /**
     * -- In battle-scene.ts --
     * after (line 476):
     *      this.updateWaveCountText();
     *      this.updateMoneyText();
     *  add
     *      Mods.Weather.updateWeatherText(this);
     * 
     * after (line 768):
     *      this.updateMoneyText();
     *      this.moneyText.setVisible(false);
     *  add
     *      Mods.Weather.updateWeatherText(this);
     *      this.weatherText.setVisible(false);
     * 
     * after (line 1209):
     *      updateAndShowLuckText(duration: integer): void {
     *  add
     *      this.weatherText.setVisible(false);
     * 
     * after (line 1230):
     *      hideLuckText(duration: integer): void {
     *  add
     *      this.weatherText.setVisible(true);
     * 
     * after (line 1246):
     *      this.moneyText.setY(this.waveCountText.y + 10);
     *  add
     *      this.weatherText.setY(this.moneyText.y + 10);
     * 
     * -- In phases.ts --
     * after (line 62):
     *      import * as Overrides from './overrides';
     *  add
     *      import * as Mods from './mods';
     * 
     * change (line 1038):
     *       applyPostSummonAbAttrs(PostSummonAbAttr, pokemon).then(() => this.end());
     *  to
     *      applyPostSummonAbAttrs(PostSummonAbAttr, pokemon).then(() => { if(pokemon.scene) Mods.Weather.updateWeatherText(pokemon.scene); this.end()});
     */
    static updateWeatherText(scene: BattleScene) {
        if(scene.arena){
            const weatherType = scene.arena.weather?.weatherType;
            const turnsLeft = scene.arena.weather?.turnsLeft;
            scene.weatherText.setText(`${getWeatherName(weatherType)} ${turnsLeft}`);
            if(weatherType == undefined){
                scene.weatherText.setText(`Clear`);
            }
        }else scene.weatherText.setText(`Clear`);
    
        scene.weatherText.setVisible(true);
    }
}

/**
 * Creates a random team of unlocked mons by pressing the "ENTER" (SUBMIT) key while your party is empty
 * 
 * -- In ui/starter-select-ui-handler.ts --
 *  after (line 1):
 *      import { pokemonPrevolutions } from "#app/data/pokemon-evolutions";
 *  add
 *      import * as Mods from "../mods";
 * 
 *  change (line 708):
 *      if (button === Button.SUBMIT) {
 *          if (this.tryStart(true))
 *          success = true;
 *      else
 *          error = true; 
 *  to
 *      if (button === Button.SUBMIT) {
 *          if (this.tryStart(true))
 *              success = true;
 *          else
 *              Mods.randomTeam(this.scene, ui, this.genSpecies, this.starterGens, this.starterCursors, this.dexAttrCursor, this.starterAttr, this.starterAbilityIndexes, this.abilityCursor,this.starterNatures, this.natureCursor, this.starterMovesets, this.starterMoveset, this.starterCursorObjs, this.starterIcons, this)
 */
export function randomTeam(scene: BattleScene, ui: UI, genSpecies: PokemonSpecies[][], starterGens: integer[], starterCursors: integer[], 
    dexAttrCursor: bigint, starterAttr: bigint[], starterAbilityIndexes: integer[], abilityCursor: integer, starterNatures: Nature[], natureCursor: integer,
    starterMovesets: StarterMoveset[], starterMoveset: StarterMoveset,
    starterCursorObjs: Phaser.GameObjects.Image[], starterIcons: Phaser.GameObjects.Sprite[], uiHandler :StarterSelectUiHandler){

    ui.setMode(Mode.STARTER_SELECT);

    let loopCount = 0;
    let genCursorWithScroll : number;
    let cursor : number;
    let species : PokemonSpecies;
    let dexEntry;

    while(getStarterValue(scene, genSpecies, starterGens, starterCursors) <  uiHandler.getValueLimit() && loopCount < 200 && starterGens.length < 6){

        //find a random unlocked starter
        do{
            genCursorWithScroll = Utils.randInt(9, 0);
            cursor = Utils.randInt(81, 0);
            species = genSpecies[genCursorWithScroll][cursor];
            dexEntry = species ? scene.gameData.dexData[species.speciesId] : null;
        }while(!(species && dexEntry?.caughtAttr))

        let isDupe = false;
        for (let s = 0; s < starterCursors.length; s++) {
            if (starterGens[s] === genCursorWithScroll && starterCursors[s] === cursor) {
                isDupe = true;
                break;
            }
        }

        if (!isDupe && uiHandler.tryUpdateValue(scene.gameData.getSpeciesStarterValue(species.speciesId))) {
            const cursorObj = starterCursorObjs[starterCursors.length];
            cursorObj.setVisible(true);
            cursorObj.setPosition(cursorObj.x, cursorObj.y);
            const props = scene.gameData.getSpeciesDexAttrProps(species, dexAttrCursor);
            starterIcons[starterCursors.length].setTexture(species.getIconAtlasKey(props.formIndex, props.shiny, props.variant));
            starterIcons[starterCursors.length].setFrame(species.getIconId(props.female, props.formIndex, props.shiny, props.variant));
            uiHandler.checkIconId(starterIcons[starterCursors.length], species, props.female, props.formIndex, props.shiny, props.variant);
            starterGens.push(genCursorWithScroll);
            starterCursors.push(cursor);
            starterAttr.push(dexAttrCursor);
            starterAbilityIndexes.push(abilityCursor);
            starterNatures.push(natureCursor as unknown as Nature);
            starterMovesets.push(starterMoveset.slice(0) as StarterMoveset);
        }

        loopCount++;
    }
    return true;
}


/**
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Help methods; you dont need to do anything with these (unless you want to edit some of the cheat methods functionality)
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

function revealHatchSprite(scene :BattleScene, pokemon: PlayerPokemon, eggContainer: Phaser.GameObjects.Container, pokemonSprite: Phaser.GameObjects.Sprite, pokemonShinySparkle: Phaser.GameObjects.Sprite){
    pokemon.cry();
    
    eggContainer.setVisible(false);
    pokemonSprite.play(pokemon.getSpriteKey(true));
    pokemonSprite.setPipelineData('ignoreTimeTint', true);
    pokemonSprite.setPipelineData('spriteKey', pokemon.getSpriteKey());
    pokemonSprite.setPipelineData('shiny', pokemon.shiny);
    pokemonSprite.setPipelineData('variant', pokemon.variant);
    pokemonSprite.setVisible(true);

    if (pokemon.isShiny()) {
        pokemonShinySparkle.play(`sparkle${pokemon.variant ? `_${pokemon.variant + 1}` : ''}`);
        scene.playSound('sparkle');
      }
}

function unlockEggMove(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text, index: integer){

    scene.gameData.setEggMoveUnlocked(lastSpecies, index)
    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= unlockEggMovePrice(index, lastSpecies);

    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then(success => {
    if (!success)
        return scene.reset(true);
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
}

function unlockEggMovePrice(index: integer, species: PokemonSpecies, modifier?: number): integer{
    modifier = modifier? modifier : 1;
    const baseCost = speciesStarters[species.speciesId]>5 ? 3 : (speciesStarters[species.speciesId]>3 ? 4 : 5);
    const rareMoveAddition = index>2 ? 1 : 0; 

    return Math.round((baseCost + rareMoveAddition)*modifier);
}

function getEggMoveName(species: PokemonSpecies, index: integer){
    const hasEggMoves = species && speciesEggMoves.hasOwnProperty(species.speciesId);
    const eggMove = hasEggMoves ? allMoves[speciesEggMoves[species.speciesId][index]] : null;
    return eggMove.name;
}

function getShinyRarity(rarity: integer): bigint {
    if(rarity == 3) return DexAttr.VARIANT_3;
    if(rarity == 2) return DexAttr.VARIANT_2;
    return DexAttr.SHINY;
}

function unlockShinyPrice(rarity: integer, species: PokemonSpecies, modifier?: number): integer {
    modifier = modifier? modifier : 1;
    const basePokemonValue = (speciesStarters[species.speciesId]>3) ? speciesStarters[species.speciesId]+1 : speciesStarters[species.speciesId];
    
    const baseCost = 50 - (5*(basePokemonValue-1));

    return Math.round(baseCost * ((1 + rarity)/2))*modifier;
}

function getShinyRarityName(rarity: integer): String {
    if(rarity == 3) return "epic shiny";
    if(rarity == 2) return "rare shiny";
    return "common shiny";
}

function unlockShiny(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text, rarity: integer) {
    while(rarity > 0){
        scene.gameData.dexData[lastSpecies.speciesId].caughtAttr |= getShinyRarity(rarity);
        rarity--;
    }
    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= unlockShinyPrice(rarity, lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then(success => {
    if (!success)
        return scene.reset(true);
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
}

function unlockAbilityPrice(abilityIndex: integer, species: PokemonSpecies, modifier?: number): integer {
    modifier = modifier? modifier : 1;
    const basePokemonValue = speciesStarters[species.speciesId];
    const isHA = abilityIndex==4? 1 : 0;

    const baseCost = 20 - (2.5*(basePokemonValue-1));

    return Math.ceil(baseCost * (1 + isHA))*modifier;
}

function getAbilityName(selectedAbilityIndex: integer, species: PokemonSpecies): String {
    const abilityId = selectedAbilityIndex==1? species.ability1 : (selectedAbilityIndex==2? species.ability2 : species.abilityHidden);
    return allAbilities[abilityId].name;
}

function unlockAbility(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text, selectedAttr: number) {
    
    scene.gameData.starterData[lastSpecies.speciesId].abilityAttr = scene.gameData.starterData[lastSpecies.speciesId].abilityAttr | selectedAttr;

    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= unlockAbilityPrice(selectedAttr, lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then(success => {
    if (!success)
        return scene.reset(true);
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
}

function improveIVPrice(species: PokemonSpecies, modifier?: number): integer{
    modifier = modifier? modifier : 1;
    return Math.round((speciesStarters[species.speciesId]>5 ? 3 : (speciesStarters[species.speciesId]>3 ? 4 : 5))*modifier);
}

function getStatName(statIndex: integer): String {
    return getDataStatName(statIndex as Stat);
}

function improveIV(scene: BattleScene, ui: BattleScene["ui"], lastSpecies: PokemonSpecies, uiHandler: StarterSelectUiHandler, pokemonCandyCountText: Phaser.GameObject.Text, stat: number) {
    
    let IVs = scene.gameData.dexData[lastSpecies.speciesId].ivs;
    IVs[stat] = Math.min(IVs[stat]+5, 31);

    scene.gameData.updateSpeciesDexIvs(lastSpecies.speciesId, IVs);

    scene.gameData.starterData[lastSpecies.speciesId].candyCount -= improveIVPrice(lastSpecies);
    pokemonCandyCountText.setText(`x${scene.gameData.starterData[lastSpecies.speciesId].candyCount}`);

    uiHandler.setSpecies(lastSpecies);
    uiHandler.updateInstructions();
    uiHandler.setSpeciesDetails(lastSpecies, undefined, undefined, undefined, undefined, undefined, undefined);

    scene.gameData.saveSystem().then(success => {
    if (!success)
        return scene.reset(true);
    });
    ui.setMode(Mode.STARTER_SELECT);
    return true;
}

function uncaughtSpeciesPool(speciesPool: Species[], scene: BattleScene, percentage: integer){
    return speciesPool.filter(species => ((!scene.gameData.dexData[species].caughtAttr) || (Math.random() > percentage)));

}

function getWeatherName(weatherType: WeatherType): String {
    switch (weatherType) {
        case WeatherType.NONE:
            return 'Clear';
        case WeatherType.SUNNY:
            return 'Sun';
        case WeatherType.RAIN:
            return 'Rain';
        case WeatherType.SANDSTORM:
            return 'Sandstorm';
        case WeatherType.HAIL:
            return 'Hail';
        case WeatherType.SNOW:
            return 'Snow';
        case WeatherType.FOG:
            return 'Fog';
        case WeatherType.HEAVY_RAIN:
            return 'Heavy Rain';
        case WeatherType.HARSH_SUN:
            return 'Harsh Sun';
        case WeatherType.STRONG_WINDS:
            return 'Strong Winds';
    }
}

function getStarterValue(scene: BattleScene, genSpecies: PokemonSpecies[][],starterGens: integer[], starterCursors: integer[]): number {
    return starterGens.reduce((total: integer, gen: integer, i: integer) => total += scene.gameData.getSpeciesStarterValue(genSpecies[gen][starterCursors[i]].speciesId), 0);
}

//Converts hatched eggs to wild encounters with the given likelyhood
//add to game-data.ts in line 1045 (setPokemonSpeciesCaught): 
//  fromEgg = !Utilscheats.convertEggToWild();
//add to egg-gacha-ui-handler in line 360 (pull): 
//  if(Utilscheats.convertEggToWild()){this.scene.gameData.gameStats.eggsPulled--; this.scene.gameData.gameStats.pokemonSeen++; }else{
export function convertEggToWild(): boolean {
    return Math.random() < 0.8;
}
