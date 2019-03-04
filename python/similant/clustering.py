#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import time
import logging

import pandas as pd
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.manifold import TSNE


def process_clustering(
        descriptors, distance_table, n_clusters, output_directory, model_info):
    assert n_clusters < len(distance_table), "Too many clusters required."
    descriptor_clusters = []

    os.makedirs(os.path.join(output_directory, model_info["id"]), exist_ok=True)
    for index in range(1, n_clusters + 1):
        logging.info("Creating cluster: %i", index)
        model = clustering(distance_table, index)

        clusters = _clusters_visualization(
            model["results"], model["clusters"], descriptors)

        clustering_output_file = os.path.join(
            output_directory,
            model_info["id"],
            str(index) + ".json")

        with open(clustering_output_file, "w") as outfile:
            json.dump(clusters, outfile)

        descriptor_clusters.append({
            "id": str(index),
            "size": index,
            "url": "data/descriptors/{}/{}.json".format(
                str(model_info["id"]), str(index))
        })

    descriptor_data = {}
    for desc in descriptors:
        descriptor_data[desc["id"]] = desc["value"]

    model = model_info
    model["clusters"] = descriptor_clusters
    model["data"] = descriptor_data

    descriptors_output_path = os.path.join(
        output_directory,
        model_info["id"] + ".json")
    with open(descriptors_output_path, "w") as outfile:
        json.dump(model, outfile)

    return {
        "id": model_info["title"],
        "name": model_info["title"],
        "url": "/data/descriptors/" + model_info["id"] + ".json"
    }


def clustering(distance_table, n_clusters):
    model = _clustering_generate(distance_table, n_clusters)
    results = pd.DataFrame(
        data={"cluster": model.labels_},
        index=range(0, len(distance_table)))
    clusters = {}

    results["diameter"] = np.nan
    results["centroid_uid"] = 0
    results["dist_to_centroid"] = np.nan

    for index in range(n_clusters):
        cl_users = results.index[results.cluster == index]
        cl_indices = np.where(results["cluster"] == index)[0]
        cl_values = distance_table[cl_indices, :][:, cl_indices]
        cl_mean = np.mean(cl_values, axis=0)

        cl_diameter = cl_mean.min()
        cl_centroid = cl_users[cl_mean.argmin()]
        cl_centroid_id = cl_indices[cl_mean.argmin()]
        cl_distances = distance_table[cl_centroid_id, cl_indices]

        clusters[str(cl_centroid)] = {
            "id": str(cl_centroid),
            "radius": cl_diameter / 2.0,
            "items": [str(x) for x in cl_users]
        }

        results.loc[cl_users, "diameter"] = cl_diameter
        results.loc[cl_users, "centroid_uid"] = cl_centroid
        results.loc[cl_users, "dist_to_centroid"] = cl_distances

    return {
        "model": model,
        "clusters": clusters,
        "results": results
    }


def _clustering_generate(distance_table, n_clusters):
    model = AgglomerativeClustering(
        linkage="average",
        connectivity=None,
        n_clusters=n_clusters,
        affinity="precomputed")
    model.fit(distance_table)
    return model


def _clusters_visualization(results, input_clusters, descriptors):
    logging.info("t-SNE ...")
    tsne = TSNE(n_components=2, verbose=0, perplexity=30, n_iter=1000)
    tsne_results = tsne.fit_transform(results.values)
    logging.info("t-SNE ... done")

    for index, cid in enumerate(input_clusters):
        input_clusters[cid]["pos"] = [
            float(tsne_results[index][0]),
            float(tsne_results[index][1])
        ]

    output = {}
    for cid in input_clusters:
        items = [
            descriptors[int(item)]["id"]
            for item in input_clusters[cid]["items"]
        ]
        input_clusters[cid]["items"] = items
        input_clusters[cid]["id"] = \
            descriptors[int(input_clusters[cid]["id"])]["id"]
        output[descriptors[int(cid)]["id"]] = input_clusters[cid]
    return output
