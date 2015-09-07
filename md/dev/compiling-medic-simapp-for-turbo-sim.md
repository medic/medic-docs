# Compiling Medic Mobile SIM app for a Turbo SIM

This document is a rough guide for compiling the JSON forms and SIM application for the Turbo SIM parallel SIM hardware.

## Set the language in sim app:
Necessary language is in `src/config.h`
`#define CONFIG_LANG_FR`

Default language in `scripts/muvuku.compile.js` is FR
`var default_language = 'fr';`

## Set up your dev environment
Follow the instruction [here](http://bladox.com/devel_win.php?lang=en) for Windows, or here for [Linux](http://bladox.com/devel-docs/gen_devel.html). If you run into problems, we may have some simplified steps depending on the platform.

## Compile the forms
Go to your medic-simapp directory eg `cd ~/medic-simapp`
_If you skip this step you may get path issues when running the script_

Copy over your JSON forms eg `~/medic-simapp/forms/json/project-name.json`

Compile the JSON forms:
`node scripts/muvuku.compile.js forms/json/project-name.json`

_if you don't see `Completed successfully: Wrote {n} files` then there was in error in the compilation_

## Compile the C program
Once you have the forms compiled you must still compile the sim application to yield the .trb that will be installed on the hardware.
```
cd src
make
```
_Warning: if you don't run from within `src` you may get path issues when running the script_

This should complete with no errors and yield a `src/muvuku.trb` file.

## Test the SIM Application
Once you have the SIM application compiled, you will need to test it on Turbo SIM hardware. Follow the instructions [here](https://github.com/medic/medic-docs/blob/master/md/install/loading-medic-simapp-on-turbo-sim.md), and manually go through all forms for testing. Edit the json form, recompile, and retest as needed.
