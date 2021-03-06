import { processOpcodes } from "htmlbars/compiler/utils";
import { prepareHelper } from "htmlbars/compiler/helpers";
import { helper } from "htmlbars/compiler/invoke";
import { popStack, pushStack } from "htmlbars/compiler/stack";
import { string, hash, quotedArray } from "htmlbars/compiler/quoting";

function AttrCompiler() {};

var attrCompiler = AttrCompiler.prototype;

attrCompiler.compile = function(opcodes, options) {
  this.output = [];
  this.stackNumber = 0;
  this.stack = [];

  this.preamble();
  processOpcodes(this, opcodes);
  this.postamble();

  return new Function('context', 'options', this.output.join("\n"));
};

attrCompiler.preamble = function() {
  this.push("var buffer = ''");
};

attrCompiler.postamble = function() {
  this.push("return buffer");
};

attrCompiler.content = function(str) {
  this.push("buffer += " + string(str));
};

attrCompiler.dynamic = function(parts, escaped) {
  pushStack(this.stack, helper('resolveInAttr', 'context', quotedArray(parts), 'options'))
};

attrCompiler.ambiguous = function(string, escaped) {
  pushStack(this.stack, helper('ambiguousAttr', 'context', quotedArray([string]), 'options'));
};

attrCompiler.helper = function(name, size, escaped) {
  var prepared = prepareHelper(this.stack, size);

  prepared.options.push('rerender:options.rerender');

  pushStack(this.stack, helper('helperAttr', 'context', string(name), prepared.args, hash(prepared.options)));
};

attrCompiler.appendText = function() {
  this.push("buffer += " + popStack(this.stack));
}

attrCompiler.program = function() {
  pushStack(this.stack, null);
}

attrCompiler.id = function(parts) {
  pushStack(this.stack, string('id'));
  pushStack(this.stack, string(parts[0]));
}

attrCompiler.literal = function(literal) {
  pushStack(this.stack, string(typeof literal));
  pushStack(this.stack, literal);
};

attrCompiler.string = function(str) {
  pushStack(this.stack, string(typeof literal));
  pushStack(this.stack, string(str));
};

attrCompiler.stackLiteral = function(literal) {
  pushStack(this.stack, literal);
};

attrCompiler.push = function(string) {
  this.output.push(string + ";");
};

export { AttrCompiler };