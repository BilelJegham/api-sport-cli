import { cat } from "shelljs"
import { z } from "zod"

export function jsonToSQL(json: any[], columns: Record<string, string>, upsertPrimaryKey: string) {
    const values = json
      .map((m) => {
        const match = formatMatch(m, columns)
        return `(${Object.values(match).join(',')})`
      })
      .join(',\n')

    let suffixQuery =  '';
    if(upsertPrimaryKey){
      suffixQuery = `
        ON CONFLICT (${upsertPrimaryKey}) DO UPDATE SET
        ${Object.keys(columns).map((key)=>{
          return `${key} = EXCLUDED.${key}`
        })} 
      `
    }
    
    return `
    INSERT INTO matchs (${Object.keys(columns).join(',')})  
    VALUES ${values}
    ${suffixQuery}
    ;`
}

const leaguesSchema = z.record(
  z.string(),
  z.array(z.object({
    league: z.number(),
    season: z.number(),
  }))
)

const configurationSchema = z.object({
  leagues: leaguesSchema,
  columns: z.record(z.string(), z.string())
})

export function getConfigurations(path: string){
  return configurationSchema.parse(JSON.parse(cat(path)))
}


export function formatMatch(match: any, columns: Record<string, string>) {
  return Object.keys(columns).reduce((acc, key) => {
    acc[key] = `'${getValueByKey(match, columns[key]).toString().replace(/'/g, "''")}'`
    return acc
  }, {} as any)
  
}

function getValueByKey(obj: any, path: string){
  const paths = path.split('.')
  return paths.reduce((acc, key) => {
    if(!acc[key]) throw new Error(`key ${key} not found, path: ${path}`)
    return acc[key]
  }, obj)
}