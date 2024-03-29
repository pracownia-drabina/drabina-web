'use strict';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';
import pug from 'pug';
import yaml from 'js-yaml';
import gulp from 'gulp';
import fancyLog from 'fancy-log';
import { plugins, args, config, taskTarget, browserSync } from '../utils';
import { marked } from "marked";

let dirs = config.directories;
let dest = path.join(taskTarget);
let dataPath = path.join(dirs.source, dirs.data);

// Pug template compile
gulp.task('pug', () => {
  let siteData = {};
  if (fs.existsSync(dataPath)) {
    // Convert directory to JS Object
    siteData = foldero(dataPath, {
      recurse: true,
      whitelist: '(.*/)*.+.(json|ya?ml)$',
      loader: function loadAsString(file) {
        let json = {};
        try {
          if (path.extname(file).match(/^.ya?ml$/)) {
            json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
          } else {
            json = JSON.parse(fs.readFileSync(file, 'utf8'));
          }
        } catch (e) {
          fancyLog(`Error Parsing DATA file: ${file}`);
          fancyLog('==== Details Below ====');
          fancyLog(e);
        }
        return json;
      }
    });
  }

  // Add --debug option to your gulp task to view
  // what data is being loaded into your templates
  if (args.debug) {
    fancyLog('==== DEBUG: site.data being injected to templates ====');
    fancyLog(siteData);
    fancyLog('\n==== DEBUG: package.json config being injected to templates ====');
    fancyLog(config);
  }

  return (
    gulp
      // Ignore underscore prefix folders/files (ex. _custom-layout.pug)
      .src(['**/*.pug', '!{**/_*,**/_*/**}'], { cwd: dirs.source })
      .pipe(plugins.changed(dest))
      .pipe(plugins.plumber())
      .pipe(
        plugins.pug({
          pug: pug,
          pretty: true,
          locals: {
            config: config,
            debug: true,
            site: {
              data: siteData
            },
            marked: marked,
          }
        })
      )
      .pipe(
        plugins.htmlmin({
          collapseBooleanAttributes: true,
          conservativeCollapse: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true
        })
      )
      .pipe(gulp.dest(dest))
      .on('end', browserSync.reload)
  );
});
