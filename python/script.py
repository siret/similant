import csv
import sys
from pathlib import Path

from similant.distances import pairwise_distance, JaccardDistance
from similant.clustering import process_clustering

def load_descriptors(filename):
	if not Path(filename).is_file():
		return None
	descriptors = []
	with open(filename) as csvfile:
		reader = csv.reader(csvfile)
		next(reader, None)
		for row in reader:
			descriptors.append({
				"id" : row[0],
				"value" : row[1:]
			})
	return descriptors

def main(argv):
	input_filename = argv[0] + ".csv"
	descs = load_descriptors(input_filename)
	if descs is None:
		print("Cannot open input file \"" + input_filename + "\"")
	m = pairwise_distance(descs, JaccardDistance)
	process_clustering(descs, m, int(argv[1]), argv[0], {
		"id": argv[0],
		"title": argv[2],
		"type": "set"
	})

if __name__ == "__main__":
	main(sys.argv[1:])
