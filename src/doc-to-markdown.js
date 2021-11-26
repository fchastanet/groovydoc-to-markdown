/**
 * Generate Markdown from your Javadoc, PHPDoc or JSDoc comments
 *
 * Usage: Create a new instance of <code>JavadocToMarkdown</code> and then
 * call either <code>fromJavadoc()</code>, <code>fromPHPDoc()</code> or <code>fromJSDoc()</code>
 * @see https://raw.githubusercontent.com/delight-im/Javadoc-to-Markdown/gh-pages/_js/javadoc-to-markdown.js
 *
 * @constructor
 */
 class JavadocToMarkdown {

	"use strict";

	/**
	 * Generates Markdown documentation from code on a more abstract level
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @param {function} fnAddTagsMarkdown the function that processes doc tags and generates the Markdown documentation
	 * @returns {string} the Markdown documentation
	 */
	fromDoc(code, headingsLevel, fnAddTagsMarkdown) {
		var i,
			out,
			sections;

		// get all documentation sections from code
		sections = this.getSections(code);
		// initialize a string buffer
		out = [];

		out.push("#".repeat(headingsLevel)+" Documentation");

		for (i = 0; i < sections.length; i++) {
			out.push(this.fromSection(sections[i], headingsLevel, fnAddTagsMarkdown));
			if (/^class\s+/.test(sections[i].line)) {
				headingsLevel++;
			}
		}

		// return the contents of the string buffer and add a trailing newline
		return out.join("")+"\n";
	}

	/**
	 * Generates Markdown documentation from a statically typed language's doc comments
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @returns {string} the Markdown documentation
	 */
	fromStaticTypesDoc(code, headingsLevel) {
		return this.fromDoc(code, headingsLevel, (tag, assocBuffer) => {
			var tokens;
			switch (tag.key) {
				case "abstract":     
					this.addToBuffer(assocBuffer, "Abstract", tag.value); break;
				case "access":       
					this.addToBuffer(assocBuffer, "Access", tag.value); break;
				case "author": 
					this.addToBuffer(assocBuffer, "Author", tag.value); break;
				case "constructor": 
					this.addToBuffer(assocBuffer, "Constructor", null); break;
				case "copyright": 
					this.addToBuffer(assocBuffer, "Copyright", tag.value); break;
				case "deprec":
				case "deprecated": 
					this.addToBuffer(assocBuffer, "Deprecated", null); break;
				case "example": 
					this.addToBuffer(assocBuffer, "Example", tag.value); break;
				case "exception":
				case "throws":
					tokens = tag.value.tokenize(/\s+/g, 2);
					this.addToBuffer(assocBuffer, "Exceptions", "`"+tokens[0]+"` — "+tokens[1]);
					break;
				case "exports": 
					this.addToBuffer(assocBuffer, "Exports", tag.value); break;
				case "license": 
					this.addToBuffer(assocBuffer, "License", tag.value); break;
				case "link": 
					this.addToBuffer(assocBuffer, "Link", tag.value); break;
				case "name": 
					this.addToBuffer(assocBuffer, "Alias", tag.value); break;
				case "package": 
					this.addToBuffer(assocBuffer, "Package", tag.value); break;
				case "param":
					tokens = tag.value.tokenize(/\s+/g, 2);
					this.addToBuffer(assocBuffer, "Parameters", "`"+tokens[0]+"` — "+tokens[1]);
					break;
				case "private": 
					this.addToBuffer(assocBuffer, "Private", null); break;
				case "return":
				case "returns": 
					this.addToBuffer(assocBuffer, "Returns", tag.value); break;
				case "see": 
					this.addToBuffer(assocBuffer, "See also", tag.value); break;
				case "since": 
					this.addToBuffer(assocBuffer, "Since", tag.value); break;
				case "static": 
					this.addToBuffer(assocBuffer, "Static", tag.value); break;
				case "subpackage": 
					this.addToBuffer(assocBuffer, "Sub-package", tag.value); break;
				case "this": 
					this.addToBuffer(assocBuffer, "This", "`"+tag.value+"`"); break;
				case "todo": 
					this.addToBuffer(assocBuffer, "To-do", tag.value); break;
				case "version": 
					this.addToBuffer(assocBuffer, "Version", tag.value); break;
				default: break;
			}
		});
	};

	/**
	 * Generates Markdown documentation from a dynamically typed language's doc comments
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @param {function} fnFormatType the function that formats a type information (single argument)
	 * @param {function} fnFormatTypeAndName the function that formats type and name information (two arguments)
	 * @returns {string} the Markdown documentation
	 */
	fromDynamicTypesDoc(code, headingsLevel, fnFormatType, fnFormatTypeAndName) {
		return this.fromDoc(code, headingsLevel, function(tag, assocBuffer) {
			var tokens;
			switch (tag.key) {
				case "abstract": 
					this.addToBuffer(assocBuffer, "Abstract", tag.value); break;
				case "access": 
					this.addToBuffer(assocBuffer, "Access", tag.value); break;
				case "author": 
					this.addToBuffer(assocBuffer, "Author", tag.value); break;
				case "constructor": 
					this.addToBuffer(assocBuffer, "Constructor", null); break;
				case "copyright": 
					this.addToBuffer(assocBuffer, "Copyright", tag.value); break;
				case "deprec":
				case "deprecated": 
					this.addToBuffer(assocBuffer, "Deprecated", null); break;
				case "example": 
					this.addToBuffer(assocBuffer, "Example", tag.value); break;
				case "exception":
				case "throws":
					tokens = tag.value.tokenize(/\s+/g, 2);
					this.addToBuffer(assocBuffer, "Exceptions", fnFormatType(tokens[0])+" — "+tokens[1]);
					break;
				case "exports": 
					this.addToBuffer(assocBuffer, "Exports", tag.value); break;
				case "license": 
					this.addToBuffer(assocBuffer, "License", tag.value); break;
				case "link": 
					this.addToBuffer(assocBuffer, "Link", tag.value); break;
				case "name": 
					this.addToBuffer(assocBuffer, "Alias", tag.value); break;
				case "package": 
					this.addToBuffer(assocBuffer, "Package", tag.value); break;
				case "param":
					tokens = tag.value.tokenize(/\s+/g, 3);
					this.addToBuffer(assocBuffer, "Parameters", fnFormatTypeAndName(tokens[0], tokens[1])+" — "+tokens[2]);
					break;
				case "private": 
					this.addToBuffer(assocBuffer, "Private", null); break;
				case "return":
				case "returns":
					tokens = tag.value.tokenize(/\s+/g, 2);
					this.addToBuffer(assocBuffer, "Returns", fnFormatType(tokens[0])+" — "+tokens[1]);
					break;
				case "see": 
					this.addToBuffer(assocBuffer, "See also", tag.value); break;
				case "since": 
					this.addToBuffer(assocBuffer, "Since", tag.value); break;
				case "static": 
					this.addToBuffer(assocBuffer, "Static", tag.value); break;
				case "subpackage": 
					this.addToBuffer(assocBuffer, "Sub-package", tag.value); break;
				case "this": 
					this.addToBuffer(assocBuffer, "This", "`"+tag.value+"`"); break;
				case "todo": 
					this.addToBuffer(assocBuffer, "To-do", tag.value); break;
				case "var":
					tokens = tag.value.tokenize(/\s+/g, 2);
					this.addToBuffer(assocBuffer, "Type", fnFormatType(tokens[0])+" — "+tokens[1]);
					break;
				case "version": 
					this.addToBuffer(assocBuffer, "Version", tag.value); break;
				default: break;
			}
		});
	};

	/**
	 * Generates Markdown documentation from Javadoc comments
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @returns {string} the Markdown documentation
	 */
	fromJavadoc(code, headingsLevel) {
		return this.fromStaticTypesDoc(code, headingsLevel);
	};

	/**
	 * Generates Markdown documentation from PHPDoc comments
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @returns {string} the Markdown documentation
	 */
	fromPHPDoc(code, headingsLevel) {
		return this.fromDynamicTypesDoc(
			code,
			headingsLevel,
			function (type) {
				return "`"+type+"`";
			},
			function (type, name) {
				// if we have a valid name (and type)
				if (/^\$([a-zA-Z0-9_$]+)$/.test(name)) {
					return "`"+name+"` — `"+type+"`";
				}
				// if it seems we only have a name
				else {
					// return the name that was, wrongly, in the position of the type
					return "`"+type+"`";
				}
			}
		);
	};

	/**
	 * Generates Markdown documentation from JSDoc comments
	 *
	 * @param {string} code the code that contains doc comments
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @returns {string} the Markdown documentation
	 */
	fromJSDoc(code, headingsLevel) {
		return this.fromDynamicTypesDoc(
			code,
			headingsLevel,
			function (type) {
				return "`"+type.substr(1, type.length-2)+"`";
			},
			function (type, name) {
				// if we have a valid type (and name)
				if (/^\{([^{}]+)\}$/.test(type)) {
					return "`"+name+"` — `"+type.substr(1, type.length-2)+"`";
				}
				// if it seems we only have a name
				else {
					// return the name that was, wrongly, in the position of the type
					return "`"+type+"`";
				}
			}
		);
	};

	/**
	 * Generates Markdown documentation from a given section
	 *
	 * The function processes units of documentation, a line of code with accompanying doc comment
	 *
	 * @param {object} section the section that consists of code line and doc comment
	 * @param {number} headingsLevel the headings level to use as the base (1-6)
	 * @param {function} fnAddTagsMarkdown the function that processes doc tags and generates the Markdown documentation
	 * @returns {string} the Markdown documentation
	 */
	fromSection(section, headingsLevel, fnAddTagsMarkdown) {
		var assocBuffer,
			description,
			field,
			out,
			p,
			t,
			tags;

		// initialize a string buffer
		out = [];

		// first get the field that we want to describe
		field = this.getFieldDeclaration(section.line);
		// if there is no field to describe
		if (!field) {
			// do not return any documentation
			return "";
		}

		out.push("\n\n");
		out.push("#".repeat(headingsLevel+1)+" `"+field+"`");

		// split the doc comment into main description and tag section
		var docCommentParts = section.doc.split(/^(?:\t| )*?\*(?:\t| )*?(?=@)/m);
		// get the main description (which may be an empty string)
		var rawMainDescription = docCommentParts.shift();
		// get the tag section (which may be an empty array)
		var rawTags = docCommentParts;

		description = this.getDocDescription(rawMainDescription);
		if (description.length) {
			out.push("\n\n");
			out.push(description);
		}

		tags = this.getDocTags(rawTags);
		if (tags.length) {
			out.push("\n");

			assocBuffer = {};
			for (t = 0; t < tags.length; t++) {
				fnAddTagsMarkdown(tags[t], assocBuffer);
			}

			for (p in assocBuffer) {
				if (assocBuffer.hasOwnProperty(p)) {
					out.push(this.fromTagGroup(p, assocBuffer[p]));
				}
			}
		}

		// return the contents of the string buffer
		return out.join("");
	}

	fromTagGroup(name, entries) {
		var i,
			out;

		// initialize a string buffer
		out = [];

		out.push("\n");
		if (entries.length === 1 && entries[0] === null) {
			out.push(" * **"+name+"**");
		}
		else {
			out.push(" * **"+name+":**");
			if (entries.length > 1) {
				for (i = 0; i < entries.length; i++) {
					out.push("\n");
					out.push("   * "+entries[i]);
				}
			}
			else if (entries.length === 1) {
				out.push(" "+entries[0]);
			}
		}

		// return the contents of the string buffer
		return out.join("");
	}

	getSections(code) {
		var docLine,
			fieldDeclaration,
			m,
			out,
			regex;

		regex = /\/\*\*([^]*?)\*\/([^{;/]+)/gm;
		out = [];

		while ((m = regex.exec(code)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			if (typeof m[1] === "string" && m[1] !== null) {
				if (typeof m[2] === "string" && m[2] !== null) {
					fieldDeclaration = m[2].trim();
					docLine = m[1];

					// if the source code line is an import statement
					if (/^import\s+/.test(fieldDeclaration)) {
						// ignore this piece
						continue;
					}

					// if this is a single line comment
					if (docLine.indexOf("*") === -1) {
						// prepend an asterisk to achieve the normal line structure
						docLine = "*"+docLine;
					}

					// interpret empty lines as if they contained a p-tag
					docLine = docLine.replace(/\*[ ]*$/gm, "* <p>");

					out.push({ "line": fieldDeclaration, "doc": docLine });
				}
			}
		}

		return out;
	}

	getFieldDeclaration(line) {
		var regex = /^([^\{;]+)(.*?)$/gm;
		var m;

		while ((m = regex.exec(line)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			if (typeof m[1] === "string" && m[1] !== null) {
				return this.cleanSingleLine(m[1]);
			}
		}

		return "";
	}

	replaceHTMLWithMarkdown(html) {
		return html.replace(/<\s*?code\s*?>(.*?)<\s*?\/\s*?code\s*?>/g, "`$1`");
	}

	getDocDescription(docLines) {
		var regex = /^(\t| )*?\*(\t| )+(.*?)$/gm;
		var m;
		var out = [];

		while ((m = regex.exec(docLines)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			if (typeof m[3] === "string" && m[3] !== null) {
				m[3] = this.cleanLine(m[3]);
				m[3] = this.replaceHTMLWithMarkdown(m[3]);
				out.push(m[3]);
			}
		}

		return this.cleanLine(out.join(" ").replace(/<(\/)?p>/gi, "\n\n"));
	}

	getDocTags(docLines) {
		const regex = /^(?:\t| )*?@([a-zA-Z]+)([\s\S]*)/;
		var m;
		var out = [];
		for (var i = 0; i < docLines.length; i++) {
			m = regex.exec(docLines[i]);
			if (m !== null) {
				if (typeof m[1] === "string" && m[1] !== null) {
					if (typeof m[2] === "string" && m[2] !== null) {
						// trim leading and trailing space in the tag value
						m[2] = m[2].trim();
						// format multi-line tag values correctly
						m[2] = m[2].split(/[\r\n]{1,2}(?:\t| )*?\*/)

						let value = ''
						const codeBlockRegex = /^(?:\t| )*?```/
						let codeBlock = false
						m[2].forEach((part, index, theArray) => {
							if (codeBlockRegex.exec(part)) {
								codeBlock=!codeBlock
								if (codeBlock) {
									value = value.replace(/\n?[ \t]+$/g,'');  
								}
								value += part.trim() + "\n"
								return
							}
							if (codeBlock) {
								value += part + "\n"
							} else if (index < m[2].length - 1) {
								value += part.trim() + "\n\n     " 
							} else {
								value += part.trim()
							}
						})

						// add the key and value for this tag to the output
						out.push({ "key": this.cleanSingleLine(m[1]), "value": value });
					}
				}
			}
		}

		return out;
	}

	cleanLine(line) {
		// trim leading and trailing spaces
		line = line.trim();

		// clear spaces before and after line breaks and tabs
		line = line.replace(/ *([\n\r\t]) */gm, "$1");

		// make consecutive spaces one
		line = line.replace(/[ ]{2,}/g, " ");

		return line;
	}

	cleanSingleLine(line) {
		// perform normal line cleaning
		line = this.cleanLine(line);

		// replace line breaks and tabs with spaces
		line = line.replace(/(\n|\r|\t)/g, " ");

		return line;
	}

	addToBuffer(buffer, key, value) {
		if (typeof buffer[key] === "undefined" || buffer[key] === null) {
			buffer[key] = [];
		}
		buffer[key].push(value);
	}

}

String.prototype.tokenize = function(splitByRegex, limit) {
	var counter,
		i,
		m,
		start,
		tokens;

	tokens = [];
	counter = 1;
	start = 0;

	while ((m = splitByRegex.exec(this)) !== null) {
		if (m.index === splitByRegex.lastIndex) {
			splitByRegex.lastIndex++;
		}

		if (counter < limit) {
			tokens.push(this.substring(start, m.index));
			start = m.index + m[0].length;
		}

		counter++;
	}

	// add the remainder as a single part
	tokens.push(this.substring(start));

	// fill the array to match the limit if necessary
	for (i = tokens.length; i < limit; i++) {
		tokens.push("");
	}

	return tokens;
};

String.prototype.repeat = function(count) {
	return new Array(count + 1).join(this);
};

module.exports = {JavadocToMarkdown: JavadocToMarkdown};