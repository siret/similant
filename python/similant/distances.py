#!/usr/bin/env python
# -*- coding: utf-8 -*-

from math import sqrt

import numpy as np


def pairwise_distance(descriptors, distance_function):
    m = []
    for i in range(0, len(descriptors)):
        m.append([])
        for j in range(0, len(descriptors)):
            distance = distance_function(
                descriptors[i]["value"], descriptors[j]["value"])
            m[i].append(distance)
    return np.array(m)


def distance_factory(name: str):
    assert name in _DISTANCES, "Unknown distance."
    return _DISTANCES[name]


def _dtw_distance_windowed(left, right, window_size=3):
    dtw = np.full((len(left) + 1, len(right) + 1), np.inf)
    dtw[0, 0] = 0

    for i in range(1, len(left) + 1):
        for j in range(max(1, i - window_size),
                       min(len(right), i + window_size) + 1):
            dist = (left[i - 1] - right[j - 1]) ** 2
            dtw[i, j] = dist + min(dtw[i - 1, j],
                                   dtw[i, j - 1],
                                   dtw[i - 1, j - 1])

    return sqrt(dtw[len(left), len(right)])


def _chi_square(hist1, hist2):
    dist = 0
    for i in range(0, len(hist1)):
        s = hist1[i] + hist2[i]
        if s == 0:
            continue
        d2 = (hist1[i] - hist2[i]) ** 2
        dist += d2 / s
    return dist


def _jaccard_distance(set1, set2):
    if len(set1) == 0 and len(set2) == 0:
        return 1
    and_ = set(set1).intersection(set(set2))
    or_ = set(set1).union(set(set2))
    return (len(or_) - len(and_)) / len(or_)


def _levenshtein_distance(str1, str2):
    if str1 == str2:
        return 0

    ld = np.full((len(str1) + 1, len(str2) + 1), 0)

    for i in range(1, len(str1) + 1):
        ld[i, 0] = i
    for j in range(1, len(str2) + 1):
        ld[0, j] = j

    for j in range(1, len(str2) + 1):
        for i in range(1, len(str1) + 1):
            sub_cost = 1
            if str1[i - 1] == str2[j - 1]:
                sub_cost = 0
            ld[i, j] = min(ld[i - 1, j] + 1,
                           ld[i, j - 1] + 1,
                           ld[i - 1, j - 1] + sub_cost)

    return ld[len(str1), len(str2)]


_DISTANCES = {
    "DTWWindowed": _dtw_distance_windowed,
    "ChiSquare": _chi_square,
    "Jaccard": _jaccard_distance,
    "Levenshtein": _levenshtein_distance
}
