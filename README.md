# Roam2Anki

Roam2Anki is a simple Chrome extension for creating csv file to import Roam Research blocks as Front/Back Anki cards.

## Instalation

To install execute

```
yarn install
yarn build
```

than you need to load extension according to

```
1. Navigate to chrome://extensions in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over More Tools and selecting Extensions.
2. Check the box next to Developer Mode.
3. Click Load Unpacked Extension and select the dist directory for extension
```

## Usage

To get extension works properly you need to build your blocks in correct structure:

```
This is the Question 1 #Box1
  This is the Answer 1

This is the Q2 #Box1
  This is the A2
  This is the A2 subanswer
```

Question block should include hashtag (default for extension is `#Box1`)
The answer should be nested one level deep in Question block

In extension popup you could provide custom hashtag.

Extension will generate CSV file only when all blocks that are marked with question hashtag are extended and has answer block.

## Remarsk

The CSV fileds are separated by Tab by default.
