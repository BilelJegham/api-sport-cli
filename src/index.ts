#!/usr/bin/env node


import yargs, { ArgumentsCamelCase } from 'yargs'
import { getConfigurations, jsonToSQL } from './file'
import { ShellString } from 'shelljs'
import { SPORTS_API } from './api'
import { LogLevel } from './types'

interface GetMatchsArgs {
  'sql-file': string
  'json-file': string
  config: string,
  verbose: boolean,
  upsert: string
}

let currentArgs: ArgumentsCamelCase<GetMatchsArgs>;
export const logger = (level: LogLevel, message: string) => {
  if(!currentArgs.verbose && level === LogLevel.DEBUG){
    return
  }
  console.log(`[${level}] ${message}`)
}

yargs
  .scriptName('api-sport')
  .usage('$0 <cmd> [args]')
  .command(
    'get-matchs',
    'Fetch matches from sport API',
    (yargs) => 
      yargs
        .option('config', {
          describe: 'path to config file',
          type: 'string',
          default: 'config.json',
          alias: 'c',
          normalize: true,
        })
        .option('sql-file' as 'sqlFile', {
          describe: 'file to save sql',
          type: 'string',
          default: 'matchs.sql',
          alias: 's',
          normalize: true,
        })
        .option('json-file'  as 'jsonFile', {
          describe: 'file to save json',
          type: 'string',
          default: 'matchs.json',
          alias: 'j',
          normalize: true,
        })
        .option(
          'upsert',
          {
            alias: 'u',
            type: 'string',
            description: 'allow sql conflict and upsert precise primary key'
          }
        )
        .option('verbose', {
          alias: 'v',
          type: 'boolean',
          description: 'Run with verbose logging',
        })
    ,
    async function (argv: ArgumentsCamelCase<GetMatchsArgs>) {
      const { default: ora } = await import("ora")
      try{
        currentArgs = argv
        const config = getConfigurations(argv.config)

        const spinner = ora('Loading matches').start()
        const matches = (await Promise.all(Object.entries(SPORTS_API).map(([sport, apiClass])=>{
          if(!config.leagues[sport]) return
          return apiClass.getNextMatches(config.leagues[sport]) ?? []
        }))).flat().filter(Boolean)
        spinner.succeed(`${matches.length} matches found`)

        ShellString(JSON.stringify(matches)).to(argv['json-file'] as string)
        logger(LogLevel.INFO, `saving to ${argv['json-file']}`)

        const sqlContent = jsonToSQL(matches, config.columns, argv.upsert)
        ShellString(sqlContent).to(argv['sql-file'] as string)
        logger(LogLevel.INFO, `saving to ${argv['sql-file']}`)

        return 
      }catch(e){
        logger(LogLevel.ERROR, (e as Error).message)
        process.exit(1)
      }
    },
  )
  .command(
    'star',
    'Give your ❤️ with a small star',
    (yargs) => yargs,
    async ()=>{
      console.log(`Star ⭐ this project on github: ${process.env.npm_package_repository_url}`)
      if(process.env.npm_package_repository_url){

        const { default: open } = await import("open")
        await open(process.env.npm_package_repository_url, {wait: true});
      }
  })
  .version(process.env.npm_package_version || '0.0.0-dev')
  .help()
  .demandCommand()
  .epilog('Made with ❤️ by BilelJegham').argv
