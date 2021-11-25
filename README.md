# Groovy doc to Markdown

Generate Markdown from your GroovyDoc, Javadoc, PHPDoc or JSDoc comments

## NPM Usage
```bash
npm install --save-dev groovydoc-to-markdown
node_modules/.bin/doc2md src groovy doc
```

## Docker Usage

```bash
docker run scrasnups/build:groovydoc-to-markdown:latest \
  -v "$(pwd)":/tmp
  node doc2md.js /tmp/src groovy /tmp/doc
```

## Contributing

All contributions are welcome! If you wish to contribute, please create an issue first so that your feature, problem or question can be discussed.

## License

```
Copyright (c) delight.im <info@delight.im>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
