# /scss

The Jellyfish core SCSS files are inside the `/jellyfish` folder - you can customise these if you like, however it's recommend to instead use partials in `/project` to define project-specific styling and override any Jellyfish defaults.

`compile.scss` is compiled by Grunt into `/dist/css/style.css`, with the jellyfish directory being compiled ahead of the project directory. This allows for cascading within the outputted css.

You can also override the default variables with the settings file `_settings.scss`
