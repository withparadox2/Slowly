## Slowly

A lite web version of [Slowly](https://www.getslowly.com/en/). Through it one can send or receive letters, check and update location. Since the official web version has also been released, I'd like to introduce some unique features embeded inside this web version of Slowly and more are coming:

- ~~Check incoming letters~~ (Not available anymore since 2020-06-26)
- ~~Show location of your friends who has allowed to update location~~ (Not available anymore)
- Change your location to reduce the travel time of sending a letter (For some reasons, new location is restricted to the same country as you sign in, which can be solved by using a VPN)
- Check previous letters conveniently while writing a new one
- Search across all letters of a certain friend
- ~~Send images as attachements without any permissions~~ (Not available anymore since 2020-06-25)
- Show statistics of letters of a certain friend in different styles
- Backup all letters of a certain friend by downloading a single text file, excluding photos
- All functions work well on mobile broswers

**Note:** All data is fetched from Slowly's server and stored in browser's local storage. You should never leak any sensitive data like token or verification code to others.

## Build
Install dependencies: `npm install`

Then start server by executing command: `npm run serve`

## Other commands

- `npm run build`: build to generate bundles
- `npm run ar`: build and run bundle size analyzer

An enviroment variable `PUBLISH_PAGES` is provided in file `/.env` to control whether to publish build result to `/doc` directory. The value is true by default, but you can overwrite it by defining it in a file named `/.env.local`, which is ignored by git and needs to be created manually.

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