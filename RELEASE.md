# How to Release

This project is hosted on HOSTING-SITE.  You can see it [here][project-url].

Releasing the project requires these steps:

0. Set the version number in the code
1. BUILD-COMMAND
2. Use a GitHub [project release][github-release-url] to release the project and tag (be sure it follows [semver][semantic-versioning])
3. PACKAGE-COMMAND and/or RELEASE-COMMAND
4. Update `master` to a new minor version

[project-url]: https://github.com/cerner/ascvd-risk-calculator/
[semantic-versioning]: http://semver.org/
[github-release-url]: https://help.github.com/articles/creating-releases/
