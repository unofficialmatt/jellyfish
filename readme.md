# 🎐 Jellyfish SCSS Framework

## TODO: The docs need rewriting now that we are on npm

<p>
<img src="https://img.shields.io/github/stars/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/issues/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/maintenance/yes/2020.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/commit-activity/y/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/github/last-commit/unofficialmatt/jellyfish.svg?style=flat-square&logo=github"/>
<img src="https://img.shields.io/badge/license-MIT-yellow.svg?style=flat-square"/>
</p>

Jellyfish is yet another front-end design framework for developing responsive, browser-consistent web projects.
Jellyfish has a few stings in it's tail:
- [NPM](https://www.npmjs.com/) is used to manage packages
- [Gulp.js](https://gulpjs.com/) is used to run tasks to make compile easier
- [Sass (SCSS)](https://sass-lang.com/) is used to compartmentalise components and organise css into digestible parts
- [BrowserSync](https://www.browsersync.io/) opens up a new window in your default browser and live reloads whenever changes are detected to your project's javascript, css or HTML
- Jellyfish is hugely customisable with a large settings file to quickly theme the base styles to your project. Jellyfish differs from most grid systems in that you can change the amount of columns in your grid and the breakpoint names - the logic built into sass will automatically compile the appropriate code

### [View documentation](https://unofficialmatt.github.io/jellyfish/)

## Installation

Make sure that you have npm, browsersync and gulp installed on your system following the guides on their respective websites. Then, clone the project into your required folder with git:

```bash
git clone https://github.com/unofficialmatt/jellyfish.git
cd jellyfish
```

Install the dev dependencies:

```bash
npm install
```

And start:

```bash
gulp
```

Your project is now up and running, and you can begin extending the code to suit your project - and editing the variables in `/assets/scss/_settings.scss`.

## Do we really need another SCSS framework?

Good question! No, we probably don't. Jellyfish has been built over the course of many years by [Matt Weet](https://www.mattweet.com) to gain a better understanding of, and adapt to, modern front-end development techniques and to understand how a responsive CSS framework works from scratch. It has also helped Matt to learn more about git.

Matt uses the framework as a basis for all of his web projects, and as you can see from the commit history there have been many trials and tribulations along the way!

Feel free to take Jellyfish for a spin on any of your web projects and let me know if you have any feedback or use it on a live site.

## Acknowledgements

A special thanks to all of the developers who's existing frameworks have provided inspiration and pointers:

- [Skeleton CSS](http://getskeleton.com/)
- [Primitive UI](https://taniarascia.github.io/primitive/)
- [Shoelace](https://www.shoelace.style/)
- [Picnic CSS](https://picnicss.com/)
- [Bulma](https://bulma.io/)
- [Bootstrap](https://www.shoelace.style/)
- [Foundation](https://get.foundation/index.html)

## Contributing

Please feel free to fork, comment, critique, or submit a pull request.

## Author

- [Matt Weet](https://www.mattweet.com)

## License

This project is open source and available under the [MIT License](LICENSE.md).
