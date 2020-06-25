## Slowly

A lite web version of [Slowly](https://www.getslowly.com/en/). Through it one can send or receive letters, check and update location. Since the official web version has also been released, I'd like to introduce some unique features embeded inside this web version of Slowly and more are coming:

- Check letters before arrival
- ~~Show locations of your friends who allow to update location~~ (Not available right now due to the banning from slowly)
- Change your location to reduce the travel time of sending a letter (For some reasons, new location is restricted to the same country as you sign in)
- Check past letters conveniently while writing a letter
- Search across all letters under a specified friend
- ~~Send images as attachement without any permissions~~ (Not available anymore)
- Show statistics of letters in different styles
- Backup all letters by downloading a txt file
- All functions work well on mobile broswers

**Note:** All data is fetched from Slowly's server and stored in browser's local storage. You should never leak any sensitive data like token or sms code to others.

## Build
Install dependencies: `npm install`

Then start server `npm run serve` or build to generate bundles `npm run build`

## License
```
Copyright 2020 withparadox2

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```