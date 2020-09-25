# Tokens

Community driven crypto portfolio manager

![Screenshot](https://i.imgur.com/ujPnH3F.png)

# Development

### Test Build

Each feature you build is tested by stakeholders directly on their devices using Expo. To set this up do the following:

- Sign up for an account at https://expo.io/signup

- Install the cli https://docs.expo.io/versions/latest/guides/exp-cli.html

- Create your custom app.json (template below)

When your feature is ready to test by stakeholders, publish your branch to Expo using the following command:

```
$ exp publish
```

This requires an `app.json` file in your project's root directory. Below is a template you can use, just replace `[username]` with your username.

// Template
```json
{
  "expo": {
    "name": "tokens-[username]",
    "sdkVersion": "25.0.0",
    "icon": "./assets/app-icon.png",
    "orientation": "portrait",
    "slug": "tokens-[your name]",
    "version": "0.0.1",
    "ios": {
      "bundleIdentifier": "express.tokens.tokens.[username]"
    },
    "android": {
      "package": "express.tokens.tokens.[username]"
    },
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#0f1214"
    },
    "loading": {
      "backgroundColor": "#0f1214"
    },
    "primaryColor": "#0f1214",
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "tokens",
            "project": "tokens-mobile-xb",
            "authToken": "[auth token]"
          }
        }
      ]
    }
  }
}
```


// Example 
```json
{
  "expo": {
    "name": "tokens-esco",
    "sdkVersion": "25.0.0",
    "icon": "./assets/app-icon.png",
    "orientation": "portrait",
    "slug": "tokens-esco",
    "version": "0.0.1",
    "ios": {
      "bundleIdentifier": "express.tokens.tokens-esco"
    },
    "android": {
      "package": "express.tokens.tokens-esco"
    },
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#0f1214"
    },
    "loading": {
      "backgroundColor": "#0f1214"
    },
    "primaryColor": "#0f1214",
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "tokens",
            "project": "tokens-mobile-xb",
            "authToken": "[auth token]"
          }
        }
      ]
    }
  }
}
```
