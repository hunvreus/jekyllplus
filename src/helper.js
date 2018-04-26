var moment = require('moment');

module.exports = {
  createModel: function (fields, content = null, model = {}) {
    // Traverse the fields and merge it with content into the model
    for (var i = 0, length = fields.length; i < length; i++) {
      if (fields[i].name) {
        var name = fields[i].name;
        if (fields[i].type == 'object') {
          // For objects, we use a recursion
          content[name] = content[name] ? content[name] : {};
          model[name] = {};
          // We reduce the model in an array if the field is "multiple"
          model[name] = (fields[i].multiple) ?
            [...content[name]].reduce((acc, cur) => {
              return [
                ...acc,
                this.createModel(fields[i].fields, cur),
              ];
            }, []) : this.createModel(fields[i].fields, content[name], model[name]);
        }
        else {
          if (content.hasOwnProperty(name)) {
            // Content exists for this field, we assign it to the model
            model[name] = content[name];
          }
          else {
            // Content doesn't exists for this field, we define a default value
            var value;
            if (typeof fields[i].default !== 'undefined') {
              // Default is pre-defined
              value = fields[i].default;
            }
            else {
              // No pre-defined default, we rely on the type of field
              switch(fields[i].type) {
                case 'select':
                  value = [''];
                  break;
                case 'switch':
                case 'checkbox':
                  value = false;
                  break;
                case 'date':
                  value = moment().format('YYYY-MM-DD');
                  break;
                default:
                  value = '';
              }
            }
            // We assign the value to the model, wrapped in an array if the field is
            // "multiple"
            model[name] = (fields[i].multiple) ? [ value ] : value;
          }
        }
      }
    }
    return model;
  },
  sanitizeObject: function (obj) {
    // Traverse the object and remove all empty/null/undefined values
    Object.keys(obj).forEach((key) => {
      const val = obj[key]
      if (!!val && typeof val === 'object') {
        const keys = Object.keys(val)
        if (!keys.length || keys.every((key) => !val[key])) {
          delete obj[key]
        }
        else if (!this.sanitizeObject(val)) {
          delete obj[key]
        }
      }
      else if (!val) {
        delete obj[key]
      }
    });
    return !!Object.keys(obj).length;
  }
}
