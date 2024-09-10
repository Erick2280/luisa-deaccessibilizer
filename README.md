# ![Luisa: Leveraging User Interfaces in SwiftUI for Accessibility Training](./misc/luisa-logo.svg)

![Build workflow status](https://github.com/Erick2280/luisa-deaccessibilizer/actions/workflows/build.yml/badge.svg)
![Tests workflow status](https://github.com/Erick2280/luisa-deaccessibilizer/actions/workflows/tests.yml/badge.svg)
![Test coverage](https://raw.githubusercontent.com/gist/Erick2280/ae03665a8f65725b43639dde75968a03/raw/badge.svg)

Luisa is a tool designed to intentionally remove accessibility features and degrade SwiftUI components, violating [WCAG 2.2](https://www.w3.org/WAI/WCAG22) guidelines. It helps developers learn how to identify accessibility issues or generate test samples for static accessibility analysis tools.

Luisa code transformation is powered by a set of [fault transformation rules](https://docs.luisa.riso.dev/interfaces/FaultTransformationRule). Each rule targets specific code patterns in `.swift` files and apply a degradation. You can find the source code of each rule, along with the expected behavior and which WCAG success criteria it aims to violate in the [`src/transforming/rules/` folder](./src/transforming/rules/) or in the respective section at the [documentation](https://docs.luisa.riso.dev).

Luisa uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) and the [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift) grammar to generate a concrete syntax tree of a `.swift` source code file. Each fault transformation rule contains a query written in the [tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries) to match specific code patterns, along with instructions on how to modify them.

## Usage

Luisa can be used as a module for either Node.js and web environments (through the use of WebAssembly), or standalone as a CLI tool.

### Requirements

Luisa supports macOS and Linux machines. To run it locally, you'll need [Node.js LTS](https://nodejs.org) and [emscripten](https://emscripten.org) installed in your machine (to [generate tree-sitter `.wasm` files](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web#generate-wasm-language-files)). If you have [homebrew]() installed, you can install `emscripten` by running `brew install emscripten`.

If you're running on macOS with Apple silicon, you should also have [Rosetta 2](https://support.apple.com/en-us/102527) installed. You can install it by running `softwareupdate --install-rosetta` in the Terminal.

## Links

- [Documentation](https://docs.luisa.riso.dev)
- [License](./LICENSE)

## Acknowledgements

- [curlconverter](https://github.com/curlconverter/curlconverter)
- [Fruta: Building a Feature-Rich App with SwiftUI - Apple](https://developer.apple.com/documentation/appclip/fruta_building_a_feature-rich_app_with_swiftui)
- [iOS SwiftUI Accessibility Techniques - CVS Health](https://github.com/cvs-health/ios-swiftui-accessibility-techniques)
