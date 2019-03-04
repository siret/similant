#!/usr/bin/env python
# -*- coding: utf-8 -*-

from math import sqrt

import numpy as np


# Support

def pairwise_distance(descriptors, distance_function):
    m = []
    for i in range(0, len(descriptors)):
        m.append([])
        for j in range(0, len(descriptors)):
            distance = distance_function(
                descriptors[i]["value"], descriptors[j]["value"])
            m[i].append(distance)
    return np.array(m)


# Distances

def DTWDistanceWindowed(left, rigth, windowSize=3):
    DTW = np.full((len(left) + 1, len(rigth) + 1), np.inf)
    DTW[0, 0] = 0

    for i in range(1, len(left) + 1):
        for j in range(max(1, i - windowSize), min(len(rigth), i + windowSize) + 1):
            dist = (left[i - 1] - rigth[j - 1]) ** 2
            DTW[i, j] = dist + min(DTW[i - 1, j], DTW[i, j - 1], DTW[i - 1, j - 1])

    return sqrt(DTW[len(seq1), len(seq2)])


def ChiSquare(hist1, hist2):
    dist = 0
    for i in range(0, len(hist1)):
        s = hist1[i] + hist2[i]
        if s == 0:
            continue
        d2 = (hist1[i] - hist2[i]) ** 2
        dist += d2 / s
    return dist


def JaccardDistance(set1, set2):
    if len(set1) == 0 and len(set2) == 0:
        return 1
    and_ = set(set1).intersection(set(set2))
    or_ = set(set1).union(set(set2))
    return (len(or_) - len(and_)) / len(or_)


def LevenshteinDistance(str1, str2):
    if str1 == str2:
        return 0

    ld = np.full((len(str1) + 1, len(str2) + 1), 0)

    for i in range(1, len(str1) + 1):
        ld[i, 0] = i
    for j in range(1, len(str2) + 1):
        ld[0, j] = j

    for j in range(1, len(str2) + 1):
        for i in range(1, len(str1) + 1):
            subCost = 1
            if str1[i - 1] == str2[j - 1]:
                subCost = 0
            ld[i, j] = min(ld[i - 1, j] + 1,
                           ld[i, j - 1] + 1,
                           ld[i - 1, j - 1] + subCost)

    return ld[len(str1), len(str2)]
