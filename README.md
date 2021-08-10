lantoo
======

Rocket.Chat Language Tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lantoo.svg)](https://npmjs.org/package/lantoo)
[![Downloads/week](https://img.shields.io/npm/dw/lantoo.svg)](https://npmjs.org/package/lantoo)
[![License](https://img.shields.io/npm/l/lantoo.svg)](https://github.com/ajsaraujo/lantoo/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lantoo
$ lantoo COMMAND
running command...
$ lantoo (-v|--version|version)
lantoo/0.0.3 linux-x64 node-v14.17.4
$ lantoo --help [COMMAND]
USAGE
  $ lantoo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lantoo base`](#lantoo-base)
* [`lantoo config lang`](#lantoo-config-lang)
* [`lantoo find`](#lantoo-find)
* [`lantoo help [COMMAND]`](#lantoo-help-command)
* [`lantoo translate --key Away_female --value Ausente`](#lantoo-translate---key-away_female---value-ausente)

## `lantoo base`

```
USAGE
  $ lantoo base
```

_See code: [src/commands/base.ts](https://github.com/ajsaraujo/lantoo/blob/v0.0.3/src/commands/base.ts)_

## `lantoo config lang`

get/set user preferences

```
USAGE
  $ lantoo config lang

ARGUMENTS
  KEY    (lang) the key to get/set
  VALUE  a value to set to the key

EXAMPLES
  $ lantoo config lang pt-br
  $ lantoo config lang
```

_See code: [src/commands/config.ts](https://github.com/ajsaraujo/lantoo/blob/v0.0.3/src/commands/config.ts)_

## `lantoo find`

find translation keys

```
USAGE
  $ lantoo find

ARGUMENTS
  KEY  a specific key to find

OPTIONS
  -j, --json
  -l, --lang=lang
  --untranslated
  --unused

EXAMPLES
  $ lantoo find away_female
  $ lantoo find --untranslated
  $ lantoo find --unused
  $ lantoo find --lang pt-BR
```

_See code: [src/commands/find.ts](https://github.com/ajsaraujo/lantoo/blob/v0.0.3/src/commands/find.ts)_

## `lantoo help [COMMAND]`

display help for lantoo

```
USAGE
  $ lantoo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `lantoo translate --key Away_female --value Ausente`

add new translations

```
USAGE
  $ lantoo translate --key Away_female --value Ausente

OPTIONS
  -i, --interactive
  -k, --key=key
  -l, --lang=lang
  -v, --value=value

EXAMPLES
  $ lantoo translate --key Away_female --value Ausente
  $ lantoo translate --interactive
  $ lantoo translate --interactive --lang en
```

_See code: [src/commands/translate.ts](https://github.com/ajsaraujo/lantoo/blob/v0.0.3/src/commands/translate.ts)_
<!-- commandsstop -->
