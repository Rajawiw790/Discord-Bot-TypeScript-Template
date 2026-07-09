import dotenv from "dotenv";
dotenv.config();

import { REST } from "@discordjs/rest";
import { Options, Partials } from "discord.js";
import { createRequire } from "node:module";

import { Button } from "./buttons/index.js";
import { DevCommand, HelpCommand, InfoCommand, TestCommand } from "./commands/chat/index.js";
import {
  ChatCommandMetadata,
  Command,
  MessageCommandMetadata,
  MessageCommands,
  UserCommandMetadata,
} from "./commands/index.js";
import { ViewDateSent } from "./commands/message/index.js";
import { ViewDateJoined } from "./commands/user/index.js";
import {
  ButtonHandler,
  CommandHandler,
  GuildJoinHandler,
  GuildLeaveHandler,
  MessageHandler,
  ReactionHandler,
  TriggerHandler,
} from "./events/index.js";
import { CustomClient } from "./extensions/index.js";
import { Job } from "./jobs/index.js";
import { Bot } from "./models/bot.js";
import { Reaction } from "./reactions/index.js";
import {
  CommandRegistrationService,
  EventDataService,
  JobService,
  Logger,
} from "./services/index.js";
import { Trigger } from "./triggers/index.js";

const require = createRequire(import.meta.url);
const Config = require("./config/config.json");
const Logs = require("./lang/logs.json");

async function start(): Promise<void> {
  const eventDataService = new EventDataService();

  const client = new CustomClient({
    intents: Config.client.intents,
    partials: [Config.client.partials as string[]].map((partial) => Partials[partial]),
    makeCache: Options.cacheWithLimits({
     ...Options.DefaultMakeCacheSettings,
     ...Config.client.caches,
    }),
    enforceNonce: true,
  });

  const commands: Command[] =
