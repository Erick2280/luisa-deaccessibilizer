# ![Luisa: Leveraging User Interfaces in SwiftUI for Accessibility Training](./misc/luisa-logo.svg)

![Build workflow status](https://github.com/Erick2280/luisa-deaccessibilizer/actions/workflows/build.yml/badge.svg)
![Tests workflow status](https://github.com/Erick2280/luisa-deaccessibilizer/actions/workflows/tests.yml/badge.svg)
![Test coverage](https://raw.githubusercontent.com/gist/Erick2280/ae03665a8f65725b43639dde75968a03/raw/badge.svg)

Luisa is a tool designed to modify codebases by intentionally removing accessibility features and degrading SwiftUI components, violating [WCAG 2.2](https://www.w3.org/WAI/WCAG22) guidelines. It can generate samples for mutation testing and assist in teaching accessibility best practices and how to identify issues.

Luisa's code modification is powered by a set of [mutation operators](https://docs.luisa.riso.dev/interfaces/MutationOperator). Each operator targets specific code patterns in `.swift` files and applies a degradation. You can find the source code of each operator, along with its expected behavior and targeted WCAG success it aims to violate, in the `/src/mutating/operators/` folder or in the [documentation](https://docs.luisa.riso.dev).

Luisa uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) and the [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift) grammar to generate a syntax tree of a `.swift` source code file. Each mutation operator contains a query written in the [tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries) to match specific code patterns, along with instructions on how to modify them.

## Usage

Luisa can be used as a module for either Node.js and web environments (through the use of WebAssembly), or standalone as a CLI tool.

## Prerequisites

Luisa supports macOS and Linux machines.

### Required dependencies

- [Node.js LTS](https://nodejs.org)
- [emscripten](https://emscripten.org) - Required for [tree-sitter WASM compilation](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web#generate-wasm-language-files)
- [Rosetta 2](https://support.apple.com/en-us/102527) - If you're running on a macOS device with Apple silicon

### macOS quick install

Ensure you have [homebrew](https://brew.sh/) and [Node.js LTS](https://nodejs.org) installed in your machine.

```bash
# Install from homebrew
brew install emscripten

# Apple Silicon only: Install Rosetta 2
softwareupdate --install-rosetta
```

### As a module

#### In the browser

If you're installing Luisa to use it as part of a web page, the `tree-sitter.wasm` and `tree-sitter-swift.wasm` files (compiled to `dist/` when you install this module) should be available from the root directory of your web server.

## License

This project is licensed under [MIT License](./LICENSE), excepted where noted otherwise (such as the Swift file samples from external projects).

## Links

- [Documentation](https://docs.luisa.riso.dev) - An anonymized version of the documentation can be found at deaccessibilizer.vercel.app.
- [License](./LICENSE)

## Acknowledgements

- [curlconverter](https://github.com/curlconverter/curlconverter)
- [Fruta: Building a Feature-Rich App with SwiftUI - Apple](https://developer.apple.com/documentation/appclip/fruta_building_a_feature-rich_app_with_swiftui)
- [iOS SwiftUI Accessibility Techniques - CVS Health](https://github.com/cvs-health/ios-swiftui-accessibility-techniques)
- [Editing a tree-sitter tree - @jeff-hykin](https://github.com/tree-sitter/tree-sitter/discussions/2553#discussioncomment-9976343)
