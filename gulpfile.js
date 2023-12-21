require("es6-promise").polyfill();

// Set up required modules
const { parallel, series, src, dest, watch } = require("gulp");
const rename = require("gulp-rename");
const banner = require("gulp-banner");
const sourcemaps = require("gulp-sourcemaps");
const pkg = require("./package.json");
const browsersync = require("browser-sync").create();
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const fileinclude = require("gulp-file-include");

var eslint = require("gulp-eslint");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sass = require("gulp-sass")(require("sass"));
var postcss = require("gulp-postcss");
var pxtorem = require("postcss-pxtorem");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");

// Sets options which are used later on in this file
const opts = {
  src_dir: "./src",
  dist_dir: "./dist",
  bannerText:
    "/**\n" +
    " * <%= pkg.name %> v<%= pkg.version %>\n" +
    " * <%= pkg.description %>\n" +
    " * <%= pkg.homepage %>\n" +
    " *\n" +
    " * Copyright 2015 - " +
    new Date().getFullYear() +
    ", <%= pkg.author.name %> (<%= pkg.author.url %>)\n" +
    " * Released under the <%= pkg.license %> license.\n" +
    " */\n\n",
};

// Task to initialize browserSync client
function browsersyncInit(done) {
  browsersync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

// Task to manually reload browserSync
function browsersyncReload(done) {
  browsersync.reload();
  done();
}

// Tasks which watch for changes in specified files/dirs and run tasks based on filetypes edited
function watchTask() {
  watch(
    opts.src_dir + "/docs/**/*.html",
    series(fileIncludePages, browsersyncReload)
  );

  watch(
    opts.src_dir + "/scss/**/!(__all).scss",
    series(sassAutomaticImports, sassProcess)
  );

  watch(opts.src_dir + "/js/**/*.js", javascriptProcess);
  watch(
    "./gulpfile.js",
    series(
      gulpfileLint,
      parallel(series(sassAutomaticImports, sassProcess), javascriptProcess)
    )
  );
}

// Tasks which run when this file is edited (when watch is running)
function gulpfileLint() {
  return src("./gulpfile.js").pipe(eslint()).pipe(eslint.format());
}

// Copy files from node modules
function copyLibs(done) {
  return src(["node_modules/hamburgers/_sass/hamburgers/**/*"]).pipe(
    dest(opts.src_dir + "/scss/vendors/hamburgers/")
  );

  done();
}

// Tasks which process the core javascript files
function javascriptProcess() {
  return src([opts.src_dir + "/js/**/*.js"])
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat("jellyfish.min.js"))
    .pipe(uglify({ mangle: true }))
    .pipe(
      banner(opts.bannerText, {
        pkg: pkg,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(opts.dist_dir + "/js"))
    .pipe(browsersync.reload({ stream: true }));
}

// Recursive task which traverses a directory and it's subdirectories to compile an array of all sass partials
const getSassDirPartials = function (dirPath, arrayOfFiles, relativeDir = "") {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getSassDirPartials(
        dirPath + "/" + file,
        arrayOfFiles,
        path.join(relativeDir, file)
      );
    } else if (
      // Exclude the dynamically generated file
      file !== "__all.scss" &&
      // Only include _*.scss files
      path.basename(file).substring(0, 1) === "_" &&
      path.extname(file) === ".scss"
    ) {
      arrayOfFiles.push(path.join(relativeDir, file));
    }
  });
  return arrayOfFiles;
};

// TODO: REPLACE THIS WITH SASS GLOB

/**
 * Dynamically import SASS files into partials. Modified with the two refs below
 * @see https://nateeagle.com/2014/05/22/sass-directory-imports-with-gulp/
 * @see https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
 */
function sassAutomaticImports(done) {
  // Array of directories where the __all files exist
  var srcFiles = opts.src_dir + ["/scss/**/__all.scss"];

  glob(srcFiles, function (error, files) {
    files.forEach(function (allFile) {
      // Add a banner to warn users
      fs.writeFileSync(
        allFile,
        "// This file imports all other underscore-prefixed .scss files in this directory and sub-directories.\n" +
          "// It is automatically generated by gulp. Do not directly modify this file.\n\n"
      );

      var directory = path.dirname(allFile);
      try {
        let partials = getSassDirPartials(directory);

        // Append import statements for each partial
        partials.forEach(function (partial) {
          partial = partial.replace("_", "");
          partial = partial.replace(".scss", "");
          fs.appendFileSync(allFile, '@import "' + partial + '";\n');
        });
      } catch (error) {
        console.log(error);
      }
    });
  });

  done();
}

// Tasks which run on sass files
function sassProcess() {
  var processors = [
    autoprefixer(),
    pxtorem({
      rootValue: 16,
      unitPrecision: 2, // Decimal places
      propList: ["*"], // Apply to all elements
      replace: true, // False enables px fallback
      mediaQuery: false, // Do not apply within media queries (we use em instead)
      minPixelValue: 0,
    }),
    cssnano(),
  ];

  return src(opts.src_dir + "/scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ["node_modules"] }).on("error", sass.logError))
    .pipe(postcss(processors))
    .pipe(rename("jellyfish.min.css"))
    .pipe(
      banner(opts.bannerText, {
        pkg: pkg,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(opts.dist_dir + "/css"))
    .pipe(browsersync.reload({ stream: true }));
}

function fileIncludePages() {
  return src(["src/docs/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "./",
        indent: true,
      })
    )
    .pipe(dest("./docs/"));
}
// Tasks which run on $ gulp build
const buildScripts = parallel(
  fileIncludePages,
  series(
    copyLibs,
    parallel(series(sassAutomaticImports, sassProcess), javascriptProcess)
  )
);

// Tasks which run on $ gulp
const serverScripts = series(browsersyncInit, watchTask);

exports.buildDocumentation = fileIncludePages;
exports.reload = browsersyncReload;
exports.build = buildScripts;
exports.default = serverScripts;

exports.init = series(buildScripts, serverScripts);

// TODO EXPLORE: https://github.com/sindresorhus/gulp-rev
// TODO: https://www.npmjs.com/package/gulp-patternlint
