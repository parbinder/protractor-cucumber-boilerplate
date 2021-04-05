# protractor-cucumber-boilerplate

Boilerplate to start with angular web application automation using Protractor. 

The project is integrated with CucumberJS, to use Behavior Driven Development for test development.

## Introduction

The project uses typescipt syntax to write tests. Project is transpiled at runtime (thanks to ts-node) so, we don't need to run `tsc` to compile it manually from terminal or in the scripts.


## Project structure

Purpose of directories in the project:
 - config - Contains all configuration files
 - features - Contains all features (more directories can be created if required).
 - hooks - All cucumber functions like `After`, `AfterStep`, `Before` are to be added in this directory. If you need to add some functions to protractor config (`./config/protractor.conf.ts`) as callbacks, it's best to add a corresponding ts file exporting the function and then you can pass it in config by importing the file. 
 - logs - Auto-generated. Will be automatically created when you run test scripts. You can change the log level from `./log4js.json`
 - report - Auto-generated. Contains HTML and JSON reports. 
 - pages - Contains all page objects. Follows the 3-step page object creation. i.e. declaration (document web locators), initalization (invoke with constructor) and utilization (methods to perform actions). 
- steps/definitions - Contains step definitions.
- steps/functions - Contains step functions.
- utils - Contains all add-on support sources.

## Usage

1. Clone this repository.
2. Open terminal and run `npm i` (to install dependencies).
3. Run `npm run update` to download webdrivers and update webdriver manager.
4. You can now run tests by using command `npm test`.

## Recommendations

1. Recommended IDE - 'VS Code'. 
2. Recommended extensions:

- TSLint - This is recommended to utilize the power of Typescript linter. I've already added 'tslint.json' to this project with some standard rules, so the code conventions are uniform throughout the project.

- Cucumber (Gherkins) Full Support - To add auto-suggestion and auto-completion support for features.


