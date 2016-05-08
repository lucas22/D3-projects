## D3-projects data pre-processing
----------
Done using `process_data`, which generates the `data.json` file according to the `.gdf`.

#### Execution:

- Input: `none` (`bipartite_nodes_CSCW2013_URL_time.gdf` is accessed inside the program)
- Parameters: `none`
- Execution: `$ ./process_data`
- Output: `data.json`

#### Summary of how process_data works:

1. The `main()` function calls `similarity()`, which calls all the other auxiliary functions. The next steps are started in `similarity()`;

2. First, the `importData()` is called. It reads the information from the `.gdf` and returns 3 lists: participants (users), articles (papers), and a third list containing their relations;

3. Then, the mapping function is called for each list returned but the relations. It maps the not sequential ID numbers to sequential ones;

4. `countPairs()` and `counting()` run a few stats on the retrieved data (see comments). These statistics are not currently saved anywhere after the execution of `process_data`;

5. The following calls to `writeToFile()` and `writeToBinFile()` writes the required files to the clustering work in the next step;

6. Now the `kmeansClustering()` can be called. It executes the C program which runs the [k-means clustering](https://en.wikipedia.org/wiki/K-means_clustering). Note that `number_of_clusters` may be passed as a parameter, with a guess of how many clusters the current data may ideally generate;

7. With the data clustered, the next step is to update the `.json` file with these clusters by calling `updateJSON()`.

#### Now with the data pre-processed, the visualization may be executed.
