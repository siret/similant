#!/usr/bin/env python
# -*- coding: utf-8 -*-

import csv
import os
import argparse
import json
import logging
import contextlib
from functools import reduce

def main():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] - %(message)s",
        datefmt="%H:%M:%S")

    args = read_configuration()
    logging.info("Processing: %s", os.path.basename(args["input"]))

    logging.info("Loading entity to descriptor mapping ...")
    entity_to_descriptor = load_descriptors(args["input"])

    logging.info('Extract entities ...')
    entities = list(map(lambda o: o["id"], entity_to_descriptor))

    logging.info('Extract descriptors ...')
    descriptors = list(map(lambda o: o["value"], entity_to_descriptor))

    logging.info('Transform descriptors to identifiers ...')
    identifiers = set(map(lambda d: descriptor_to_identifier(d), descriptors))
    identifiers_to_descriptors = {}
    for d in descriptors:
      identifiers_to_descriptors[descriptor_to_identifier(d)] = d

    logging.info('Map identifiers to entity ...')
    identifier_to_entities = {}
    for ed in entity_to_descriptor:
      identifier = descriptor_to_identifier(ed["value"])
      if not identifier in identifier_to_entities:
        identifier_to_entities[identifier] = []
      identifier_to_entities[identifier].append(ed["id"])

    logging.info("Writing identifiers ...")
    write_identifiers(identifiers_to_descriptors, args["output"])

    logging.info("Writing identifiers mapping ...")
    write_identifiers_mapping(identifier_to_entities, args["output"])

    logging.info("Done")


def read_configuration():
    parser = argparse.ArgumentParser(
        description="Create a model from a CSV file.")
    parser.add_argument("-i",
                        type=str, dest="input", required=True,
                        help="Path to input csv file.")
    parser.add_argument("--output",
                        type=str, dest="output", required=False,
                        help="Output path.")

    args = vars(parser.parse_args())

    if args["output"] is None:
        input_file = os.path.basename(args["input"])
        args["output"] = input_file[:input_file.rfind(".")]

    return args


def load_descriptors(descriptors_path):
    if not os.path.exists(descriptors_path):
        return []
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


def descriptor_to_identifier(descriptor):
  if not descriptor:
    return "#||empty||#"
  return reduce((lambda x, y: x + "#|#" + y), descriptor)


def write_identifiers(identifier_to_descriptor, path):
  with open(path + "-identifier.csv", "w") as output_stream:
    writer = csv.writer(output_stream)
    writer.writerow(["id", "properties"])
    for identifier in identifier_to_descriptor:
      writer.writerow([identifier] + identifier_to_descriptor[identifier])


def write_identifiers_mapping(identifier_to_entities, path):
  with open(path + "-mapping.csv", "w") as output_stream:
    writer = csv.writer(output_stream)
    writer.writerow(["id", "mapping"])
    for identifier in identifier_to_entities:
      writer.writerow([identifier] + identifier_to_entities[identifier])

@contextlib.contextmanager
def directory_lock(path):
    # This is very optimistic but also easy to do.
    lock_path = os.path.join(path, "lock-dir")
    while True:
        try:
            os.makedirs(lock_path)
            break
        except:
            continue
    yield
    os.removedirs(lock_path)

if __name__ == "__main__":
    main()
