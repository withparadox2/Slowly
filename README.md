## Slowly

A lite web version of [Slowly](https://www.getslowly.com/en/). Through it one can send or receive letters, check and update location. Since the official web version has also been released, I'd like to introduce some unique features embeded inside this web version of Slowly and more are coming:

- Check letters before arrival
- ~~Show locations of your friends who allow to update location~~ (Not available right now due to the banning from slowly)
- Change your location to reduce the travel time of sending a letter
- Check past letters conveniently while writing a letter
- Search across all letters of a target friend
- Send images as attachement without any permissions
- Show statistics of letters in different styles
- Backup all letters by downloading a txt file
- All functions work well on mobile broswers

**Note:** All data is fetched from Slowly's server and stored in browser's local storage. You should never leak any sensitive data like token or sms code to others.

## Build
Install dependencies: `npm install`

Then start server `npm run serve` or build to generate bundles `npm run build`