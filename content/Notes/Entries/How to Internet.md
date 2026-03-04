---
created: 2026-03-03
tags:
  - youtube
  - technology
  - steam
description:
---
# Overview

Browsing online can be difficult and annoying. Ads, scams, bad user interfaces, and paywalls make browsing the internet a pain. This list is here to help! These are a few of my favorite Chrome and Edge browser extensions that make browsing the web just a little bit easier.

# Browsing & Ads

### uBlock Origin Lite

| ![[ublock-origin.png]] | This extension removes annoying ads. A must have for visiting most websites these days.<br><br>Install [uBlock Origin Lite](https://chromewebstore.google.com/detail/ddkjiahejlhfcafbddmgiahcphecmpfh?utm_source=item-share-cb) |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
### Remove Paywalls

| ![[remove-paywalls-logo.png]] | It's not often I'm browsing a page with a paywall, but when they do come up this handy little extension is able to remove them.<br><br>Install [Remove Paywalls](https://chromewebstore.google.com/detail/ghkdkllgoehcklnpajjjmfoaokabfdfm?utm_source=item-share-cb) |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# Shopping

### Keepa™ - Amazon Price Tracker

| ![[keepa-logo.png]] | Keepa™ provides price history graph straight on the product page of any Amazon listing.<br><br>Install [Keepa™](https://chromewebstore.google.com/detail/neebplgakaahbhdphmkckjjcegoiijjo?utm_source=item-share-cb) |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### SteamDB

| ![[steamdb-logo.png]] | SteamDB provides a bunch of enhancements to the [Steam Store](https://store.steampowered.com/) such as seeing the historical low price of games and player stats. Makes for a better shopping and browsing experience than the store front on Steams desktop application.<br><br>Install [SteamDB](https://chromewebstore.google.com/detail/kdbmhfkmnlmbkgbabkdealhhbfhlmmon?utm_source=item-share-cb) |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

### Augmented Steam

| ![[augmented-steam-logo.png]] | Augmented Steam is similar to *SteamDB*, but provides more historical price data and search enhancements.<br><br>Install [Augmented Steam](https://chromewebstore.google.com/detail/dnhpnfgdlenaccegplpojghhmaamnnfp?utm_source=item-share-cb) |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
### ProtonDB for Steam

| ![[protondb-logo.png]] | This extension displays Linux compatibility information on Steam Store product pages. Useful for those who use Linux or a Steam Deck and want to make sure a game is compatible!<br><br>Install [ProtonDB for Steam](https://chromewebstore.google.com/detail/ngonfifpkpeefnhelnfdkficaiihklid?utm_source=item-share-cb) |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

# YouTube & Twitch

### Enhancer for YouTube™

| ![[enhancer-for-youtube.png]] | YouTube does some annoying things with their UI sometimes. This extension allows you to customize YouTube with a ton of settings.<br><br>To quickly customize YouTube with my favorite settings, follow these steps: |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
1. Install [Enhancer for YouTube™](https://chromewebstore.google.com/detail/ponfpcnoihfmfllpaingbgckeeldkhle?utm_source=item-share-cb)
2. Navigate to your extensions page (usually a *puzzle* icon).
3. Find Enhancer for YouTube™ in your list of installed extensions and click details.
4. Go to "Extension options".
5. On the left side pane, click on "Backup".
6. Click "Import"
7. Copy and paste the following code:

```
{
  "version": "3.0.16",
  "settings": {
    "applyvideofilters": false,
    "backdropcolor": "#000000",
    "backdropopacity": 85,
    "blackbars": false,
    "blockautoplay": true,
    "blockhfrformats": false,
    "blockwebmformats": false,
    "boostvolume": false,
    "cinemamode": false,
    "cinemamodewideplayer": true,
    "controlbar": {
      "active": false,
      "autohide": false,
      "centered": true,
      "position": "absolute"
    },
    "controls": [
      "loop",
      "speed-minus",
      "speed",
      "speed-plus",
      "screenshot",
      "options",
      "experiments"
    ],
    "controlsvisible": false,
    "controlspeed": true,
    "controlspeedmousebutton": false,
    "controlvolume": false,
    "controlvolumemousebutton": false,
    "convertshorts": false,
    "customcolors": {
      "--dimmer-text": "#cccccc",
      "--hover-background": "#232323",
      "--main-background": "#111111",
      "--main-color": "#00adee",
      "--main-text": "#eff0f1",
      "--second-background": "#181818",
      "--shadow": "#000000"
    },
    "customcss": "",
    "customscript": "",
    "customtheme": false,
    "darktheme": true,
    "date": 1707444839905,
    "defaultvolume": false,
    "disableautoplay": false,
    "executescript": false,
    "expanddescription": false,
    "filter": "none",
    "griditemsperrow": {
      "channel": {
        "shorts": {
          "apply": false,
          "count": 5
        },
        "videos": {
          "apply": false,
          "count": 5
        }
      },
      "posts": {
        "apply": false,
        "count": 4
      },
      "shorts": {
        "apply": false,
        "count": 8
      },
      "videos": {
        "apply": false,
        "count": 3
      }
    },
    "hidecardsendscreens": false,
    "hidechat": false,
    "hidecomments": false,
    "hiderelated": false,
    "hideshorts": true,
    "ignoreplaylists": true,
    "ignorepopupplayer": true,
    "localecode": "en_US",
    "localedir": "ltr",
    "miniplayer": true,
    "miniplayerposition": "top-right",
    "miniplayersize": "1280x720",
    "newestcomments": false,
    "overridespeeds": true,
    "pauseforegroundtab": false,
    "pausevideos": true,
    "popuplayersize": "1280x720",
    "previousversion": "3.0.15.2",
    "qualityembeds": "hd1080",
    "qualityembedsfullscreen": "hd1080",
    "qualityplaylists": "hd1440",
    "qualityplaylistsfullscreen": "hd2160",
    "qualityvideos": "hd1440",
    "qualityvideosfullscreen": "hd2160",
    "reload": false,
    "reversemousewheeldirection": false,
    "selectquality": true,
    "selectqualityfullscreenoff": false,
    "selectqualityfullscreenon": true,
    "speed": 1,
    "speedvariation": 0.1,
    "stopvideos": false,
    "theatermode": false,
    "theme": "youtube-deep-dark",
    "themevariant": "dark-red.css",
    "update": 1771082375021,
    "vendorthemevariant": "youtube-deep-dark.css",
    "videofilters": {
      "blur": 0,
      "brightness": 100,
      "contrast": 100,
      "grayscale": 0,
      "inversion": 0,
      "rotation": 0,
      "saturation": 100,
      "sepia": 0
    },
    "volume": 50,
    "volumemultiplier": 3,
    "volumevariation": 5,
    "whatsnew": false,
    "wideplayer": true,
    "wideplayerviewport": false
  }
}
```

8. Click "Import".
9. You're done! Enjoy some slight changes to YouTube.

---
### SponsorBlock for YouTube - Skip Sponsorships

| ![[sponsor-block.png]] | This extension fast forwards videos past annoying sponsorship segments. It's community driven, so if you're super early to a video it might not work. But once enough people report the sponsor segments with this extension it will mark that segment of the video in green and once the play head reaches that part of the video, it will automatically skip forward. Super nice!<br><br>Install [SponsorBlock for YouTube](https://chromewebstore.google.com/detail/mnjggcdmjocbbbhaepdhchncahnbgone?utm_source=item-share-cb) and you're done! |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Return YouTube Dislike

| ![[return-youtube-dislike.png]] | Why did YouTube get rid of the dislike button? I have no idea. But this extension brings it back! And that's it.<br><br>Install [Return YouTube Dislike](https://chromewebstore.google.com/detail/gebbhagfogifgggkldgodflihgfeippi?utm_source=item-share-cb) and that's it! |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### BetterTTV

| ![[betterttv.png]] | This extension is a must if you watch Twitch, especially for the drops as this extension automatically claims channel points bonuses, drops, and moments! |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
1. Install [BetterTTV](https://chromewebstore.google.com/detail/ajopnjidmegmdimjlfnijceegpefgped?utm_source=item-share-cb)
2. To enable settings, navigate to [twitch.tv](https://www.twitch.tv/)
3. Watch any streamer and click the gear icon right below the chat box on the bottom right.
4. Click on "BetterTTV Settings" in the pop-up menu.
   
   ![[betterttv-menu.png|316]]
   
1. From there, you can enable settings like Auto Claim.
   ![[betterttv-settings-panel.png|636]]
   
2. Sometimes the extension will glitch out on first enable. Be sure to *restart your browser* after enabling settings. 
3. Enjoy!