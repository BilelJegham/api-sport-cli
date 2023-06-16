API SPORT
===

> A cli tool for https://api-sports.io/
> Retreive data and convert to sql file


## Install
```bash
# NPX 
npx api-sport-cli
# or install globally
npm -g api-sport-cli

```

## Usage
You must define environnment variable `SPORT_API_KEY`, before use cli. [Get your api key](https://dashboard.api-football.com/)

```
export SPORT_API_KEY=XXXX
```

```
api-sport <cmd> [args]

Commands :
  api-sport get-matchs  Fetch matches from sport API

Options :
  --version                                             [boolean]
  --help                                                [boolean]

Made with ❤️ by BilelJegham
```


## Development

```bash
# Install & link dev s
npm install 
npm link .

# Build & launch
npm run build && api-sport

# uninstall (unlink)
npm unlink .
```