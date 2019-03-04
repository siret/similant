#!/usr/bin/env python
# -*- coding: utf-8 -*-

import csv
import sys
import os
import argparse
import json
import logging

from similant.distances import pairwise_distance, JaccardDistance
from similant.clustering import process_clustering


def main():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] - %(message)s",
        datefmt="%H:%M:%S")

    args = read_configuration()
    descriptors = load_descriptors(args["input"])
    distances = pairwise_distance(descriptors, JaccardDistance)
    model_reference = process_clustering(
        descriptors,
        distances,
        args["clusters_count"],
        args["output"],
        {
            "id": args["model_name"],
            "title": args["model_name"],
            "type": "set"
        })
    if args.get("add", False):
        add_to_descriptors(model_reference)


def read_configuration():
    parser = argparse.ArgumentParser(
        description="Create a model from a CSV file.")
    parser.add_argument("-i",
                        type=str, dest="input", required=True,
                        help="Path to input csv file.")
    parser.add_argument("--modelName",
                        type=str, dest="model_name", required=False,
                        help="Name of the model, default is input file name.")
    parser.add_argument("--output",
                        type=str, dest="output", required=False,
                        help="Output path, use only if --add is no set.")
    parser.add_argument("--add",
                        dest="add", action="store_true", required=False,
                        help="Add model to SIMILANT.")
    parser.add_argument("-c", "--clusters",
                        type=int, dest="clusters_count", required=False,
                        default=50,
                        help="Number of clusters.")

    args = vars(parser.parse_args())

    if args.get("add", False):
        args["output"] = os.path.join(similant_path(), "descriptors")

    if args["model_name"] is None:
        input_file = os.path.basename(args["input"])
        args["model_name"] = input_file[:input_file.rfind(".")]

    return args


def similant_path():
    this_dir = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(this_dir, "..", "public", "data")


def load_descriptors(descriptors_path):
    assert os.path.isfile(descriptors_path)
    with open(descriptors_path) as input_stream:
        reader = csv.reader(input_stream)
        next(reader, None)
        return [
            {
                "id": row[0],
                "value": row[1:]
            }
            for row in reader
        ]


def add_to_descriptors(reference):
    descriptors_path = os.path.join(similant_path(), "descriptors.json")
    if os.path.exists(descriptors_path):
        with open(descriptors_path) as in_stream:
            data = json.load(in_stream)
    else:
        data = []
    data.append(reference)
    with open(descriptors_path, "w") as out_stream:
        json.dump(data, out_stream)


if __name__ == "__main__":
    main()
