# D3-projects
----------
## Visualization of a network using D3.js
Data visualization of a conference network using D3.js library

### The data
#####Format and purpose of the data

1. The data represents the users and papers of a conference;

2. The data itself is originated from the [`.gdf`](https://gephi.org/users/supported-graph-formats/gdf-format/) file inside `data/`;

3. This `.gdf` is pre-processed (see below) and transformed into a [`.json`](http://www.w3schools.com/json/json_files.asp) with additional information.

----------

### Data pre-processing
#####Done once, prepares the data for the visualization front-end and creates the `.json`.

1. The `data` directory contains scripts for data pre-processing;

2. `process_data` is a python script to run the whole pre-processing;

3. The `clustering` directory has all the necessary intermediate files created by `process_data` and the [k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering) C program and source code in `./data/clustering/program`;

4. More info in `data/README.md`.

----------

### Data real-time processing and visualization
#####Done in real time, for every user.
1. [D3.js](d3js.org) is responsible for the real-time data retrieving and rendering;

2. The data is obtained from `./data/data.json` using the `./scripts/ex4.js` script;

3. The JavaScript should be called by `./demo.html` by running a local server, for example. Note that it may not work by opening `demo.html` with a browser, because external files are required;

4. A few screenshots of the visualization working can be found in `./samples/`;

5. The D3 visualization chosen is the [Hierarchical Edge Bundling](https://bl.ocks.org/mbostock/7607999).

----------

*[Lucas Parzianello - 2016](https://github.com/lucas22/d3-projects)*
