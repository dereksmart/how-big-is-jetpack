# how-big-is-jetpack
How big is Jetpack?

# Running the tool

If you're running a recent version of OSX, you'll need a custom PHP build to get ZipArchive :(
[This](https://stackoverflow.com/questions/58290566/install-ext-zip-for-mac/58300437#58300437) worked for me: 
```
brew update
brew install php@7.3
brew link php@7.3
```

While you're at it, you'll also need to install `cloc`:

`brew install cloc`


Now build the json: `php bin/build-json.php [prod | dev]`

This will pull the versions not already stored and add them to the all.json build.  
