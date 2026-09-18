# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- See all countries from the data on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode _(optional)_

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Add solution URL here](https://github.com/Daucko/frontend-mentor-rest-countries-api-with-color-theme-switcher-solution)
- Live Site URL: [Add live site URL here](https://frontend-mentor-rest-countries-api-sage.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Javascript

### What I learned

I used this project to work on _Array_ data types in javaScript. I worked extensively with mapping of arrays as shown below:

To see how you can add code snippets, see below:

```js
...
 const borderCountries = (c.borders || [])
    .map((code) => countryByCode.get(code))
    ...;

```

### Continued development

I want to focus more on my javaScript development.

### Useful resources

- [Example resource 1](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) - This helped me with the mapping of array. I really liked this pattern and will use it going forward.
- [Example resource 2](https://www.w3schools.com/jsref/jsref_map.asp) - This is an amazing article which helped me finally understand mapping of array. I'd recommend it to anyone still learning this concept.

### AI Collaboration

Since the project starter files has two files that instruct AI agents and Claude to not get involve in the execution of the project, the copilot in my VS Code was deactivated. But I made use of 'claude.ai' and 'Deepseek.ai' in my browser when I got stuck on how to reach _keys_ and _values_ of objects that are items of an array.

## Author

- Website - [Add your name here](https://www.daucode-portfolio.vercel.app)
- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/daucko)
- Twitter - [@yourusername](https://www.twitter.com/daucoooflife)
