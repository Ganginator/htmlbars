function HTMLElement(tag, attributes, children, helpers) {
  this.tag = tag;
  this.attributes = attributes || [];
  this.children = children || [];
  this.helpers = helpers || [];

  if (!attributes) { return; }

  for (var i=0, l=attributes.length; i<l; i++) {
    var attribute = attributes[i];
    attributes[attribute[0]] = attribute[1];
  }
};

function appendChild(node) {
  this.children.push(node);
}

HTMLElement.prototype = {
  appendChild: appendChild,

  removeAttr: function(name) {
    var attributes = this.attributes, attribute;
    delete attributes[name];
    for (var i=0, l=attributes.length; i<l; i++) {
      attribute = attributes[i];
      if (attribute[0] === name) {
        attributes.splice(i, 1);
        break;
      }
    }
  },

  getAttr: function(name) {
    var attributes = this.attributes;
    if (attributes.length !== 1 || attributes[0] instanceof Handlebars.AST.MustacheNode) { return; }
    return attributes[name][0];
  }
}

function BlockElement(helper, children) {
  this.helper = helper;
  this.children = children || [];
};

BlockElement.prototype.appendChild = appendChild;

export { HTMLElement, BlockElement };