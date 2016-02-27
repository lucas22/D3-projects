(function() {
    packages = {

        // Lazily construct the package hierarchy from class names.
        root: function(classes) {
            var map = {};

            /*
            function find(name, data) {
                var node = map[name], i;
                if (!node) {
                    node = map[name] = data || {name: name, children: []};
                    if (name.length) {
                        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                        node.parent.children.push(node);
                        node.key = name.substring(i + 1);
                    }
                }
                return node;
            }
            */

            function find(name, data, parent) {
                var node = map[name], i;
                if (!node) {
                    node = map[name] = data || {name: name, children: []};
                    if (name.length) {
                        node.parent = parent;
                        node.parent.children.push(node);
                        node.key = name;
                    }
                }
                return node;
            }

            /*
            classes.forEach(function(d) {
                find(d.name, d);
            });
            */

            //console.log(classes);
            for (var c in classes.users){
                find(classes.users[c].userId, classes.users[c], classes.users);
            }

            return map[""];
        },

        // Return a list of imports for the given array of nodes.
        imports: function(nodes, classes) {
            var map = {},
                imports = [];

            //console.log(nodes)

            // Compute a map from name to node.
            nodes.forEach(function(d) {
                //console.log(d)
                map[d.userId] = d;
            });

            console.log(nodes)

            /*
            // For each import, construct a link from the source to target node.
            nodes.forEach(function(d) {
                if (d.imports) d.imports.forEach(function(i) {
                    imports.push({source: map[d.name], target: map[i]});
                });
            });
            */
            console.log(classes.rel);

            classes.rel.forEach(function(d) {
                console.log(d.relUser);
                if (d.relUser) {

                    // TODO: source and target need to be node objects
                    imports.push({source: map[d.relUser], target: map[d.relPaper]});
                }
            });

            console.log(imports);
            return imports;

        }

    };
})();