# SCSS structure and conventions

When producing SCSS for this project, you should code with the principles of the [ITCSS triangle](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) structure, organising partials in specificity order.

[Jellyfish](https://unofficialmatt.github.io/jellyfish/), the SCSS framework that underlines this project is developed with ITCSS. To maintain the triangle structure, there is an import file inside each of the subdirectories of this directory which imports all of the base styles from Jellyfish.

Jellyfish has one minor change from the normal ITCSS structure, in that Tools and Settings are flipped - so that functions can be used as variables (eg. tint/shade). Otherwise, it is strongly advised to conform to the principles of ITCSS in order to make code more maintainable and to minimise issues with the cascade.

## Directory Structure

1. **01-tools**: Globally used mixins and functions. This directory should not output any CSS. In Jellyfish, Tools is before Settings so that functions can be used within variables.
2. **02-settings**: SASS variables for color, typography, padding, margin, breakpoints, etc. Jellyfish uses `!default` tags on variables, so any variables that are not set here will instead use the default Jellyfish settings.
3. **03-generic**: Reset / normalize styles and box-sizing definitions. This is the first layer which generates actual CSS.
4. **04-elements**: Styling for bare HTML elements (like H1, A, etc.). Redefines the default styles from the browser.
5. **05-vendor**: Import any vendor or third-party styles here, so that they can be modified further down the triangle if required.
6. **06-objects**: Class based selectors which define undecorated design patterns. In Jellyfish, the grid framework is defined here.
7. **07-components**: The bread and butter of the project. This is where all styled UI components should be defined, for example buttons, labels, cards.
8. **08-utilities**: Utilities and helper classes which have the ability to override anything which has come before in the triangle. For example, hide/show classes.

## Useful Reading:

- [ITCSS: Scalable and Maintainable CSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [The Inverted Triangle Architecture: how to manage large CSS Projects](https://www.freecodecamp.org/news/managing-large-s-css-projects-using-the-inverted-triangle-architecture-3c03e4b1e6df/)
- [How I Shrank my CSS by 84kb by Refactoring with ITCSS](https://medium.com/@jordankoschei/how-i-shrank-my-css-by-84kb-by-refactoring-with-itcss-2e8dafee123a)
- [Chisel: Guide to ITCSS](https://www.getchisel.co/docs/development/itcss/)
