## Notes

##### Building

All of the build scripts are run through `npm`. Here are some common tasks:

`npm run build` - Rebuild the project into the `out` folder.
`npm run watch` - Rebuild the project and watch for changes.
`npm run serve` - Start a BrowserSync server, serving the `out` folder.
`npm run prod`  - Rebuild the project for production; this will take a little extra time.
`npm run gae`   - App Engine build into the `gae/static` folder. Deploy with `gcloud`

##### Static Dependencies

Some of the dependencies are included as static external scripts, because the are incompatible with Rollup, they slow down the build process too much, or they aren't available through NPM.

| Library         | Version |
| --------------- | -------:|
| Font Awesome    | 4.7.0   |
| Normalize.css   | 5.0.0   |
| TweenMax        | 1.19.0  |

#### Change Log

- **r0** - pre-launch with no content for social testing
- **r1** - launch
- **r1.0.1** - ios button style & rel=preload fixes
- **r1.0.2** - redirect to https://thebestcoverever.com
- **r1.0.3** - update eligibility requirements text
- **r1.0.4** - update faq text
- **r1.0.5** - fix redirect to canonical domain
