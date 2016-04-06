/*************************************************************************
/* Example of using the affinity propagation clustering modules.
/* See BJ Frey and D Dueck, Science 315, 972-976, Feb 16, 2007, for more details
/*
/* Copyright 2007, BJ Frey / D Dueck. This software may be freely */
/* used and distributed for non-commercial purposes.                      */
/**************************************************************************/

#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <dlfcn.h>
#include "apcluster.h"
#include <map>
#include <vector>
#include <ctime>
#include <algorithm>
#include <cstring>

/*callback function; returning non-zero will abort apcluster */
int callback(float *curr_a, float *curr_r, int N, int *curr_idx, int I, double curr_netsim, int iter) {
	if(curr_netsim==-HUGE_VAL) printf("%d\t%s\n", iter, "NaN"); /* cannot calculate netsim */
	else printf("%d\t%f\n", iter, curr_netsim);
	return(0); /* 0=continue apcluster */
}

typedef struct{
	int x, y;
} vec2i;

inline bool operator < (const vec2i& a, const vec2i& b){
	return (a.x<b.x || (a.x==b.x && a.y<b.y));
}

void evaluate_clusters(float* mat, int* clust, const int n){
	std::map<vec2i, float> dist_sum;
	std::map<vec2i, int> count;
	for (int i=0; i<n; ++i) {
		for (int j=1; j<n; ++j) {
			if (clust[i]>=clust[j]) {
				vec2i ip = {clust[j], clust[i]};
				dist_sum[ip] += mat[i*n+j];
				++count[ip];
			} else if (clust[i]<clust[j]){
				vec2i ip = {clust[i], clust[j]};
				dist_sum[ip] += mat[i*n+j];
				++count[ip];
			}
		}
	}

	std::map<vec2i, float>::iterator dit = dist_sum.begin();
	std::map<vec2i, int>::iterator cit = count.begin();
	while(dit!=dist_sum.end()){
		printf("<%i,%i>: %i, %f\n", dit->first.x, dit->first.y, cit->second, dit->second/cit->second);
		++dit;
		++cit;
	}
}

inline void updateIdx(float** dmat, std::vector<int>& idx, std::vector<int>& centers){
	float minv;
	for (int i=0; i<idx.size(); ++i){
		minv = dmat[i][centers[0]];
		idx[i] = 0;
		for (int j=1; j<centers.size(); ++j){
			if (dmat[i][centers[j]]<minv){
				minv = dmat[i][centers[j]];
				idx[i] = j;
			}
		}
	}
}

inline void updateDistAsCenter(float** dmat, std::vector<int>& idx, std::vector<int>& centers, std::vector<float>& distAsCenter){
	distAsCenter.assign(idx.size(), 0);
	for (int i=0; i<idx.size(); ++i){
		for (int j=0; j<i; ++j){
			if (idx[i]==idx[j]){
				distAsCenter[i] += dmat[i][j];
				distAsCenter[j] += dmat[i][j];
			}
		}
	}
}

inline void updateCenters(float** dmat, std::vector<int>& idx, std::vector<int>& centers, std::vector<float>& distAsCenter){
	for (int i=0; i<idx.size(); ++i){
		if (distAsCenter[i]<distAsCenter[centers[idx[i]]]){
			centers[idx[i]] = i;
		}
	}
}

inline float updateTotalDist(std::vector<int>& centers, std::vector<float>& distAsCenter){
	float ret = 0;
	for (int i=0; i<centers.size(); ++i){
		ret += distAsCenter[centers[i]];
	}
	return ret;
}

float kmeans(std::vector<int>& idx ,float* dist, const int& n, const int& k, const int& maxIter){
	idx.resize(n);

	float** dmat = new float*[n];
	for (int i=0; i<n; ++i){
		dmat[i] = &dist[i*n];
	}

	std::vector<int> centers(n);
	for (int i=0; i<n; ++i) centers[i] = i;

	srand(time(NULL));
	int ran, tmp;
	for (int i=0; i<k; ++i) {
		ran = rand()%(n-i)+i;
		tmp = centers[i];
		centers[i] = centers[ran];
		centers[ran] = tmp;
	}
	centers.resize(k);

	std::vector<float> distAsCenter(n);

	float cur=0.0f, prev;
	int count = 0;
	printf("Kmeans clustering:      0 iter.");
	do{
		prev = cur;
		updateIdx(dmat, idx, centers);
		updateDistAsCenter(dmat, idx, centers, distAsCenter);
		updateCenters(dmat, idx, centers, distAsCenter);
		cur = updateTotalDist(centers, distAsCenter);
		++count;
		if(!(count&0xf)){
			printf("\rKmeans clustering: %5i iters.", count);
		}
	} while (abs(cur-prev)>0.0001f && count<maxIter);
	printf("\n");

	for (int i=0; i<n; ++i){
		idx[i] = centers[idx[i]];
	}

	return cur;
}

int main(int argc, char** argv) {

	// open file containing input data
	FILE *ifp;
	//ifp = fopen("input", "r");

	if(argc != 3){
		printf("Usage:\n\t./kmeans_cluster <preference_val> <input_binary>\n\n");
		exit(EXIT_FAILURE);
	}

	char *input_filename = argv[2];
	ifp = fopen(input_filename, "rb");
	if( ifp == NULL ) {
	   printf("Failed to open input file\n");
	   return -1;
	}

	// read input
	char line[100];
	int m;	// number of data points
	float m_float;
	fread(&m_float, sizeof(float), 1, ifp);
	printf("m_float: %f\n", m_float);
	m = (int) m_float;
	/*
	if( fgets(line, 100, ifp) != NULL ) {
	   m = atoi(line);
	   printf("# points to cluster: %d\n", m);
	}
	else {
	   printf("Failed to read input file\n");
	   return -1;
	}
	*/
	float pref = -33.0f;
	pref = atof(argv[1]);
	printf("Preference %f\n# data points: %d\n", pref, m);

	unsigned int N = m * m;
	unsigned int *i = (unsigned int*)calloc(N, sizeof(unsigned int));
	unsigned int *j = (unsigned int*)calloc(N, sizeof(unsigned int));
	float *sij = (float*)calloc(N, sizeof(float));

	// initialize i and j
	int k, l;
	for( k = 0; k < m; k++ ) {
	    for( l = 0; l < m; l++) {
			i[k*m+l] = k;
			j[k*m+l] = l;
	    }
	}

	/*
	int counter = 0;
	while( fgets(line, 100, ifp) != NULL )
	    sij[counter++] = atof(line);
	*/
	fread(sij, sizeof(float), N, ifp);
	// for(k = 0; k < N; k++)
	//    sij[k] = -sij[k];
	// for(k = 0; k < m; k++)
	//    sij[k*m+k] = pref;

	float maximum = 0;
	for (k=0; k<N; ++k)
		if (maximum > sij[k])
			maximum = sij[k];

	maximum = -maximum;

	printf("max: %f\n", maximum);

	for (k=0; k<N; ++k)
		sij[k] += maximum;

	for (k=0; k<m; ++k)
		sij[k*m+k] = 0.0f;

	fclose(ifp);



	// int  (*apclusterf32)(float*,unsigned int*, unsigned int*, unsigned int, int*, double*, APOPTIONS*); /* function pointer */
	// APOPTIONS apoptions={0};
	// void *dlh = NULL;
	// char *error;
	// int iter, *idx=0; /* memory for returning clusters of the data points */
	// double netsim = 0.0; /* variable for returning the final net similarity */
	//
	// if (!(dlh=dlopen("./apclusterunix64.so", RTLD_LAZY))) {printf("%s\n",dlerror()); return(-1);}
	// apclusterf32 = (int (*)(float*,unsigned int*, unsigned int*, unsigned int, int*, double*, APOPTIONS*))dlsym(dlh, "apclusterf32");
	// if((error = dlerror())!=NULL) { printf("%s\n",error); return -2;}
	//
	// apoptions.cbSize = sizeof(APOPTIONS);
	// apoptions.lambda = 0.9;
	// apoptions.minimum_iterations = 1;
	// apoptions.converge_iterations = 200;
	// apoptions.maximum_iterations = 2000;
	// apoptions.nonoise = 0;
	// apoptions.progress=NULL;
	// apoptions.progressf=callback;
	// iter = (*apclusterf32)(sij, i, j, N, idx=(int*)calloc(m,sizeof(*idx)), &netsim, &apoptions); /* actual function call */
	//


	// else printf("Error code: %d\n", iter); /* failed or canceled by user */

	std::vector<int> idx;
	kmeans(idx, sij, m, pref, 1000);
	evaluate_clusters(sij, &idx[0], m);

	FILE* ofp;
	char output_filename[40] = "\0";
	strcat(strcat(output_filename, input_filename), "_out.txt");
	ofp = fopen(output_filename, "w");
	if( ofp == NULL ) {
		printf("Failed to open output\n");
	return -1;
	}

	for( k=0; k<m; k++) fprintf(ofp, "%d\n", idx[k]+1); /* success: print out the indices */

  	fclose(ofp);

	//dlclose(dlh);
	//if(idx) free(idx); /* unload DLL and free memory */
	free(i);
	free(j);
	free(sij);
	return 0;
}
