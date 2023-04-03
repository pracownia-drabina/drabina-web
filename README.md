# Drabina Web

[![Netlify Status](https://api.netlify.com/api/v1/badges/e4c182ba-e220-4f41-b72a-323792e6bbfb/deploy-status)](https://app.netlify.com/sites/pracownia-drabina/deploys)

Bulit using gulp, pug templates and [Netlify CMS](https://www.netlifycms.org/)

## Setup

Install dependencies
```
npm install
```

Start development server
```
npm run serve
```

Generate production build
```
npm run build
```

## Projct Structure

- `/src/*.pug` - pug files for each page (index, kontakt, oferta...)
- `/src/_layouts/base.pug` - shared layout used by every page
- `/src/_data/*.yml` - data files with content for every page that are managed by Netlify CMS
- `/src/admin/config.yml` - Netlify CMS config with data definitions for every page (updated data is saved in yml files)

## Content management

Visit [https://pracowniadrabina.pl/admin](https://pracowniadrabina.pl/admin) and edit pages as described in `admin/config.yml` files.

After saving changes it will automatically create a new commit on a `master` branch and trigger new deployment.

## Deployment

Deployment to [pracowniadrabina.pl](https://pracowniadrabina.pl/) is done automatically on every merge to `master` branch using [Netlify](https://netlify.com)

