import pandas as pd
import numpy as np
import os
import json
from sklearn.cluster import AgglomerativeClustering

def clustering_generate(m, n_clusters):
    model = AgglomerativeClustering(linkage="average", connectivity=None, n_clusters=n_clusters, affinity="precomputed")
    model.fit(m)
    return model

def clustering(m, n_clusters):
    model = clustering_generate(m, n_clusters)
    results = pd.DataFrame(data={"cluster":model.labels_}, index=range(0, len(m)))
    clusters = {}
    
    results["diameter"] = np.nan
    results["centroid_uid"] = 0
    results["dist_to_centroid"] = np.nan

    for i in range(n_clusters):
        cl_users = results.index[results.cluster == i]
        cl_indeces = np.where(results["cluster"]==i)[0]
        clVals = m[cl_indeces,:]
        clVals = clVals[:,cl_indeces]
        clMeans = np.mean(clVals, axis=0)

        cl_diameter = clMeans.min()
        cl_centroid = cl_users[clMeans.argmin()]
        cl_centroidID = cl_indeces[clMeans.argmin()]
        cl_distances = m[cl_centroidID,cl_indeces]

        clusters[str(cl_centroid)] = {
            "id": str(cl_centroid),
            "radius": cl_diameter / 2.0,
            "items": [str(x) for x in cl_users]
        }
        
        results.loc[cl_users,"diameter"] = cl_diameter
        results.loc[cl_users,"centroid_uid"] = cl_centroid
        results.loc[cl_users,"dist_to_centroid"] = cl_distances
    
    return {
        "model": model,
        "clusters": clusters,
        "results": results
    }

def distances(m, results):
    clusterCentroids = np.where(results["centroid_uid"]==results.index)[0]
    clusterCentroidUIDs = results.index[results.centroid_uid == results.index]

    clusterDistances = m[clusterCentroids,:]
    clusterDistances = clusterDistances[:,clusterCentroids]

    return pd.DataFrame(clusterDistances, index=clusterCentroidUIDs, columns=clusterCentroidUIDs)

import time
from sklearn.manifold import TSNE

def clusters_visualization(results, clusters, descriptors):
    #time_start = time.time()
    tsne = TSNE(n_components=2, verbose=0, perplexity=30, n_iter=1000)
    tsne_results = tsne.fit_transform(results.values)
    #print("t-SNE done! Time elapsed: {} seconds".format(time.time()-time_start))
    
    idx = 0
    for cid in clusters:
        clusters[cid]["pos"] = [ float(tsne_results[idx][0]), float(tsne_results[idx][1]) ]
        idx += 1
    _clusters = {}
    for cid in clusters:
        items = []
        for item in clusters[cid]["items"]:
            items.append(descriptors[int(item)]["id"])
        clusters[cid]["items"] = items
        clusters[cid]["id"] = descriptors[int(clusters[cid]["id"])]["id"]
        _clusters[descriptors[int(cid)]["id"]] = clusters[cid]
    return _clusters;

def process_clustering(descriptors, distance_table, n_clusters, descriptor_name, model_info):    
    n_clusters = min(n_clusters, len(distance_table))

    descriptor_clusters = []
    for n in range(1, n_clusters + 1):
        print("Cluster #" + str(n))
        model = clustering(distance_table, n)
        clusters = clusters_visualization(model["results"], model["clusters"], descriptors)
        filename = descriptor_name + "/" + str(n) + ".json"
        if not os.path.exists(descriptor_name + "/"):
            os.makedirs(descriptor_name + "/")
        with open(filename, "w") as outfile:
            json.dump(clusters, outfile)
        descriptor_clusters.append({
            "id": str(n),
            "size": n,
            "url": "data/descriptors/" + descriptor_name + "/" + str(n) + ".json"
        })

    descriptor_data = {}
    for desc in descriptors:
        descriptor_data[desc["id"]] = desc["value"]

    model = model_info
    model["clusters"] = descriptor_clusters
    model["data"] = descriptor_data

    with open(descriptor_name + ".json", "w") as outfile:
        json.dump(model, outfile)
    
    print("Add new entry into descriptors.json")
    print(json.dumps({
        "id": model_info["title"],
        "name": model_info["title"],
        "url": "/data/descriptors/" + descriptor_name + ".json"
    }))
