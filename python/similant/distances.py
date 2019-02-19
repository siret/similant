import numpy as np
from math import sqrt

#from numba import jit

# Support

def pairwise_distance(descriptors, distance):
	m = []
	for i in range(0, len(descriptors)):
		m.append([])
		for j in range(0, len(descriptors)):
			m[i].append(distance(descriptors[i]["value"], descriptors[j]["value"]))
	return np.array(m)

# Distances

#@jit(nopython=True)
def DTWDistanceWindowed(seq1, seq2, windowSize = 3):
    DTW = np.full((len(seq1)+1, len(seq2)+1), np.inf)
    DTW[0,0] = 0

    for i in range(1,len(seq1)+1):
        for j in range(max(1, i-windowSize), min(len(seq2), i+windowSize)+1):
            dist = (seq1[i-1]-seq2[j-1])**2
            DTW[i, j] = dist + min(DTW[i-1, j],DTW[i, j-1], DTW[i-1, j-1])

    return sqrt(DTW[len(seq1), len(seq2)])

#@jit(nopython=True)
def ChiSquare(hist1, hist2):
    dist = 0
    for i in range(0, len(hist1)):
        s = hist1[i] + hist2[i]
        if s == 0:
            continue
        d2 = (hist1[i] - hist2[i])**2
        dist += d2 / s
    return dist

def JaccardDistance(set1, set2):
    if len(set1) == 0 and len(set2) == 0:
        return 1
    _and = set(set1).intersection(set(set2))
    _or = set(set1).union(set(set2))
    return (len(_or) - len(_and))/len(_or)

def LevenshteinDistance(str1, str2):
    if (str1 == str2):
        return 0;
    LD = np.full((len(str1)+1, len(str2)+1), 0)
        
    for i in range(1,len(str1)+1):
        LD[i, 0] = i;
    for j in range(1,len(str2)+1):
        LD[0, j] = j;
    
    for j in range(1,len(str2)+1):
        for i in range(1,len(str1)+1):
            subCost = 1
            if (str1[i-1] == str2[j-1]):
                subCost = 0
            LD[i, j] = min(LD[i-1, j] + 1, LD[i, j-1] + 1, LD[i-1, j-1] + subCost)
            
    return LD[len(str1), len(str2)]
