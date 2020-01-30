(function(exports) {

  const schema = {
          r        : {},
          array    : {},
          selection: {},
          string   : {},
          object   : {},
          value    : {},
          number   : {},
          bool     : {},
          branch   : {}
        }

  // -------------------------------------------------

  schema.r.row                = schema.value;
  schema.r.args               = schema.value;
  schema.r.expr               = schema.value;
  schema.r.asc                = schema.value;
  schema.r.desc               = schema.value;
  schema.r.table              = schema.selection;
  schema.r.hash               = null;
  schema.r.minval             = null;
  schema.r.maxval             = null;

  // -------------------------------------------------

  schema.array.map            = schema.array;
  schema.array.filter         = schema.array;
  schema.array.default        = schema.array;

  // -------------------------------------------------

  schema.selection.changes    = null;
  schema.selection.insert     = null;
  schema.selection.update     = null;
  schema.selection.replace    = null;
  schema.selection.delete     = null;

  schema.selection.run        = null;
  schema.array.run            = null;
  schema.string.run           = null;
  schema.object.run           = null;
  schema.value.run            = null;
  schema.number.run           = null;
  schema.bool.run             = null;
  schema.branch.run           = null;
  schema.object.run           = null;

  // -------------------------------------------------

  schema.selection.innerJoin  = schema.selection;
  schema.selection.outerJoin  = schema.selection;
  schema.selection.eqJoin     = schema.selection;
  schema.selection.withFields = schema.selection;
  schema.selection.skip       = schema.selection;
  schema.selection.count      = schema.number;
  schema.selection.sum        = schema.number;
  schema.selection.avg        = schema.number;
  schema.selection.min        = schema.value;
  schema.selection.max        = schema.value;
  schema.selection.pluck      = schema.selection;
  schema.selection.without    = schema.selection;
  schema.selection.getField   = schema.selection;
  schema.selection.orderBy    = schema.selection;
  schema.selection.slice      = schema.selection;
  schema.selection.filter     = schema.selection;
  schema.selection.nth        = schema.selection;
  schema.selection.get        = schema.selection;
  schema.selection.getAll     = schema.selection;
  schema.selection.between    = schema.selection;
  schema.selection.distinct   = schema.selection;
  schema.selection.concatMap  = schema.selection;
  schema.selection.group      = schema.selection;
  schema.selection.reduce     = schema.selection;
  schema.selection.do         = schema.selection;
  schema.selection.map        = schema.selection;
  schema.selection.ungroup    = schema.selection;
  schema.selection.getField   = schema.selection;
  schema.selection.limit      = schema.selection;
  schema.selection.zip        = schema.selection;
  schema.selection.view       = schema.selection;
  schema.selection.merge      = schema.selection;
  schema.selection.max        = schema.selection;
  schema.selection.default    = schema.value;

  // -------------------------------------------------

  schema.string.slice         = schema.string;
  schema.string.count         = schema.number;
  schema.string.match         = schema.object;
  schema.string.split         = schema.array;
  schema.string.upcase        = schema.string;
  schema.string.downcase      = schema.string;
  schema.string.coerceTo      = schema.value;
  schema.string.default       = schema.string;

  // -------------------------------------------------

  schema.object.count         = schema.number;
  schema.object.pluck         = schema.object;
  schema.object.without       = schema.object;
  schema.object.merge         = schema.object;
  schema.object.getField      = schema.value;
  schema.object.hasFields     = schema.bool;
  schema.object.keys          = schema.array;
  schema.object.values        = schema.array;
  schema.object.and           = schema.bool;
  schema.object.or            = schema.bool;
  schema.object.not           = schema.bool;
  schema.object.default       = schema.object;

  // -------------------------------------------------

  schema.value.row            = schema.value;
  schema.value.add            = schema.value;
  schema.value.eq             = schema.bool;
  schema.value.ne             = schema.bool;
  schema.value.gt             = schema.bool;
  schema.value.ge             = schema.bool;
  schema.value.lt             = schema.bool;
  schema.value.le             = schema.bool;
  schema.value.coerceTo       = schema.value;
  schema.value.match          = schema.object;
  schema.value.and            = schema.bool;
  schema.value.or             = schema.bool;
  schema.value.not            = schema.bool;
  schema.value.between        = schema.bool;
  schema.value.contains       = schema.bool;
  schema.value.default        = schema.value;

  // -------------------------------------------------

  schema.number.sub           = schema.number;
  schema.number.mul           = schema.number;
  schema.number.div           = schema.number;
  schema.number.mod           = schema.number;
  schema.number.round         = schema.number;
  schema.number.ceil          = schema.number;
  schema.number.floor         = schema.number;
  schema.number.default       = schema.value;

  // -------------------------------------------------

  schema.bool.and             = schema.bool;
  schema.bool.or              = schema.bool;
  schema.bool.not             = schema.bool;
  schema.bool.default         = schema.bool;

  // -------------------------------------------------
				
  schema.branch.branch        = schema.branch;

  // -------------------------------------------------
	
	var codes = [];
	exports.methods = {};
		
	Object.keys(schema)
	      .forEach(function(type){
					if (schema[type] === null) {
						return;
					}
					
					Object.keys(schema[type])
								.forEach(function(branch) {
									if (schema[type][branch] === null) {
										exports.methods[branch] = true;
									}
									
									codes[branch] = true;
								});
				});
	
	codes = Object.keys(codes);
	exports.methods = Object.keys(exports.methods);
	
  // -------------------------------------------------

  function query(schema, branch, ctx) {
		const self = this;
			
		self._CTX_ = ctx;
		self._QUERY_ = branch;

		Object.keys(schema)
					.forEach(function(key) {
						self[key] = function() {
							let params = Array.prototype.slice.call(arguments),
									branch = self._QUERY_.concat([ codes.indexOf(key), params ]);
							
							if (schema[key] === null) {
								return exports.run(branch, self._CTX_);
							}

							return new query(schema[key], branch, self._CTX_);
						}
					});
	}

  // -------------------------------------------------

	exports.query = new query(schema.r, [], {});

  // -------------------------------------------------

	exports.decode = function decode(branch) {
		return branch.map(function(_, i) {
			return (i % 2 === 0 ? codes[_] : _);
		})
	}

  // -------------------------------------------------

	exports.run = function run(branch, ctx) {
		return Promise.resolve(branch);
	}

  // -------------------------------------------------

})(typeof module === 'undefined' ? (this.query = {}) : (module.exports = {}));