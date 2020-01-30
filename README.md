# rethinkdb-client-side-js
Rethinkdb tool for use the driver in browsers with node.js

1. Link this script in the node with require, and in the browser with script tag

2.1 Example on the browser side

```
// Overwrite this function only the first time as setup.
query.run = function(branch, ctx) {
  console.log(branch, ctx);
  // Now, send this two vars to node.js backed with xmlhttprequest, websocket, or what you want, also return a promise to return the result.
}

// now, use the driver:
query.query.table('test').filter({a:1}).run();
```

2.2 Example on the server side

```
// Parse and translate the driver here
function(branch, ctx) {
				branch = q.decode(branch); // Decode branch codes to methods.
				let query = r; // r is the real rethinkdb driver already connected.
												
				while (branch.length > 0) {
					query = query[ branch[0] ].apply( query, branch[1] );
					branch.splice(0, 2);
				}

				return query.run(conn)
										.then(function(cursor) {
											if (typeof cursor === 'object' && 'toArray' in cursor) {
												return cursor.toArray();
											}

											return cursor;
										});
}
// use the ctx variable to determine security validations, and validate the branch query before translate.
```
